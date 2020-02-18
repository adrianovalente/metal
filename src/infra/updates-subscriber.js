const redis = require('redis')
const LIGHTS_UPDATE = 'LIGHTS_UPDATE'

module.exports.UpdatesSubscriber = class UpdatesSubscriber {
  constructor ({ config, onUpdate }) {
    this.client = redis
      .createClient({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD
      })

    this.client
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

  healthCheck () {
    const self = this
    if (!self.client) {
      console.log(1)
      return Promise.resolve({ healthy: false })
    }

    return new Promise((res) => {
      self.client.ping((error, data) => {
        console.log(error)
        if (error) {
          return res({ healthy: false, error})
        }

        res({ healthy: true })
      })
    })
  }
}
