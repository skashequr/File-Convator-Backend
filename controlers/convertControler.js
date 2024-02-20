const asyncHandler = require("express-async-handler");
const fs = require("fs").promises;
const path = require("path");
const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);
const mammoth = require("mammoth");
const PptxGenJS = require("pptxgenjs");
const PdfToPpt = asyncHandler(async (req, res) => {
  try {
    console.log("xxyyzz");
    const ext = ".pdf";
    const inputFilePath = req.file.path; // Assuming req.file.path points to the correct file location

    // Construct output file path
    const outputFileName = `data${ext}`;
    const outputFilePath = path.join(
      __dirname,
      "..",
      "uploads",
      outputFileName
    );

    // Read the uploaded file
    const docxBuf = await fs.readFile(inputFilePath);
    let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
    await fs.writeFile(outputFilePath, pdfBuf);

    // Delete the original PDF file
    fs.unlink(inputFilePath, (err) => {
      if (err) {
          console.error("Error deleting PDF file:", err);
      } else {
          console.log("PDF file deleted successfully");
      }
    });

    res.json({ filename: outputFileName });
  
  } catch (err) {
    console.error("Error converting file:", err);
    res.status(500).send("Error converting file: " + err.message);
  }
});


const pdfToPPtGet = asyncHandler(async (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', 'data.pdf');

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      // Delete the file after sending it
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }
  });
});


module.exports = {
  PdfToPpt,
  pdfToPPtGet
};
