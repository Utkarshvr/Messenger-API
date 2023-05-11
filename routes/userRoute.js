const {
  register,
  login,
  setAvatar,
  getUser,
  getAllUser,
} = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar", isAuthenticated, setAvatar);
router.post("/getUser", isAuthenticated, getUser);
router.post("/allusers", isAuthenticated, getAllUser);

module.exports = router;
