const express = require("express");
const { PdfToPpt } = require("../controlers/convertControler");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.route("/").get();
router.route("/").post( upload.single('file') , PdfToPpt);
module.exports = router;