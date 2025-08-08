import express from 'express';
import verifyToken from '../middlewares/authenticateUser.js';
import {getMessagesById, sendMessagesById} from '../controllers/message.controller.js';

const router = express.Router();

router.get("/:id", verifyToken, getMessagesById);
router.post("/send/:id", verifyToken, sendMessagesById);
export default router;