require('dotenv').config()

const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.resolve(__dirname, '..', 'db', 'app.sqlite')
const sqlite = new sqlite3.Database(dbPath)

const db = {
  dbPath,

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      sqlite.run(sql, params, function onRun(err) {
        if (err) {
          reject(err)
          return
        }

        resolve({ lastID: this.lastID, changes: this.changes })
      })
    })
  },

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      sqlite.get(sql, params, (err, row) => {
        if (err) {
          reject(err)
          return
        }

        resolve(row)
      })
    })
  },

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      sqlite.all(sql, params, (err, rows) => {
        if (err) {
          reject(err)
          return
        }

        resolve(rows)
      })
    })
  },

  exec(sql) {
    return new Promise((resolve, reject) => {
      sqlite.exec(sql, (err) => {
        if (err) {
          reject(err)
          return
        }

        resolve()
      })
    })
  },

  close() {
    return new Promise((resolve, reject) => {
      sqlite.close((err) => {
        if (err) {
          reject(err)
          return
        }

        resolve()
      })
    })
  },
}

module.exports = db
