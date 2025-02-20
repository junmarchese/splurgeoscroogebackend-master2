const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user !== undefined,
      "createToken passed user");

  let payload = {
    username: user.username,
  };

  return jwt.sign(payload, JWT_SECRET);
}

module.exports = { createToken };
