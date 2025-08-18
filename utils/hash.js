const bcrypt = require("bcryptjs");

const hashPass = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
};

const comparePass = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};

module.exports = { hashPass, comparePass };
