const joi = require('@hapi/joi')

const schema = joi.object({
    email: joi.string().email().min(1).max(255).required()
})

module.exports.schema = schema

module.exports.validate = function(data) {
    // 通过解构，拿到错误信息字符串error
    // var {异常字符串,值}= 验证规则对象.validate(要验证的数据);
    var { error, value } = schema.validate(data);
    // error ：异常字符串，value：值
    // 如果异常信息字符串不为空，则证明抛出了异常信息
    if (error) {
        // 就返回异常信息
        return error;
    }
    // 否则返回空
    return null;
}