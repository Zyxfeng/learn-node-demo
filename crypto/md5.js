const crypto = require('crypto');

const hash = crypto.createHash('md5');

hash.update('Hello, node');
hash.update('Hello crypto');


console.log(hash.digest('hex'));