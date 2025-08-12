

import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn:'7d',
    }
  );

 res.cookie('token', token, {
    httpOnly: true,           // prevent JS access
    secure: process.env.NODE_ENV === 'production', // only HTTPS in prod
    sameSite: 'none',         // allow cross-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  });

  return token;
};

export default generateTokenAndSetCookie;
