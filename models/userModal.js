const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true, min: 3, max: 20, unique: true },
  email: { type: String, required: true, min: 5, max: 50, unique: true },
  password: { type: String, required: true, min: 8 },
  isAvatarImageSet: { type: Boolean, default: false },
  avatarImage: { type: String, default: "" },
});

module.exports = model("Users", userSchema);
