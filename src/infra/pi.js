const isPi = require('detect-rpi')
const moment = require('moment')

const DONT_CALL_ME_UNTIL = 500 // miliseconds
const SWITCH_SETUP_TIMEOUT = 1000 /// miliseconds
let __dontCallMeUntil, __scheduledChange, __shouldReportButtonPress, __buttonStatus, Gpio, mockSetLightState

if (isPi() && !process.env.JEST_WORKER_ID) {
  Gpio = require('onoff').Gpio
  console.log('Running on pi environment')
} else {
  mockSetLightState = jest.fn()
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
  setTimeout(() => {
    console.log('Button Press Setup')
    __buttonStatus = input.readSync()
    __shouldReportButtonPress = true
  }, SWITCH_SETUP_TIMEOUT)
  input.watch((err, value) => {
    if (err) {
      throw err
    }

    if (__shouldReportButtonPress && (__buttonStatus !== value)) {
      cb()
    }
    __buttonStatus = value
  })
}

module.exports.setLightState = function setLightState (state) {
  const timeout = (__dontCallMeUntil && (moment().diff(__dontCallMeUntil, 'ms') < 0))
        ? DONT_CALL_ME_UNTIL
        : 1

  if (__scheduledChange) {
    clearTimeout(__scheduledChange)
  }

  __scheduledChange = setTimeout(() => {
    output.writeSync(!state ? 1 : 0)
    clearTimeout(__scheduledChange)
  }, timeout)

  __dontCallMeUntil = moment().add(DONT_CALL_ME_UNTIL, 'ms')
}

module.exports.getMockSetLightState = () => mockSetLightState
