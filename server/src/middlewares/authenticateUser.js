

import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const verifyToken = async(req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
     if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }


    req.user = user;
   
   

    next(); 
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default verifyToken;
