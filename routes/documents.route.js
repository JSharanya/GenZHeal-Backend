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
  const upload = multer({ storage });

  const router=express.Router();

router.post('/upload-doc',upload.single('docum'),documents)
router.get('/all-doc',getdocuments )
router.get('/all-doc/:id',getdocumentsId )
// router.put('/update-doc/:id',updatedocumentsId)
router.put('/update-doc/:id', upload.single('docum'), updatedocumentsId);

router.delete('/delete-doc/:id',deletedocumentsId)

// router.get('/file/:filename', (req, res) => {
//     const { filename } = req.params;
//     const filePath = path.join(__dirname, '..', 'uploads', filename);
  
//     if (fs.existsSync(filePath)) {
//       res.sendFile(filePath);
//     } else {
//       res.status(404).json({ message: 'File not found' });
//     }
//   });

export default router;