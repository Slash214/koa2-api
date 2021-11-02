/**
 * @description 数据格式化
 * @author 爱呵呵
 */


const { timeFormatTwo,timeFormat, ago } = require('../utils/dt')
const { DEFAULT_PICTURE } = require('../conf/constant')
const jwt = require('jsonwebtoken')
const { Token_Config } = require('../conf/secreKey')

/**
 * 用户默认头像
 * @param {Object} obj 用户对象
 */
function _formatUserPictureToken(obj) {
  if (obj.avatar == null) {
    obj.avatar = DEFAULT_PICTURE
  }
  
  if (obj.createdAt) {
    obj.createdAt = timeFormatTwo(obj.createdAt)
    obj.updatedAt = timeFormatTwo(obj.updatedAt)
  }

  /** add token 登陆成功 */
  if (!obj.token) {
    // 签发token 3天的
    const token = jwt.sign(obj, Token_Config.privateKey, { expiresIn: '3d' })
    obj.token = 'ahh' + token
  }
  
  return obj
}

/**
 * 格式化用户信息
 * @param {Array|Object} list 用户列表或者单个用户对象 
 */
function formatUser(list) {
  if (list == null) {
    return list
  }

  if (list instanceof Array) {
    // instanceof 判断是不是数组  用户列表
    return list.map(_formatUserPicture)
  }

  // 单个对象
  return _formatUserPictureToken(list)
}


/**
 * 格式化数据的时间
 * @param {Object} obj 数据
 */
function _formatDBTime(obj) {
  // console.log("我是格式化时间的", obj.createdAt)
  // console.log("我是已经格式了的时间。。。。",timeFormatTwo(obj.createdAt))
  obj.createdAt = timeFormatTwo(obj.createdAt)
  obj.updatedAt = timeFormatTwo(obj.updatedAt)
  obj.shortTime= timeFormat(obj.createdAt)
  obj.ago = ago(timeFormatTwo(obj.createdAt))
  // 新增格式化 天数 
  // console.info("我是修改了的ObbJ", obj)
  return obj
}


/**
 * 格式化博客信息
 * @param {Array|Object} list 微博博客或者是单个博客对象 
 */
function formatBlog(list) {
  if (list == null) {
    return list
  }

  if (list instanceof Array) {
    // 数组
    console.log(1)
    return list.map(_formatDBTime)
  }
  // 对象
  let result = list
  result = _formatDBTime(result)
  return result
}

function formatData(list) {
  if (list == null) {
    return list
  }

  if (list instanceof Array) {
    // 数组
    return list.map(_formatDBTime)
  }

  let result = list
  result = _formatDBTime(result)
  return result
}


module.exports = {
  formatBlog,
  formatUser,
  formatData
}
