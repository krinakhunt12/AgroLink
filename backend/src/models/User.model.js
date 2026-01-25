import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allow null/undefined to be unique (if multiple google users don't have phone)
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    googleId: {
        type: String,
        select: false
    },
    loginMethod: {
        type: String,
        enum: ['manual', 'google'],
        default: 'manual'
    },
    userType: {
        type: String,
        enum: ['farmer', 'buyer'],
        required: [true, 'User type is required']
    },
    location: {
        type: String,
        default: 'Not Specified'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    language: {
        type: String,
        enum: ['en', 'gu'],
        default: 'gu'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
