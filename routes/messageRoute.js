const { addMessage, getMessages } = require("../controllers/messageController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = require("express").Router();

router.post("/addmsg", isAuthenticated, addMessage);
router.post("/getmsg", isAuthenticated, getMessages);

module.exports = router;
