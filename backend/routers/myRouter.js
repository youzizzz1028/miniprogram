const express = require('express')
const db = require('../db/index.js')


const router = express.Router()

router.get('/my', function(req, res) {

    const sql = 'select * from users where user_id = ?;'
    db.query(sql, req.body.user_id, function(err, results) {
        if (err) { return console.log(err.message); }
        res.send(results)
    })

})

const reg_userinfo_schema = require('../schema/user.js')
router.post('/do-change', function(req, res) {

    if (reg_userinfo_schema.validate({ 'email': req.body.email })) {
        return res.cc('验证失败')
    }

    return res.send({
        status: 0,
        msg: '验证成功'
    })

})


module.exports = router