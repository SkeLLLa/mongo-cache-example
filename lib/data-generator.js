const crypto = require('crypto');
const {promisify} = require('util');
const randomBytes = promisify(crypto.randomBytes);

exports.getRandomString = async (size = 32) => {
  const buffer = await randomBytes(size);
  return buffer.toString('hex');
};
