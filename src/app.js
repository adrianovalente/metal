const { initConfig, getConfig } = require('./infra/config')
const { UpdatesSubscriber } = require('./infra/updates-subscriber')

let updatesSubscriber

;(async function main () {
  const config = await initConfig().then(getConfig)

  console.log(config)

  updatesSubscriber = new UpdatesSubscriber({
    config,
    onUpdate: () => {
      console.log(new Date() + ' - Just got an update! 💡')
    }
  })
})()
