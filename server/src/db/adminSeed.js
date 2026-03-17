const bcrypt = require('bcrypt')
const db = require('../config/db')

const ADMIN_EMAIL = 'admin@logi.local'
const ADMIN_PASSWORD = 'Admin123!'
const ADMIN_NAME = 'Admin User'
const ADMIN_ROLE = 'admin'
const SALT_ROUNDS = 10

async function seedAdmin() {
  await db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  )

  const existing = await db.get('SELECT id, email, role FROM users WHERE email = ? LIMIT 1', [ADMIN_EMAIL])
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS)

  if (existing) {
    await db.run(
      'UPDATE users SET name = ?, password_hash = ?, role = ? WHERE email = ?',
      [ADMIN_NAME, passwordHash, ADMIN_ROLE, ADMIN_EMAIL],
    )
    console.log(`[admin-seed] updated admin user: ${ADMIN_EMAIL}`)
    return 'updated'
  }

  await db.run(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [ADMIN_NAME, ADMIN_EMAIL, passwordHash, ADMIN_ROLE],
  )

  console.log(`[admin-seed] created admin user: ${ADMIN_EMAIL}`)
  return 'created'
}

module.exports = {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  seedAdmin,
}

if (require.main === module) {
  seedAdmin()
    .then(() => db.close())
    .then(() => process.exit(0))
    .catch(async (err) => {
      console.error('Admin seed failed:', err.message)
      try {
        await db.close()
      } catch (closeErr) {
        console.error('Failed to close database:', closeErr.message)
      }
      process.exit(1)
    })
}
