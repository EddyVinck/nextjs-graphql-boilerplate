const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../db/resources/user/user.model");
const secret = config.get("jwtSecret");

/**
 * Takes a user object (not a Mongoose Document!) and creates a jwt
 */
const createToken = (user) => {
  const safe = user;
  // TODO: strip sensitive data so it doesn't go on the jwt
  return jwt.sign(safe, secret);
};

const getUserFromToken = async (token) => {
  try {
    const jwtUser = jwt.verify(token, secret);
    let user = await User.findById(jwtUser.id).exec();
    return user.toObject();
  } catch (error) {
    return null;
  }
};

const getUserFromReq = async (req) => {
  const jwtToken =
    (req.headers && req.headers.authorization) ||
    (req.session && req.session.jwt) ||
    "";
  const user = await getUserFromToken(jwtToken);

  return user;
};

module.exports = { createToken, getUserFromToken, getUserFromReq };
