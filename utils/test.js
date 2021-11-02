const {
    timeModeFormat
  } = require('../utils/dt')

function sd() {
    let s = new Date()
    let b = timeModeFormat(s, 'yyyy-MM-dd-HH:mm')
    console.log(b)
}

sd()