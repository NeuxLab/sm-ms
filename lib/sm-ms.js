const fs = require('fs')
const request = require('request-promise-native')
const {fileURLToPath} = require('cc')

module.exports = {

  upload (input) {
    let filePath = fileURLToPath(cc.images.getRawImage(input.value))
    let options = {
      url: 'https://sm.ms/api/upload',
      formData: { smfile: fs.createReadStream(filePath) },
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36' },
      json: true
    }

    return request.post(options).then(result => {
      if (result.code === 'success') {
        return { type: 'url', value: result.data.url }
      } else {
        throw new Error(result.msg)
      }
    })
  }

}
