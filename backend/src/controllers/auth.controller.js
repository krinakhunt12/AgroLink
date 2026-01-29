import User from '../models/User.model.js';
import { sendTokenResponse } from '../utils/auth.js';
import axios from 'axios';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { name, phone, email, password, userType, location } = req.body;

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
            email,
            password,
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

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is admin
        if (user.userType !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
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

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user with that email'
            });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset url
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;

        const message = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container { font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #f0fdf4; border-radius: 24px; background: #ffffff; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { color: #059669; font-size: 28px; font-weight: 900; letter-spacing: -1px; }
                    .content { color: #374151; line-height: 1.6; }
                    .button-container { text-align: center; margin: 35px 0; }
                    .button { display: inline-block; padding: 16px 32px; background-color: #059669; color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 800; shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.2); }
                    .footer { margin-top: 40px; font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px; }
                    .warning { color: #dc2626; font-size: 13px; font-weight: 600; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">AGROLINK</div>
                        <h2 style="color: #111827; font-weight: 800;">Reset Your Password</h2>
                    </div>
                    <div class="content">
                        <p>Hello <strong>${user.name}</strong>,</p>
                        <p>We received a request to reset your AgroLink account password. No changes have been made to your account yet.</p>
                        <p>You can reset your password by clicking the button below:</p>
                        <div class="button-container">
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </div>
                        <p class="warning">This link is valid for 10 minutes only.</p>
                        <p>If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
                    </div>
                    <div class="footer">
                        &copy; 2024 AgroLink - Empowering Farmers. <br>
                        This is an automated message, please do not reply.
                    </div>
                </div>
            </body>
            </html>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request - AgroLink',
                html: message
            });

            res.status(200).json({
                success: true,
                data: 'Email sent'
            });
        } catch (error) {
            console.error('Email send error:', error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent'
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
            email: req.query.email
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
