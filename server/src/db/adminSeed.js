const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')

const ADMIN_EMAIL = 'admin@logi.local'
const ADMIN_PASSWORD = 'Admin123!'
const ADMIN_NAME = 'Admin User'
const ADMIN_ROLE = 'admin'
const SALT_ROUNDS = 10

const dbPath = path.resolve(__dirname, 'app.sqlite')
const db = new sqlite3.Database(dbPath)

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err)
        return
      }
      resolve(row)
    })
  })
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err)
        return
      }
      resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

function closeDb() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

async function seedAdmin() {
  const existing = await get('SELECT id, email, role FROM users WHERE email = ? LIMIT 1', [ADMIN_EMAIL])

  if (existing) {
    console.log(`Admin seed skipped: ${ADMIN_EMAIL} already exists.`)
    return
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS)

  await run(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [ADMIN_NAME, ADMIN_EMAIL, passwordHash, ADMIN_ROLE],
  )

  console.log('Admin user created successfully.')

  if (process.env.NODE_ENV !== 'production') {
    console.log('DEV ADMIN CREDENTIALS')
    console.log(`email: ${ADMIN_EMAIL}`)
    console.log(`password: ${ADMIN_PASSWORD}`)
  }
}

seedAdmin()
  .then(() => closeDb())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error('Admin seed failed:', err.message)
    try {
      await closeDb()
    } catch (closeErr) {
      console.error('Failed to close database:', closeErr.message)
    }
    process.exit(1)
  })
