const request = require('request')

module.exports.RemotePersister = class RemotePersister {
  constructor ({ API_URL }) {
    this.apiUrl = API_URL
  }

  async getState () {
    return new Promise ((resolve, reject) => {
      return request({
        uri: this.apiUrl,
        method: 'GET'
      }, (err, res) => {
        if (err) {
          return reject(err)
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Status Code ${res.statusCode} on GET - ${res.body}`))
        }

        return resolve(JSON.parse(res.body))
      })
    })
  }

  async setState (state) {
    return new Promise ((resolve, reject) => {
      return request({
        uri: this.apiUrl,
        method: 'POST',
        json: true,
        body: state
      }, (err, res) => {
        if (err) {
          return reject(err)
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Status Code ${res.statusCode} on POST - ${res.body}`))
        }

        console.log(res.body)
        return resolve(res.body)
      })
    })
  }
}
