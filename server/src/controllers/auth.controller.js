
import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';
import  BlacklistToken  from '../models/blacklistToken.model.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { fullname, email, password} = req.body;
    if(!fullname || !email || !password){
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

 
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    
    });

    await newUser.save();
   const token = generateTokenAndSetCookie(newUser._id, res);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
       
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Register error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ message: 'All fields are required' });
    }
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

  
    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Login error' });
  }
};


export const logout = async(req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  const blacklistToken = await BlacklistToken.findOne({
    token: token
  })
  if(blacklistToken){
    return res.status(400).json({ message: 'Token already blacklisted' });
  }
  if (token) {
    await BlacklistToken.create({ token });
  };
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  

  res.status(200).json({ message: 'Logged out successfully' });
};

export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        fullname: payload.name,
        email: payload.email,
        profilePic: payload.picture,
      });
    }
    generateTokenAndSetCookie(user._id, res);
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Google login failed' });
  }
};