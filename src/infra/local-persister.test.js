const uuid = require('uuid')
const { LocalPersister } = require('./local-persister')

const path = `/tmp/metal__local-persister__test__${uuid.v4()}`

const localPersister = new LocalPersister({
  LOCAL_PERSISTER_PATH: path
})

test('should return default value if there is nothing stored', () => {
  expect(localPersister.getStatus()).toEqual({
    description: 'Default config from logal persister',
      pins: [{
        gpio: 2,
        out: false
      }],
      reason: 'DEFAULT_CONFIG'
  })
})

test('should return stored value when there\'s one', () => {
    const status =  {
        description: 'Status from button',
        pins: [{
            gpio: 2,
            out: true
        }],
        reason: 'MANUAL_INPUT'
    }

    localPersister.persistStatus(status)
    expect(localPersister.getStatus()).toEqual(status)

})

