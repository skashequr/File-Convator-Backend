const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, fetchGroups, groupExit, addSelfToGroup } = require("../controlers/chatControllers");

const router = express.Router();

router.route("/send").post(accessChat);
router.route("/chat").get(fetchChats);
router.route("/createGroup").post(createGroupChat);
router.route("/fetchGroups").get(fetchGroups);
router.route("/groupExit").put(groupExit);
router.route("/addSelfToGroup").put(addSelfToGroup);

module.exports = router;