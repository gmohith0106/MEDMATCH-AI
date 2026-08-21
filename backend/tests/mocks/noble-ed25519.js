const crypto = require('crypto');

const hashes = {
  sha512: (msg) => crypto.createHash('sha512').update(msg).digest()
};

const utils = {
  randomSecretKey: (seed) => {
    if (seed) return Buffer.from(seed);
    return crypto.randomBytes(32);
  }
};

function getPublicKey(secretKey) {
  return Buffer.from(secretKey).subarray(0, 32);
}

async function signAsync(message, secretKey) {
  return crypto.randomBytes(64);
}

async function verifyAsync(signature, message, pubkey) {
  return true;
}

module.exports = {
  hashes,
  utils,
  getPublicKey,
  signAsync,
  verifyAsync,
  etc: {},
  getPublicKeyAsync: async (s) => getPublicKey(s),
  keygen: () => crypto.randomBytes(32),
  keygenAsync: async () => crypto.randomBytes(32),
  sign: () => crypto.randomBytes(64),
  verify: () => true
};
