const isPi = require('detect-rpi')
const moment = require('moment')

if (typeof jest === 'undefined') {
  // OMG I am so ashamed for that
  jest = require('jest')
}

const mockSetLightState = jest.fn()
const DONT_CALL_ME_UNTIL = 500 // miliseconds
let __dontCallMeUntil, __scheduledChange, Gpio

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
      return mockSetLightState(value)
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
  const timeout = (__dontCallMeUntil && moment().subtract(__dontCallMeUntil) > 0)
        ? DONT_CALL_ME_UNTIL
        : 1

  console.log({ __dontCallMeUntil, __scheduledChange, timeout })

  if (__scheduledChange) {
    clearTimeout(__scheduledChange)
  }

  __scheduledChange = setTimeout(() => output.writeSync(!state ? 1 : 0), timeout)
  __dontCallMeUntil = moment().add(DONT_CALL_ME_UNTIL, 'miliseconds')
}

module.exports.getMockSetLightState = () => mockSetLightState
