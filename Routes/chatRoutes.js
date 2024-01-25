const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, fetchGroups, groupExit } = require("../controlers/chatControllers");

const router = express.Router();

router.route("/send").post(protect , accessChat);
router.route("/send").get(protect ,  fetchChats);
router.route("/createGroup").post(protect , createGroupChat);
router.route("/fetchGroups").get(protect , fetchGroups);
router.route("/groupExit").put(protect , groupExit);

module.exports = router;