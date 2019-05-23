const fs = require('fs')
const path = require('path')
const encryptor = require('simple-encryptor')

const Action = {
  ENCRYPT: 'encrypt',
  DECRYPT: 'decrypt'
}

;(function main() {
  const [_, __, action, password] = process.argv
  if (!Object.values(Action).includes(action)) {
    throw new Error(`Action must be one of ${Object.values(Action).join(', ')}`)
  }

  if (!password) {
    throw new Error('Please provide a valid password')
  }

  if (action === Action.ENCRYPT) {
    return encryptVariables(password)
  } else {
    return decryptVariables(password)
  }
})()

function encryptVariables (password) {
  const variables = fs.readFileSync(path.join(__dirname, '../secrets.yml'), 'utf-8')
  const encrypted = encryptor(password).encrypt(variables)
  fs.writeFileSync(path.join(__dirname, '../secrets.yml.encrypted'), encrypted, 'utf-8')
}

function decryptVariables (password) {
  const encrypted = fs.readFileSync(path.join(__dirname, '../secrets.yml.encrypted'), 'utf-8')
  const variables = encryptor(password).decrypt(encrypted)
  fs.writeFileSync(path.join(__dirname, '../secrets.yml'), variables, 'utf-8')
}
