const express = require('express')
const jwt = require('jsonwebtoken')
const { expressjwt: expressjwt } = require('express-jwt')
const session = require('express-session')
const cors = require('cors')

// 创建服务器
const app = express()
//启动服务器
app.listen(8081, function() { console.log('server start at https://127.0.0.1'); })

/* ---------------midwares start----------------- */
//error send midware
app.use(function(req, res, next) {
    res.cc = function(err, status = 1) {
        res.send({
            status: 1,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

//配置cors解决跨域问题
app.use(cors())
//data parse midware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


/* ---------------midwares end------------------- */


//import your routers below
//eg. const mapRouter=require('./routers/mapRouter.js')
const mapRouter = require('./routers/mapRouter.js')
const myRouter = require('./routers/myRouter.js')
const loginRouter = require('./routers/loginController')
//mount your routers below
//eg. app.use('/api/map',mapRouter)
app.use('/api/map', mapRouter)
app.use('/api/my', myRouter)
app.use('/api/login',loginRouter)

//error catch
app.use(function(err, req, res, next) {
    res.cc(err)
})