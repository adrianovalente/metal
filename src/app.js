const { onButtonPress, setLightState }  = require('./infra/pi')

const { initConfig, getConfig } = require('./infra/config')
const { UpdatesSubscriber } = require('./infra/updates-subscriber')
const { LocalPersister } = require('./infra/local-persister')
const { RemotePersister } = require('./infra/remote-persister')

let updatesSubscriber, localPersister, remotePersister

;(async function main () {
  const config = await initConfig().then(getConfig)

  console.log(config)

  updatesSubscriber = new UpdatesSubscriber({
    config,
    onUpdate: () => {
      console.log(new Date() + ' - Just got an update! 💡')
    }
  })

  localPersister = new LocalPersister({
    LOCAL_PERSISTER_PATH: '/home/METAL_PERSISTANCE'
  })

  remotePersister = new RemotePersister({
    API_URL: config.API_URL
  })
})()
