const express = require('express')
const db = require('../db/index.js')

const router = express.Router()

router.get('/building-list', function(req, res) {

    const sql = 'select * from projects;'
    db.query(sql, function(err, results) {
        if (err) { return console.log(err.message); }
        res.send(results)
    })

})


module.exports = router