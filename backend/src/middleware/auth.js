import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TokenBlacklist from '../models/TokenBlacklist.js'; // Add this model

export const protect = async (req, res, next) => {
  // 1. Get token from Authorization header
  let token = req.headers.authorization?.split(' ')[1];

  // 2. Try to get token from cookies if not in header
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided'
    });
  }

  try {
    // 3. Check if token is blacklisted
    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ 
        success: false,
        message: 'Token has been revoked'
      });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Check token expiration separately
    const now = Date.now().valueOf() / 1000;
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired'
      });
    }

    // 6. Find user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    // Handle specific JWT errors
    let message = 'Invalid token';
    if (err.name === 'TokenExpiredError') {
      message = 'Token has expired';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token format';
    }

    res.status(401).json({ 
      success: false,
      message
    });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Admin access only' 
    });
  };
};

// New middleware to refresh access tokens
export const refreshTokenMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ 
      success: false,
      message: 'Refresh token missing'
    });
  }

  try {
    // Check if refresh token is blacklisted
    const isBlacklisted = await TokenBlacklist.findOne({ token: refreshToken });
    if (isBlacklisted) {
      return res.status(401).json({ 
        success: false,
        message: 'Refresh token revoked' 
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // Attach new token to response
    res.locals.newAccessToken = accessToken;
    res.locals.user = user;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      message: 'Invalid refresh token' 
    });
  }
};