

import jwt from 'jsonwebtoken';



export const generateTokenAndSetCookie =  (userId, res) => {
  const accessToken = jwt.sign(
    { id: userId},
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env
        .ACCESS_TOKEN_EXPIRES,
    }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET ,
    {
      expiresIn: process.env
        .REFRESH_TOKEN_EXPIRES ,
    }
  );

  
  const accessCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  };

  const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  
  res
    .cookie("access_token", accessToken, accessCookieOptions)
    .cookie("refresh_token", refreshToken, refreshCookieOptions)
 
  return {
    refreshToken,
    accessToken
  }
};


