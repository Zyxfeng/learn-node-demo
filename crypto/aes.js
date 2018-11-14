//AES是一种对称的加密算法，加密和解密都用同一个密钥。

const crypto = require('crypto');

function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const data = 'Hello, this is a secret message!';
const key = 'Password';

let encrypted = aesEncrypt(data, key);
let decrypted = aesDecrypt(encrypted, key);

console.log('Plain Text: ', data);
console.log('Encrypted content: ', encrypted);
console.log('Decrypted massage: ', decrypted);