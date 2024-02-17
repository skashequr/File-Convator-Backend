const express = require('express');
const multer = require('multer');
const app = express();
const router = express.Router();
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Specify the filename of the uploaded file
  }
});

const upload = multer({ storage: storage });

const { PdfToPpt, pdfToPPtGet } = require('../controlers/convertControler');
router.get("/" , pdfToPPtGet)
router.post('/',upload.single('file'), PdfToPpt);
module.exports = router;