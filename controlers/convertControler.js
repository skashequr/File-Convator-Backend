// backend/pdfToPptHandler.js
const asyncHandler = require("express-async-handler");
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const XlsxPopulate = require('xlsx-populate');
const PptxGen = require('pptxgenjs');

const PdfToPpt = asyncHandler(async (req, res) => {
  
  try {
    const pdfFilePath = "../uploads"; // Path of the uploaded PDF file
    const outputFolder = './output'; // Output folder where converted files will be saved
    console.log(req.body.formData);
    // Your conversion logic here...

    res.status(200).json({ message: 'Conversion successful' });
  } catch (error) {
    console.error('Error during conversion:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

module.exports = {
  PdfToPpt
};
