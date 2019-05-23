const fs = require('fs')
const path = require('path')
const yaml = require('yamljs')

let _config

module.exports.initConfig = async function initConfig () {
  _config = yaml.parse(fs.readFileSync(path.join(__dirname, '../../secrets.yml'), 'utf-8'))
}

module.exports.getConfig = function getConfig () {
  if (!_config) {
    throw new Error('You need to call config.init() before using it!')
  }

  return _config
}
