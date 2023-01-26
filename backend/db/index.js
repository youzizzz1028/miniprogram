const mysql = require('mysql')

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'youzi520',
    database: 'hsy'
})

db.query('show tables', (err, results) => {
    if (err) return console.log(err.message)
    console.log(results)
})

module.exports = db