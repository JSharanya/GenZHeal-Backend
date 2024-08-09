import express from 'express';
import { changePassword, getUserProfile, updateUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/profile/changepassword', changePassword);

export default router;
