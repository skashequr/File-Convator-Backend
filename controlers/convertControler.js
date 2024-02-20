const asyncHandler = require("express-async-handler");
const fs = require("fs").promises;
const fs2 = require("fs")
const path = require("path");
const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);
const { exec } = require('child_process');
const mammoth = require("mammoth");

const PptxGenJS = require("pptxgenjs");
const pptxgen = require('pptxgenjs');


const { PDFDocument } = require('pdf-lib');
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

const pdftoppt = asyncHandler(async (req, res) => {
  const filePath = req.file.path;
  console.log(filePath);

  const outputPath = path.join(__dirname, '..', 'uploads', 'output.pptx');

  const fileStream = fs2.createReadStream(filePath);
  // const writeStream = fs2.createWriteStream(outputPath);

      // Load PDF file
      const pdfBuffer = fs2.readFileSync(req.file.path);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pptx = new pptxgen();
      const slide = pptx.addSlide();

      const pages = pdfDoc.getPages();
      // console.log(...pages.getTextContent);
      for (const page of pages) {
      //   const text = await page.getTextContent();
      //   slide.addText(text.items.map(item => item.str).join('\n'));
      
      }
       // Generate PPT
    // const pptxBuffer = await pptx.output();
    // console.log(pptxBuffer);
  
});



module.exports = {
  PdfToPpt,
  pdfToPPtGet,
  pdftoppt
};
