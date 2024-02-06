const express = require("express");
const { PdfToPpt } = require("../controlers/convertControler");
const multer = require("multer");
const router = express.Router();
const upload = multer();
router.route("/").get();
router.route("/").put(upload.none(),PdfToPpt);
module.exports = router;