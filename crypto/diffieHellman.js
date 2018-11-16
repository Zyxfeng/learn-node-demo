const crypto = require('crypto');

const ming = crypto.createDiffieHellman(512);
const ming_key = ming.generateKeys();

const prime = ming.getPrime();
const generator = ming.getGenerator();

console.log('Prime: ' + prime.toString('hex'));
console.log('Generator: ' + generator.toString('hex'));

const hong = crypto.createDiffieHellman(prime, generator);
const hong_key = hong.generateKeys();

const ming_secret = ming.computeSecret(hong_key);
const hong_secret = hong.computeSecret(ming_key);

console.log('Secret of Xiaoming: ' + ming_secret.toString('hex'));
console.log('Secret of Xiaohong: ' + hong_secret.toString('hex'));

