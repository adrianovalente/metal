const Promise = require('bluebird')

const {
  getMockSetLightState,
  setLightState
} = require('./pi')

test('should bypass debounced calls', async () => {
  setLightState(false)
  await Promise.delay(50)
  setLightState(true)
  await Promise.delay(50)
  setLightState(true)
  await Promise.delay(50)
  setLightState(false)
  await Promise.delay(50)
  setLightState(true)

  await Promise.delay(1000)

  expect(getMockSetLightState().mock.calls.map(([a]) => a))
    .toEqual([1, 0])
})
