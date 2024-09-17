const crypto = require("crypto");

const KEY_LENGTH = 32;

class KeyGenerator {
  static generateKey() {
    return crypto.randomBytes(KEY_LENGTH).toString("hex");
  }
}

module.exports = KeyGenerator;
