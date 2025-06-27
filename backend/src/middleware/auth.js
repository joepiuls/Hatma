import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TokenBlacklist from '../models/TokenBlacklist.js';

export const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });
};

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    console.warn('⛔ No token provided');
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided'
    });
  }

  try {
    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) {
      console.warn('⛔ Token is blacklisted');
      return res.status(401).json({ 
        success: false,
        message: 'Token has been revoked'
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const now = Date.now().valueOf() / 1000;
    if (decoded.exp && decoded.exp < now) {
      console.warn('⛔ Token expired');
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired'
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.warn('⛔ User not found');
      return res.status(401).json({ 
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ Authenticated user:', user.email);
    req.user = user;
    next();
  } catch (err) {
    console.error('❌ Token verification error:', err);
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
  }
};

export const refreshTokenMiddleware = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ 
      success: false,
      message: 'Refresh token missing'
    });
  }

  try {
    const isBlacklisted = await TokenBlacklist.findOne({ token: refreshToken });
    if (isBlacklisted) {
      return res.status(401).json({ 
        success: false,
        message: 'Refresh token revoked' 
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

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
