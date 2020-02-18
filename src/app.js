const http = require('http')
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
    onUpdate: async () => {
      console.log(new Date() + ' - Just got an update! 💡')

      const state = (await remotePersister.getState()).status
      console.log(state)
      localPersister.persistStatus(state)
      setLightState(lightState(state))
    }

  })

  localPersister = new LocalPersister({
    LOCAL_PERSISTER_PATH: '/home/pi/METAL_PERSISTANCE'
  })

  remotePersister = new RemotePersister({
    API_URL: config.API_URL
  })


  http.createServer(async (req, res) => {
    const healthCheck = await updatesSubscriber.healthCheck()
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.write(JSON.stringify(healthCheck))
    res.end()
  }).listen(8080)


  await init()

  onButtonPress(async () => {
    const state = lightState(localPersister.getStatus())


    // only to provide a real-time experience
    setLightState(!state)

    const description = 'Changed via push button'
    const reason = 'PUSH_BUTTON'

    const newState = {
      description,
      reason,
      pins: [{
        gpio: 2,
        out: !state
      }]
    }

    localPersister.persistStatus(newState)
    await remotePersister.setState({
      status: {
        description,
        reason,
        out: !state
      }
    })
  
  })

})()


async function init () {
  const state = localPersister.getStatus()

  setLightState(lightState(state))
  localPersister.persistStatus(state)
  await remotePersister.setState({
    status: {
      description: state.description,
      out: lightState(state),
      reason: 'ON_RASPBERRY_INIT'
    }
  })

}



function lightState (state) {
  return state.pins[0].out
}
