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
const officegen = require('officegen')
const PDFParser = require("pdf-parse");
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
  const ext = ".pptx"; // Change to .pptx for PowerPoint format
  const outputFileName = `convertto${ext}`;
  const outputPath = path.join(path.dirname(filePath), outputFileName); // Use the same directory as the uploaded PDF file

  try {
    // Read PDF file
    const pdfBuffer = fs2.readFileSync(filePath);
    let pres = new PptxGenJS();
    // Parse the PDF
    const data = await PDFParser(pdfBuffer);
    
    // Extract text content
    const text = data.text;

    // Split text into chunks (assuming each chunk represents a separate slide)
    const textChunks = text.split('\n\n'); // Change the delimiter as needed
    
    // Add each chunk of text to a new slide
    textChunks.forEach(chunk => {
      const slide = pres.addSlide();
      slide.addText(chunk);
    });

    // Generate the PPT file
    pres.writeFile(outputPath)
      .then(() => {
        console.log('PPT file created:', outputPath);
        fs.unlink(filePath);
        console.log('PDF file deleted:', filePath);
        res.download(outputPath);
      })
      .catch(err => {
        console.error('Error creating PPT:', err);
        res.status(500).send('Error creating PPT');
      });
  } catch (error) {
    // Handle errors
  }
});

const getpdftoppt = asyncHandler(async (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', 'convertto.pptx');
  if (!filePath) {
    return
  }
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
  pdfToPPtGet,
  pdftoppt,
  getpdftoppt
};
