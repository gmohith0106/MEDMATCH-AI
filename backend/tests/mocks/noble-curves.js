const ed25519 = {
  getPublicKey: (sk) => Buffer.from(sk).subarray(0, 32),
  sign: () => Buffer.alloc(64),
  verify: () => true,
  utils: {
    randomPrivateKey: () => Buffer.alloc(32)
  }
};

module.exports = {
  ed25519,
  default: {
    ed25519
  }
};
