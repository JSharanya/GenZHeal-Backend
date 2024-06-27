import express from 'express'
import { deletevirualclubId, getvirualclub, getvirualclubId, updatevirualclubId, virualclub } from '../controllers/virualclub.controller.js';
// const { virualclub } = require('../controllers/virualclub.controller');
// import virualclub from '../models/virualclub.model';

const router=express.Router();

router.post('/upload-virual',virualclub)
router.get('/all-virual',getvirualclub )
router.get('/all-virual/:id',getvirualclubId )
router.put('/update-virual/:id',updatevirualclubId)
router.delete('/delete-virual/:id',deletevirualclubId)

export default router;