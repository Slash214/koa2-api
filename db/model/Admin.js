/**
 * @description 管理员账号
 * @author 爱呵呵
 */


 const seq = require('../seq')
 const { STRING } = require('../type')
 
 // users 
 const Admin = seq.define('admin', {
    username: {
        type: STRING,
        allowNull: false,
        unique: true,
        comment: '用户名，唯一'
    },
    password: {
        type: STRING,
        allowNull: false,
        comment: '密码'
    }
 })
 
 module.exports = Admin