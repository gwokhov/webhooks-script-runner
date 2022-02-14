const crypto = require('crypto')

module.exports = (body, secret) =>
  `sha1=${crypto.createHmac('sha1', secret).update(body).digest('hex')}`
