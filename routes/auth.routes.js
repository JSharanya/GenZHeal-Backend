import express from 'express'
import { adminSignin, signin, signup } from '../controllers/auth.contoller.js';



const router = express.Router();

router.post('/signup',signup)
router.post('/signin',signin)
router.post('/admin/signin', adminSignin);


export default router;