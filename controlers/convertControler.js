// backend/pdfToPptHandler.js
const asyncHandler = require("express-async-handler");
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const XlsxPopulate = require('xlsx-populate');
const PptxGen = require('pptxgenjs');
const officegen = require('officegen');
const PdfToPpt = asyncHandler(async (req, res) => {
  console.log("xxyyzz");
  
});

module.exports = {
  PdfToPpt
};
