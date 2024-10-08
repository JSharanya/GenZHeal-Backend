import express from 'express';
import { changePassword, getAllUsers, getUserProfilebyId, updateUserProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/profile/:id', getUserProfilebyId);
router.get('/profile', getAllUsers);
router.put('/profile/:id', updateUserProfile);
router.put('/profile/changepassword', changePassword);

export default router;