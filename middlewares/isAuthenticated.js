const jwt = require("jsonwebtoken");
const User = require("../models/userModal");
// require("dotenv").config();

module.exports = async function isAuthenticated(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .json({ status: false, message: "Login First", code: 4 });
    }
    const decodedToken = jwt.verify(
      token,
      process.env.SECRET_KEY,
      async function (err, decoded) {
        if (err) return res.json({ status: false, message: err, code: 5 });

        const user = await User.findById(decoded.user.id);
        req.user = user;
        next();
      }
    );
  } catch (ex) {
    next(ex);
  }
};
