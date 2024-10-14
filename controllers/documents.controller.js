import multer from 'multer';
import path from 'path';
import fs from 'fs';
import PdfModel from '../models/pdfmodel.js';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});


export const upload = multer({ storage });


export const documents = async (req, res, next) => {
  try {
    const { docName, date } = req.body;

   
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

   
    const newDoc = new PdfModel({
      docName,
      docum: req.file.path, 
      date
    });

    const savedDoc = await newDoc.save();

    if (!savedDoc) {
      return res.status(500).json({ message: 'Failed to save document' });
    }

    res.status(201).json({ message: 'Document uploaded successfully', data: savedDoc });
  } catch (error) {
    console.error('Error in document upload:', error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getdocuments = async (req, res, next) => {
  try {
    const { docName, docum, date } = req.query;
    let filter = {};

    if (docName) {
      filter.docName = new RegExp(docName, "i"); 
    }
    if (docum && docum !== 'All') {
      filter.docum = docum;
    }
    if (date && date !== 'All') {
      filter.date = date;
    }

    
    const documentAd = await PdfModel.find(filter);
    res.status(200).json(documentAd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getdocumentsId = async (req, res) => {
  const { id } = req.params;

  try {
    const getdoc = await PdfModel.findById(id);
    if (!getdoc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(getdoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updatedocumentsId = async (req, res) => {
  const { id } = req.params;
  const { docName, date } = req.body;

  try {
    
    const existingDocument = await PdfModel.findById(id);
    if (!existingDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

   
    let documentPath = existingDocument.docum;
    if (req.file) {
      
      if (existingDocument.docum && fs.existsSync(existingDocument.docum)) {
        fs.unlinkSync(existingDocument.docum);
      }
      documentPath = req.file.path;
    }


    const updatedDocument = await PdfModel.findByIdAndUpdate(
      id,
      { docName, docum: documentPath, date },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deletedocumentsId = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteddocuments = await PdfModel.findByIdAndDelete(id);
    if (!deleteddocuments) {
      return res.status(404).json({ message: "Document not found" });
    }

   
    if (deleteddocuments.docum && fs.existsSync(deleteddocuments.docum)) {
      fs.unlinkSync(deleteddocuments.docum);
    }

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
