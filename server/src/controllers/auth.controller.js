
import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import {generateTokenAndSetCookie} from "../utils/generateTokenAndSetCookie.js"
import BlacklistToken from '../models/blacklistToken.model.js';
import redis from '../utils/redis.js';
// import { OAuth2Client } from 'google-auth-library';

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
    const { refreshToken, accessToken } = await generateTokenAndSetCookie(newUser._id, res);

    // Store refresh token in Redis (7 days expiration)
    await redis.set(`refreshToken:${newUser._id}`, refreshToken, { EX: 7 * 24 * 60 * 60 });

    res.status(201).json({
      message: 'User registered successfully',
      newUser: {
        ...newUser._doc,
        password: undefined,
      },
      refreshToken,
      accessToken
    });
  } 
  catch (error) {
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

    
    const { refreshToken } = generateTokenAndSetCookie(user._id, res);

    await redis.set(`refreshToken:${user._id}`, refreshToken, { EX: 7 * 24 * 60 * 60 });
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        ...user._doc,
        password: undefined
      },
     
      
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Login error' });
  }
};


export const logout = async (req, res) => {
  try {
    const userId = req.user?._id;

    const accessToken =
      req.cookies?.access_token ||
      req.headers.authorization?.split(" ")[1];

    // Clear both cookies, even if the access token is missing.
    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    };

    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", cookieOptions);

    // If the authenticated user is available, remove their refresh token.
    if (userId) {
      await redis.del(`refreshToken:${userId}`);
    }

    // Blacklist the access token if one exists.
    if (accessToken) {
      const alreadyBlacklisted = await BlacklistToken.exists({
        token: accessToken,
      });

      if (!alreadyBlacklisted) {
        await BlacklistToken.create({
          token: accessToken,
        });
      }
    }

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Failed to log out",
    });
  }
};

// export const googleLogin = async (req, res) => {
//   const { credential } = req.body;
//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();
//     let user = await User.findOne({ email: payload.email });
//     if (!user) {
//       user = await User.create({
//         fullname: payload.name,
//         email: payload.email,
//         profilePic: payload.picture,
//       });
//     }
//     generateTokenAndSetCookie(user._id, res);
//     res.json({ user });
//   } catch (err) {
//     res.status(401).json({ message: 'Google login failed' });
//   }
// };