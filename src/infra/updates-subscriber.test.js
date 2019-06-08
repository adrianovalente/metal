const redis = require('redis')
const fakeredis = require('fakeredis')
const Promise = require('bluebird')

redis.createClient = () => fakeredis.createClient(6379)

const { UpdatesSubscriber } = require('./updates-subscriber')

test('on-update subscription', async () => {
  const onUpdate = jest.fn()

  new UpdatesSubscriber({ config: {}, onUpdate })

  await Promise.delay(50)
  await Promise.promisifyAll(fakeredis.createClient(6379)).publishAsync('LIGHTS_UPDATE', 'Hello')
  await Promise.delay(50)

  expect(onUpdate.mock.calls.length).toBe(1)
})
