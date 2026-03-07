const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.resolve(__dirname, '..', 'db', 'app.sqlite')
const sqlite = new sqlite3.Database(dbPath)

const db = {
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
}

module.exports = db
