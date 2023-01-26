const express = require('express')
const request = require('request')
const loginHandler = require('../router_handler/login')

const router = express.Router()


var loginUrl = 'https://api.weixin.qq.com/sns/jscode2session';
router.post('/reguser', loginHandler.regUser)

module.exports = router