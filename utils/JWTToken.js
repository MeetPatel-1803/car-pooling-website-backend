const jwt = require("jsonwebtoken");
const Profile = require("../models/userProfile");

module.exports = {
  /**
   * This function will generate a JWT Token.
   * @param {*} id
   * @param {*} res
   */
  generateJWTToken(id, res) {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRETKEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return token;
  },

  /**
   * @description This function will verify jwt token.
   * @param {*} token
   * @returns
   */
  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRETKEY);
  },
};
