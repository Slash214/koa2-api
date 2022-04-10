/**
 * @description 
 * @author 爱呵呵
 */

const seq = require('../seq')
const { STRING } = require('../type')

const Demo = seq.define('demo', {
   info: {
    type: STRING,
    allowNull: false,
    comment: '测试的信息'
   }
})

module.exports = Demo