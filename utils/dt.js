/**
 * @description 时间相关的工具函数
 * @author 爱呵呵
 */

const { format } = require('date-fns')

/**
 * 时间格式化
 * @param {string} str 时间 
 * @param {*} mb 格式化时间的样式  默认xxxx年xx月xx日 xx时xx分
 * @returns yyyy.MM.dd HH:mm
 */
const formatTime = (str, mb = 'yyyy.MM.dd HH:mm') => {
  return format(new Date(str), mb)
} 

const formatDay = value => {
  if (value) {
    // 计算出时间 单位秒
    const seconds = Math.floor((+new Date() - +new Date(value)) / 1000)
    if (seconds < 30) {
      return '刚刚'
    }

    // 字典
    const intervals = {
      年: 3600 * 24 * 365,
      月: 3600 * 24 * 30,
      周: 3600 * 24 * 7,
      天: 3600 * 24,
      小时: 3600,
      分钟: 60,
      秒: 1,
    }

    // 计算器
    let counter = 0
    for (const unitName in intervals) {
      if (intervals.hasOwnProperty(unitName)) {
        const unitValue = intervals[unitName];
        counter = Math.floor(seconds / unitValue)
        if (counter > 0) {
          return `${counter}${unitName}前`
        }
      }
    }
  }
  return value
}

module.exports = {
  formatDay,
  formatTime
}
