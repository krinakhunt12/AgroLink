import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import {
    validateUploadedFile,
    generateSecureFilename,
    getSafeStoragePath,
    logSecurityEvent,
    MAX_FILE_SIZE,
    ALLOWED_MIME_TYPES
} from '../utils/fileValidation.js';

/**
 * SECURE FILE UPLOAD MIDDLEWARE
 * 
 * Implements secure file upload handling with:
 * - Temporary storage for validation
 * - Multi-layer security checks
 * - Secure file storage
 * - Automatic cleanup of rejected files
 * - Rate limiting for uploads
 * - Virus scanning
 */

// Upload directories
const TEMP_UPLOAD_DIR = 'uploads/temp';
const PRODUCT_UPLOAD_DIR = 'uploads/products';
const PROFILE_UPLOAD_DIR = 'uploads/profiles';

// Ensure upload directories exist
const ensureUploadDirs = async () => {
    const dirs = [TEMP_UPLOAD_DIR, PRODUCT_UPLOAD_DIR, PROFILE_UPLOAD_DIR];

    for (const dir of dirs) {
        try {
            await fs.access(dir);
        } catch {
            await fs.mkdir(dir, { recursive: true });
        }
    }
};

// Initialize directories
ensureUploadDirs();

/**
 * Multer storage configuration (temporary storage)
 */
const tempStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            await fs.access(TEMP_UPLOAD_DIR);
            cb(null, TEMP_UPLOAD_DIR);
        } catch {
            await fs.mkdir(TEMP_UPLOAD_DIR, { recursive: true });
            cb(null, TEMP_UPLOAD_DIR);
        }
    },
    filename: (req, file, cb) => {
        // Temporary filename (will be renamed after validation)
        const tempName = `temp_${Date.now()}_${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname)}`;
        cb(null, tempName);
    }
});

/**
 * Multer file filter (first line of defense)
 */
const fileFilter = (req, file, cb) => {
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        logSecurityEvent('INVALID_MIME_TYPE', {
            userId: req.user?._id,
            filename: file.originalname,
            mimetype: file.mimetype,
            ip: req.ip
        });

        return cb(new Error(`Invalid file type. Allowed types: JPG, PNG, WebP`), false);
    }

    // Check extension
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

    if (!allowedExts.includes(ext)) {
        logSecurityEvent('INVALID_EXTENSION', {
            userId: req.user?._id,
            filename: file.originalname,
            extension: ext,
            ip: req.ip
        });

        return cb(new Error(`Invalid file extension. Allowed: JPG, PNG, WebP`), false);
    }

    cb(null, true);
};

/**
 * Multer upload configuration
 */
export const upload = multer({
    storage: tempStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 5 // Maximum 5 files per request
    }
});

/**
 * Middleware: Validate and move uploaded file to secure storage
 */
export const validateAndStoreFile = async (req, res, next) => {
    if (!req.file && !req.files) {
        return next();
    }

    try {
        const files = req.files || [req.file];
        const validatedFiles = [];

        for (const file of files) {
            if (!file) continue;

            // Validate file
            const validation = await validateUploadedFile(file, req.user._id);

            if (!validation.isValid) {
                // Delete temp file
                await fs.unlink(file.path).catch(() => { });

                logSecurityEvent('FILE_VALIDATION_FAILED', {
                    userId: req.user._id,
                    filename: file.originalname,
                    errors: validation.errors,
                    ip: req.ip
                });

                return res.status(400).json({
                    success: false,
                    message: 'File validation failed',
                    errors: validation.errors
                });
            }

            // Determine target directory based on upload type
            const targetDir = req.uploadType === 'profile' ? PROFILE_UPLOAD_DIR : PRODUCT_UPLOAD_DIR;

            // Move file to secure storage with secure filename
            const securePath = getSafeStoragePath(validation.secureFilename, targetDir);
            await fs.rename(file.path, securePath);

            // Update file object with secure information
            validatedFiles.push({
                originalName: file.originalname,
                filename: validation.secureFilename,
                path: securePath,
                mimetype: file.mimetype,
                size: file.size,
                uploadedAt: new Date()
            });

            logSecurityEvent('FILE_UPLOAD_SUCCESS', {
                userId: req.user._id,
                filename: validation.secureFilename,
                originalName: file.originalname,
                size: file.size,
                ip: req.ip
            });
        }

        // Attach validated files to request
        req.validatedFiles = validatedFiles;
        req.validatedFile = validatedFiles[0]; // For single file uploads

        next();

    } catch (error) {
        // Clean up temp files
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => { });
        }
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => { });
            }
        }

        logSecurityEvent('FILE_UPLOAD_ERROR', {
            userId: req.user?._id,
            error: error.message,
            ip: req.ip
        });

        res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
};

/**
 * Middleware: Rate limit file uploads
 */
const uploadRateLimits = new Map();

export const rateLimitUploads = (maxUploads = 10, windowMs = 60000) => {
    return (req, res, next) => {
        const userId = req.user?._id?.toString();

        if (!userId) {
            return next();
        }

        const now = Date.now();
        const userLimits = uploadRateLimits.get(userId) || { count: 0, resetTime: now + windowMs };

        // Reset if window expired
        if (now > userLimits.resetTime) {
            userLimits.count = 0;
            userLimits.resetTime = now + windowMs;
        }

        // Check limit
        if (userLimits.count >= maxUploads) {
            logSecurityEvent('UPLOAD_RATE_LIMIT_EXCEEDED', {
                userId,
                count: userLimits.count,
                ip: req.ip
            });

            return res.status(429).json({
                success: false,
                message: 'Too many uploads. Please try again later.',
                retryAfter: Math.ceil((userLimits.resetTime - now) / 1000)
            });
        }

        // Increment count
        userLimits.count++;
        uploadRateLimits.set(userId, userLimits);

        next();
    };
};

/**
 * Middleware: Set upload type
 */
export const setUploadType = (type) => {
    return (req, res, next) => {
        req.uploadType = type;
        next();
    };
};

/**
 * Delete file securely
 */
export const deleteFile = async (filename, directory = PRODUCT_UPLOAD_DIR) => {
    try {
        const filePath = getSafeStoragePath(filename, directory);
        await fs.unlink(filePath);

        logSecurityEvent('FILE_DELETED', {
            filename,
            directory
        });

        return true;
    } catch (error) {
        console.error('[FILE-DELETE-ERROR]', error);
        return false;
    }
};

/**
 * Clean up old temporary files (run periodically)
 */
export const cleanupTempFiles = async (maxAgeMs = 3600000) => {
    try {
        const files = await fs.readdir(TEMP_UPLOAD_DIR);
        const now = Date.now();
        let deletedCount = 0;

        for (const file of files) {
            const filePath = path.join(TEMP_UPLOAD_DIR, file);
            const stats = await fs.stat(filePath);
            const age = now - stats.mtimeMs;

            if (age > maxAgeMs) {
                await fs.unlink(filePath);
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            console.log(`[FILE-CLEANUP] Deleted ${deletedCount} old temporary files`);
        }

    } catch (error) {
        console.error('[FILE-CLEANUP-ERROR]', error);
    }
};

// Schedule cleanup every hour
setInterval(cleanupTempFiles, 3600000);

/**
 * Get file URL for serving
 */
export const getFileUrl = (filename, directory = PRODUCT_UPLOAD_DIR) => {
    // In production, this would return a CDN URL or signed URL
    // For now, return a backend-served URL
    const type = directory.includes('profile') ? 'profile' : 'product';
    return `/api/files/${type}/${filename}`;
};

/**
 * Middleware: Serve file securely
 */
export const serveFile = async (req, res) => {
    try {
        const { type, filename } = req.params;

        // Determine directory
        const directory = type === 'profile' ? PROFILE_UPLOAD_DIR : PRODUCT_UPLOAD_DIR;

        // Get safe file path
        const filePath = getSafeStoragePath(filename, directory);

        // Check if file exists
        await fs.access(filePath);

        // Set security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'none'");
        res.setHeader('X-Frame-Options', 'DENY');

        // Serve file
        res.sendFile(path.resolve(filePath));

    } catch (error) {
        logSecurityEvent('FILE_ACCESS_FAILED', {
            filename: req.params.filename,
            type: req.params.type,
            error: error.message,
            ip: req.ip
        });

        res.status(404).json({
            success: false,
            message: 'File not found'
        });
    }
};

export default {
    upload,
    validateAndStoreFile,
    rateLimitUploads,
    setUploadType,
    deleteFile,
    cleanupTempFiles,
    getFileUrl,
    serveFile
};
