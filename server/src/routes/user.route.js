import express from 'express';
import verifyToken from '../middlewares/authenticateUser.js';
import { updateProfile, checkAuth, getUsersForSidebar } from '../controllers/user.controller.js';
const router = express.Router();

router.put("/update-profile", verifyToken, updateProfile);

router.get("/check", verifyToken, checkAuth)

router.get("/get-users", verifyToken, getUsersForSidebar);



export default router;