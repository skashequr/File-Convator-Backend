// backend/pdfToPptHandler.js
const asyncHandler = require("express-async-handler");
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const XlsxPopulate = require('xlsx-populate');
const PptxGen = require('pptxgenjs');




const PdfToPpt = asyncHandler(async (req, res) => {
  console.log("xxyyzz");
  // const pdfBytes = fs.readFileSync("../uploads");
  // console.log(pdfBytes);
  // const pdfDoc = await PDFDocument.load(pdfBytes);

  // const pagesText = [];
  // for (let i = 0; i < pdfDoc.getPageCount(); i++) {
  //   const page = pdfDoc.getPage(i);
  //   const text = await page.getText();
  //   pagesText.push(text);
  // }
  res.json({ filename: req.file.originalname });
});

module.exports = {
  PdfToPpt
};
