import Documents from "../models/documents.model.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder to save the files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

export const documents = async (req, res, next) => {
  const { docName, date } = req.body;
  const documPath = req.file ? req.file.path : null;

  const newDoc = new Documents({
    docName,
    docum: documPath,
    date,
  });

  try {
    const saveDoc = await newDoc.save();
    res.status(200).json(saveDoc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


  export const getdocuments = async (req, res, next) => {
    try {
      const { docName, docum, date } = req.query;
      let filter = {};
      if (docName) {
        filter.docName = new RegExp(docName, "i");
      }
      if (docum && docum!=='All') {
        filter.docum = docum;
      }
      if (date && date!=='All') {
        filter.date = date;
      }
    
  
      const documentAd = await Documents.find(filter);
      res.status(200).json(documentAd);
  
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getdocumentsId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const getdoc = await Documents.findById(id);
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
      // Find the existing document
      const existingDocument = await Documents.findById(id);
      if (!existingDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
  
      // If a new file is uploaded, replace the old one
      let documentPath = existingDocument.docum;
      if (req.file) {
        // Delete the old file if it exists
        if (existingDocument.docum && fs.existsSync(existingDocument.docum)) {
          fs.unlinkSync(existingDocument.docum);
        }
        documentPath = req.file.path;
      }
  
      // Update the document details
      const updatedDocument = await Documents.findByIdAndUpdate(
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
      const deleteddocuments = await Documents.findByIdAndDelete(id);
      if (!deleteddocuments) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };