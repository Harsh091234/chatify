import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import redis from "../utils/redis.js";

// Generate a new access token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });
};

// Verify access token and refresh it when necessary
const verifyToken = async (req, res, next) => {
  const accessToken =
    req.cookies?.access_token || req.headers.authorization?.split(" ")[1];

  const refreshToken = req.cookies?.refresh_token;

  // 1. Try access-token authentication
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      let user;
      const cacheKey = `user:${decoded.id}`;

      const cachedUser = await redis.get(cacheKey);

      if (!cachedUser) {
        console.log("db fetch");
        user = await User.findById(decoded.id).select("-password");

        if (user) {
          await redis.set(cacheKey, JSON.stringify(user), { EX: 300 });
        }
      } else {
        user = JSON.parse(cachedUser);
      }

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized: User not found",
        });
      }

      req.user = user;
      return next();
    } catch (err) {
      // Access token is invalid or expired.
      // Continue to refresh-token authentication.
    }
  }

  // 2. If the access token is missing or invalid,
  // check for a refresh token.
  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized: Refresh token not found",
    });
  }

  try {
    // 3. Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 4. Check whether the refresh token exists in Redis
    const storedRefreshToken = await redis.get(`refreshToken:${decoded.id}`);
    console.log("stored ", storedRefreshToken, " ", "refresh ", refreshToken);
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Unauthorized: Refresh token not found in Redis",
      });
    }

    let user;
    const cacheKey = `user:${decoded.id}`;

    const cachedUser = await redis.get(cacheKey);
    if (!cachedUser) {
      // console.log("db fetch");
      user = await User.findById(decoded.id).select("-password");

      if (user) {
        await redis.set(cacheKey, JSON.stringify(user), { EX: 300 });
      }
    } else {
      user = JSON.parse(cachedUser);
    }

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
      });
    }

    // 6. Generate a new access token
    const newAccessToken = generateAccessToken(user._id);

    // 7. Set the new access-token cookie
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 8. Authenticate the user for the current request
    req.user = user;

    return next();
  } catch (err) {
    if (
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError" ||
      err.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "Unauthorized: Invalid or expired refresh token",
      });
    }

    console.error("Authentication error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default verifyToken;
