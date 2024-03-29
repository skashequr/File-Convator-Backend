const asyncHandler = require("express-async-handler");
const fs = require("fs").promises;
const fs2 = require("fs")
const path = require("path");
const libre = require("libreoffice-convert");
libre.convertAsync = require("util").promisify(libre.convert);
const { exec } = require('child_process');
const mammoth = require("mammoth");

const officegen = require('officegen');
const PptxGenJS = require("pptxgenjs");
const pptxgen = require('pptxgenjs');
const PDFParser = require("pdf-parse");
const { PDFDocument } = require('pdf-lib');
const ExcelJS = require('exceljs');
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




//Pdf to excle convert

const pdftoexcel = asyncHandler(async (req, res) => {
  const filePath = req.file.path;
  const ext = ".xlsx"; // Excel format
  const outputFileName = `converted${ext}`;
  const outputPath = path.join(path.dirname(filePath), outputFileName); // Use the same directory as the uploaded PDF file

  try {
    // Read PDF file
    const pdfBuffer = fs2.readFileSync(filePath);
    // Parse the PDF
    const data = await PDFParser(pdfBuffer);
    
    // Extract text content
    const text = data.text;

    // Create Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.addRow([text]); // Add text content as a row

    // Write Excel file
    await workbook.xlsx.writeFile(outputPath);

    // Close the workbook to ensure the file is properly written and closed
    await workbook.xlsx.writeFile(outputPath);

    // Send the Excel file as a response
    res.download(outputPath, outputFileName, async () => {
      // Delete the PDF and Excel files after the download is complete
       fs.unlink(filePath); // Delete the PDF file
      console.log('PDF file deleted:', filePath);

      // Wait for a short delay before attempting to delete the Excel file
      await new Promise(resolve => setTimeout(resolve, 1000));

      // fs.unlink(outputPath); // Delete the Excel file
      console.log('Excel file deleted:', outputPath);
    });
  } catch (error) {
    console.error('Error converting PDF to Excel:', error);
    res.status(500).send('Error converting PDF to Excel');
  }
});
//get excle
const getpdftoexcle = asyncHandler(async (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', 'converted.xlsx');
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

//ppt to pdf convert 
const pptToPdfConvert = asyncHandler(async (req, res) => {
  console.log("Converting PowerPoint to PDF...");
  const filePath = req.file.path;
  const ext = ".pdf";
  const outputFileName = `converted${ext}`;
  const outputPath = path.join(path.dirname(filePath), outputFileName);
  const fileBuffer = fs2.readFileSync(filePath);

  libre.convert(fileBuffer, ext, undefined, (err, result) => {
    if (err) {
      console.error('Error converting file:', err);
      return res.status(500).json({ error: 'Error converting file' });
    }

    // Write the converted PDF buffer to a file
    fs2.writeFile(outputPath, result, (err) => {
      if (err) {
        console.error('Error writing PDF file:', err);
        return res.status(500).json({ error: 'Error writing PDF file' });
      }

      console.log('PDF file saved successfully:', outputPath);

      // Unlink (delete) the original PPT file
      fs2.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting original PPT file:', err);
          // This is not critical, so we don't return an error response here
        } else {
          console.log('Original PPT file deleted successfully:', filePath);
        }
      });
      
      // Send the path to the saved PDF file in the response
      return res.status(200).json({ message: 'PDF conversion successful', pdfPath: outputPath });
    });
  });
});

const getppttopdf = asyncHandler(async (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', 'converted.pdf');
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
  getpdftoppt,
  pdftoexcel,
  getpdftoexcle,
  pptToPdfConvert,
  getppttopdf
};
