const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = process.env.JWT_SECRET;

class Auth {
  static async sign(data) {
    const authToken = JWT.sign(data, secret, {
      expiresIn: process.env.EXPIRESIN,
    });
    return { authToken };
  }
  static async verify(token) {
    return JWT.verify(token, secret);
  }
  static async hash(password) {
    return bcrypt.hash(password, 12);
  }
  static async decode(new_password, password) {
    return bcrypt.compare(new_password, password);
  }
  static async authentication(req, res, next) {
    try {
      const bearer = req.headers["authorization"];
      const token = bearer.split(" ")[1];
      const user = await this.verify(token);
      req.user = user;
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    next();
  }
}

module.exports = Auth;
