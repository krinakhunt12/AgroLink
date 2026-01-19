import jwt from 'jsonwebtoken';

// Generate JWT Token
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Send token response
export const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            userType: user.userType,
            location: user.location,
            isVerified: user.isVerified,
            avatar: user.avatar
        }
    });
};
