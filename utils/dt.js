/**
 * @description 时间相关的工具函数
 * @author 爱呵呵
 */

const {
  format
} = require('date-fns')

function timeModeFormat(str, mb) {
  return format(new Date(str), mb)
}

function timeFormat(str) {
  // return format(new Date(str), 'yyyy.MM.dd HH:mm')
  return format(new Date(str), 'yyyy.MM.dd')
}

function timeFormatTwo(str) {
  return format(new Date(str), 'yyyy-MM-dd HH:mm:ss')
}


function ago(value) {
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
  timeFormat,
  timeFormatTwo,
  ago,
  timeModeFormat
}
