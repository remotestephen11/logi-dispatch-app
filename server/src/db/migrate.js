const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

const schemaSql = fs.readFileSync(schemaPath, 'utf8');

async function migrate() {
  await db.exec(schemaSql);

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

  const quoteColumns = await db.all('PRAGMA table_info(quotes)');
  const existingQuoteColumns = new Set(quoteColumns.map((column) => column.name));
  const missingQuoteColumns = requiredQuoteColumns.filter(
    (column) => !existingQuoteColumns.has(column.name),
  );

  for (const column of missingQuoteColumns) {
    await db.run(`ALTER TABLE quotes ADD COLUMN ${column.name} ${column.sqlType}`);
  }

  const blogColumns = await db.all('PRAGMA table_info(blog_posts)');
  const existingBlogColumns = new Set(blogColumns.map((column) => column.name));
  const missingBlogColumns = requiredBlogColumns.filter(
    (column) => !existingBlogColumns.has(column.name),
  );

  for (const column of missingBlogColumns) {
    await db.run(`ALTER TABLE blog_posts ADD COLUMN ${column.name} ${column.sqlType}`);
  }
}

migrate()
  .then(() => {
    console.log('Migration completed successfully.');
    return db.close();
  })
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error('Migration failed:', err.message);
    try {
      await db.close();
    } catch (closeErr) {
      console.error('Failed to close database:', closeErr.message);
    }
    process.exit(1);
  });
