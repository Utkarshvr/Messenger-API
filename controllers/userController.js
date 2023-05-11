const User = require("../models/userModal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return res.json({
        msg: "Username already exists",
        code: 1,
        status: false,
      });
    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.json({ msg: "Email already exists", code: 2, status: false });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Therefore, Signing A JSON Web Token
    const data = { user: { id: user._id } };
    const token = jwt.sign(data, process.env.SECRET_KEY);
    delete user.password;
    // Sending The Token Associated With The User
    res.status(200).send({ status: true, token });
  } catch (ex) {
    next(ex);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        msg: "Incorrect Username or Password",
        code: 3,
        status: false,
      });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.json({
        msg: "Incorrect Username or Password",
        code: 3,
        status: false,
      });
    }

    // OK, So Email as well as Password matches.
    // Therefore, Signing A JSON Web Token
    const data = { user: { id: user._id } };
    const token = jwt.sign(data, process.env.SECRET_KEY);
    // Sending The Token Associated With The User
    delete user.password;
    res.status(200).send({ status: true, token });
  } catch (ex) {
    next(ex);
  }
};

// Getting the details of the user currently loggedin, i.e. The User which has its token stored.
const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    res.status(200).json({ status: true, user });
  } catch (err) {
    res.status(502).json({ status: false, error: err });
  }
};

const setAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const avatarImage = req.body.image;
    const user = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    const data = { user: { id: user._id } };
    const token = jwt.sign(data, process.env.SECRET_KEY);
    // Sending The Token Associated With The User
    delete user.password;
    return res.json({ status: true, token, avatar: user.avatarImage });
  } catch (ex) {
    next(ex);
  }
};

const getAllUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({ _id: { $ne: userId } }).select("-password");
    res.status(200).json({ status: true, users });
  } catch (err) {
    res.json({ status: false, error: err });
  }
};

module.exports = { register, login, setAvatar, getUser, getAllUser };
