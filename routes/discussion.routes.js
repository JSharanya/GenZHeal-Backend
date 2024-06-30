import express from 'express'
import { createComment } from '../controllers/discussion.controller.js';

const router=express.Router();

router.post('/',createComment)


export default router;