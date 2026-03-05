const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'app.sqlite');
const schemaPath = path.resolve(__dirname, 'schema.sql');

const schemaSql = fs.readFileSync(schemaPath, 'utf8');
const db = new sqlite3.Database(dbPath, (openErr) => {
  if (openErr) {
    console.error('Failed to open SQLite database:', openErr.message);
    process.exit(1);
  }

  db.exec(schemaSql, (execErr) => {
    if (execErr) {
      console.error('Migration failed:', execErr.message);
      db.close(() => process.exit(1));
      return;
    }

    const requiredQuoteColumns = [
      { name: 'pickup_address', sqlType: 'TEXT' },
      { name: 'delivery_address', sqlType: 'TEXT' },
      { name: 'pickup_date', sqlType: 'TEXT' },
      { name: 'vehicle_type', sqlType: 'TEXT' },
      { name: 'service_level', sqlType: 'TEXT' },
      { name: 'cargo_description', sqlType: 'TEXT' },
      { name: 'weight_kg', sqlType: 'REAL' },
      { name: 'value_amount', sqlType: 'REAL' },
      { name: 'attachment_path', sqlType: 'TEXT' },
    ];
    const requiredBlogColumns = [{ name: 'cover_image_url', sqlType: 'TEXT' }];

    db.all('PRAGMA table_info(quotes)', (pragmaErr, columns) => {
      if (pragmaErr) {
        console.error('Failed to inspect quotes table:', pragmaErr.message);
        process.exit(1);
        return;
      }

      const existingColumns = new Set(columns.map((column) => column.name));
      const missingColumns = requiredQuoteColumns.filter(
        (column) => !existingColumns.has(column.name),
      );

      const runBlogColumnMigrations = () => {
        db.all('PRAGMA table_info(blog_posts)', (blogPragmaErr, blogColumns) => {
          if (blogPragmaErr) {
            console.error('Failed to inspect blog_posts table:', blogPragmaErr.message);
            db.close(() => process.exit(1));
            return;
          }

          const existingBlogColumns = new Set(blogColumns.map((column) => column.name));
          const missingBlogColumns = requiredBlogColumns.filter(
            (column) => !existingBlogColumns.has(column.name),
          );

          const runMissingBlogColumns = (blogIndex) => {
            if (blogIndex >= missingBlogColumns.length) {
              console.log('Migration completed successfully.');
              db.close((closeErr) => {
                if (closeErr) {
                  console.error('Failed to close database:', closeErr.message);
                  process.exit(1);
                  return;
                }

                process.exit(0);
              });
              return;
            }

            const blogColumn = missingBlogColumns[blogIndex];
            db.run(
              `ALTER TABLE blog_posts ADD COLUMN ${blogColumn.name} ${blogColumn.sqlType}`,
              (alterBlogErr) => {
                if (alterBlogErr) {
                  console.error(`Failed to add column "${blogColumn.name}":`, alterBlogErr.message);
                  db.close(() => process.exit(1));
                  return;
                }

                runMissingBlogColumns(blogIndex + 1);
              },
            );
          };

          runMissingBlogColumns(0);
        });
      };

      const runColumnMigrations = (index) => {
        if (index >= missingColumns.length) {
          runBlogColumnMigrations();
          return;
        }

        const column = missingColumns[index];
        db.run(
          `ALTER TABLE quotes ADD COLUMN ${column.name} ${column.sqlType}`,
          (alterErr) => {
            if (alterErr) {
              console.error(`Failed to add column "${column.name}":`, alterErr.message);
              db.close(() => process.exit(1));
              return;
            }

            runColumnMigrations(index + 1);
          },
        );
      };

      runColumnMigrations(0);
    });
  });
});
