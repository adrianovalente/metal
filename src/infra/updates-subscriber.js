const redis = require('redis')
const LIGHTS_UPDATE = 'LIGHTS_UPDATE'

module.exports.UpdatesSubscriber = class UpdatesSubscriber {
  constructor ({ config, onUpdate }) {
    redis
      .createClient({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD
      })
      .on('error', e => {
        console.error(e)
      })
      .on('reconnecting', () => console.log('Reconnecting...'))
      .on('connect', () => console.log('Connected!'))
      .on('message', channel => {
        if (channel === LIGHTS_UPDATE) {
          onUpdate()
        }
      })
      .subscribe(LIGHTS_UPDATE)
  }
}
