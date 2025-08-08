

import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn:'7d',
    }
  );

  res.cookie('token', token);

  return token;
};

export default generateTokenAndSetCookie;
