import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import { createNotification } from '../services/notificationSevices.js';
import TokenBlacklist from '../models/TokenBlacklist.js'; 
import crypto from 'crypto';

const router = express.Router();

// Generate unique token IDs for tracking
const generateTokenId = () => crypto.randomBytes(16).toString('hex');

// Helper to generate tokens
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (userId) => {
  const tokenId = generateTokenId();
  return jwt.sign(
    { id: userId, tokenId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

// Set token cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth/refresh', // Only sent to refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set tokens in cookies
    setTokenCookies(res, accessToken, refreshToken);

    // Convert to plain object and remove password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Create notification
    await createNotification({
      type: 'user',
      subtype: 'new',
      message: `New user registered: ${name}`,
      referenceId: user._id,
      priority: 1,
      context: {
        customer: email,
        items: 1
      }
    });

    return res.status(201).json({ 
      success: true,
      accessToken,
      user: userWithoutPassword 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

router.post('/google-login', async (req, res) => {
  const { tokenId } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ 
        email, 
        name, 
        avatar: picture,
        password: 'google',
        isVerified: true
      });
      await user.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set tokens in cookies
    setTokenCookies(res, accessToken, refreshToken);

    return res.json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(401).json({ 
      success: false,
      error: 'Google login failed' 
    });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'If that email exists, we sent a reset link' 
      });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.RESET_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `
        <p>You requested a password reset for your account.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password</p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return res.json({ 
      success: true,
      message: 'Password reset email sent' 
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Validate password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false,
        message: "Password must contain at least 8 characters, one uppercase, one lowercase, and one number" 
      });
    }

    // Hash and save
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Create notification
    await createNotification({
      type: 'user',
      subtype: 'password-reset',
      message: `Password reset for: ${user.email}`,
      referenceId: user._id,
      priority: 2
    });

    return res.json({ 
      success: true,
      message: "Password reset successfully" 
    });
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Reset link has expired" 
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid reset link" 
      });
    }
    
    console.error('Reset password error:', err);
    return res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set tokens in cookies
    setTokenCookies(res, accessToken, refreshToken);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.json({ 
      success: true,
      accessToken,
      user: userWithoutPassword 
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

if (!req.cookies || !refreshToken) {
  return res.status(401).json({ success: false, error: 'Refresh token missing' });
}

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Check if token is blacklisted
    const isBlacklisted = await TokenBlacklist.exists({ token: refreshToken });
    if (isBlacklisted) {
      return res.status(401).json({ 
        success: false,
        error: 'Refresh token revoked' 
      });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    // Blacklist the old refresh token
    await TokenBlacklist.create({
      token: refreshToken,
      type: 'refresh',
      expiresAt: new Date(decoded.exp * 1000)
    });

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Set new tokens in cookies
    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.json({ 
      success: true,
      accessToken: newAccessToken 
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Refresh token expired' 
      });
    }
    
    console.error('Token refresh error:', error);
    res.status(403).json({ 
      success: false,
      error: 'Invalid refresh token' 
    });
  }
});

router.post('/logout', async (req, res) => {
  try {
    // Get tokens
    const accessToken = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // Add tokens to blacklist
    const blacklistPromises = [];
    
    if (accessToken) {
      const decodedAccess = jwt.decode(accessToken);
      blacklistPromises.push(
        TokenBlacklist.create({
          token: accessToken,
          type: 'access',
          expiresAt: new Date((decodedAccess.exp || 0) * 1000)
        })
      );
    }

    if (refreshToken) {
      const decodedRefresh = jwt.decode(refreshToken);
      blacklistPromises.push(
        TokenBlacklist.create({
          token: refreshToken,
          type: 'refresh',
          expiresAt: new Date((decodedRefresh.exp || 0) * 1000)
        })
      );
    }

    await Promise.all(blacklistPromises);

    // Clear cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh'
    });

    res.status(200).json({ 
      success: true, 
      message: 'Logout successful' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

export default router;