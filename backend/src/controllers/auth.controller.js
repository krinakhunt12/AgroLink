import User from '../models/User.model.js';
import { sendTokenResponse } from '../utils/auth.js';
import axios from 'axios';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { name, phone, password, userType, location } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already registered'
            });
        }

        // Create user
        const user = await User.create({
            name,
            phone,
            password,
            userType,
            userType,
            location,
            language: req.body.language || 'gu'
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;

        // Validate input
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone number and password'
            });
        }

        // Check for user (include password for comparison)
        const user = await User.findOne({ phone }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
    try {
        const { token, userType } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Google token is required'
            });
        }

        // Verify token with Google
        const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
        const { data: googleUser } = await axios.get(googleVerifyUrl);

        if (!googleUser || !googleUser.email) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Google token'
            });
        }

        const { email, sub: googleId, name, picture } = googleUser;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Link Google account if not linked
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                loginMethod: 'google',
                userType: userType || 'buyer', // Default to buyer if not provided
                location: 'Not Specified',
                isVerified: true, // Email verified by Google
                avatar: picture,
                language: 'gu' // Default language
            });
        }

        sendTokenResponse(user, user.isNew ? 201 : 200, res);

    } catch (error) {
        console.error('Google Login Error:', error.response?.data || error.message);
        return res.status(401).json({
            success: false,
            message: 'Google authentication failed'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
