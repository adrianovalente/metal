const fs = require('fs')

const DEFAULT_CONFIG = {
  description : 'Default config from logal persister',
  pins : [{
    gpio : 2,
    out : false
  }],
  reason : 'DEFAULT_CONFIG'
}

module.exports.LocalPersister = class LocalPersister {
  constructor ({ LOCAL_PERSISTER_PATH }) {
    this.path = LOCAL_PERSISTER_PATH
  }

  getStatus () {
    try {
      return JSON.parse(fs.readFileSync(this.path, 'utf-8'))
    } catch (e) {
      console.error(e)
      return DEFAULT_CONFIG
    }
  }

  persistStatus (status) {
    fs.writeFileSync(this.path, JSON.stringify(status), 'utf-8')
  }
}
