const isPi = require('detect-rpi')
let Gpio

if (isPi()) {
  Gpio = require('onoff').Gpio
  console.log('Running on pi environment')
} else {
  Gpio = class GpioMock {
    constructor (pin) {
      this.pin = pin
      console.log(`Mocked pi.`)
    }

    watch () {
      console.log(`Watching pin ${this.pin}`)
    }

    writeSync(value) {
      console.log(`Writing ${value} on pin ${this.pin}`)
    }
  }
}

const output = new Gpio(2, 'out')
const input = new Gpio(3, 'in', 'both', {
  debounceTimeout: 10
})

module.exports.onButtonPress = function onButtonPress (cb) {
  input.watch((err, value) => {
    if (err) throw err

    if (value === 0) {
      cb()
    }
  })
}

module.exports.setLightState = function setLightState (state) {
  return output.writeSync(!state ? 1 : 0)
}
