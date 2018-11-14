const crypto = require('crypto');

const hmac = crypto.createHmac('sha256', 'sceret-key');

hmac.update('Hello nodejs');
hmac.update('Hello Hmac');

console.log(hmac.digest('hex'));