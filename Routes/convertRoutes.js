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

const { PdfToPpt, pdfToPPtGet, pdftoppt, getpdftoppt, pdftoexcel, getpdftoexcle, pptToPdfConvert } = require('../controlers/convertControler');
router.get("/" , pdfToPPtGet)
router.post('/',upload.single('file'), PdfToPpt);
router.post('/pdftoppt',upload.single('file') ,pdftoppt);
router.get('/getppt',getpdftoppt);

router.post('/pdftoexcel',upload.single('file'),pdftoexcel);
router.get('/getpdftoexcle', getpdftoexcle);

router.post('/ppttopdfconvert',upload.single('file'),pptToPdfConvert);
module.exports = router;