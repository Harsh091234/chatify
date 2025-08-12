
import { body } from 'express-validator';
import express from 'express';
import { register, login, logout,googleLogin  } from '../controllers/auth.controller.js';
import verifyToken from '../middlewares/authenticateUser.js';


const router = express.Router();

router.post('/register',[
    body('fullname')
      .isLength({ min: 6 })
      .withMessage('Full name must be at least 6 characters long'),

    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ], register );

  router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
 
  login
);

router.post('/logout',verifyToken, logout);

// router.post('/google', googleLogin);

export default router;
