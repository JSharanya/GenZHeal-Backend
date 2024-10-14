import express from 'express'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { deletedocumentsId, getdocuments, getdocumentsId, updatedocumentsId, documents } from '../controllers/documents.controller.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
  const upload = multer({ dest: 'uploads/' });

  const router=express.Router();

router.post('/upload-doc',upload.single('pdf'),documents)
router.get('/all-doc',getdocuments )
router.get('/all-doc/:id',getdocumentsId )
router.put('/update-doc/:id', upload.single('pdf'), updatedocumentsId);

router.delete('/delete-doc/:id',deletedocumentsId)


router.get('/download-pdf/:filename', (req, res) => {
  const filename = req.params.filename;

  
  const directoryPath = path.join(__dirname, '../uploads');

 
  const filePath = path.join(directoryPath, filename);

  res.download(filePath, `${filename}.pdf`, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    }
  });
});



export default router;