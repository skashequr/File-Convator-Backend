const asyncHandler = require("express-async-handler");
const fs = require('fs').promises;
const path = require('path');
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);
const mammoth = require('mammoth');
const PptxGenJS = require("pptxgenjs");
const PdfToPpt = asyncHandler(async (req, res) => {
  try {
    console.log("xxyyzz");
    const ext = '.pdf';
    const inputFilePath = req.file.path; // Assuming req.file.path points to the correct file location

    // Construct output file path
    // libre.setBinaryPath('/path/to/soffice');
    const outputFileName = `data${ext}`;
    const outputFilePath = path.join(__dirname, '..', 'uploads', outputFileName);

    // Read the uploaded file
    const docxBuf = await fs.readFile(inputFilePath);
    // let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
    


    res.json({ filename: outputFileName });
  } catch (err) {
    console.error("Error converting file:", err);
    res.status(500).send('Error converting file: ' + err.message);
  }
});

module.exports = {
  PdfToPpt
};
