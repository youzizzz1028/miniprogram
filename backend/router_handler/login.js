const db = require('../db/index.js')

exports.regUser=(req,res)=>{
    //接收表单数据
    const userinfo = req.body
    //判断是否曾经注册过
    const sql=`select * from users where user_id = ?`
    db.query(sql,[userinfo.user_id],function(err,results){
        if(err){
            return res.send({status:1,message:err.message})
        }
        //如果可以查出数据，说明曾经登录过
        if(results.length > 0){
            return res.send({status:0,message:'曾经登录过，无须注册'})
        }
        //没有注册过，则插入数据
        else{
            const sql='insert into users set ?'
            db.query(sql, {user_id:userinfo.user_id,user_name:userinfo.user_name,user_image:userinfo.user_image,userpoint:0},function(err, results){
                //如果sql执行失败
                if(err) return res.send({status:1,message:err.message})
                //如果执行成功，但影响行数不为1
                if(results.affectedRows !== 1){
                    return res.send({status:1, message: '注册用户失败，请稍后再试'})
                }
                res.send({status:0, message: '注册成功！'})
            })
        }
    })

    res.send('reguser ok')
}