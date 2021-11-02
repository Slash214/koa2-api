/**
 * @description 用户表
 * @author Joshua
 */

const seq = require('../seq')
const { STRING, INTEGER } = require('../type')

const User = seq.define('user', {
    openid: {
        type: STRING,
        allowNull: false,
        comment: '小程序用户信息标识符'
    }

})

module.exports = User