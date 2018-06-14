const fs = require('fs')
const request = require('request-promise-native')
const { fileURLToPath } = require('cc')

const BYTES_PER_MB = 1000000

module.exports = {

  upload(input) {
    const fileURL = cc.images.getRawImage(input.value)
    if (fileURL == null) { throw new Error('Image not found.') }

    const filePath = fileURLToPath(fileURL)
    const stats = fs.statSync(filePath)
    if (stats.size > 5 * BYTES_PER_MB) {
      throw new Error(`Image filesize (${stats.size / BYTES_PER_MB}MB) larger than 5MB.`)
    }

    const options = {
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
