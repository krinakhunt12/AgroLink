import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';

/**
 * SECURE FILE UPLOAD & IMAGE VALIDATION
 * 
 * Implements multi-layer security for file uploads:
 * 1. File type validation (extension + MIME type)
 * 2. Magic number verification (file signature)
 * 3. File size limits
 * 4. Malware detection (basic signature scanning)
 * 5. Secure filename generation
 * 6. Content sanitization
 * 
 * Security Threats Prevented:
 * - Executable file uploads (.exe, .sh, .bat)
 * - Script injection (.php, .js, .py)
 * - Renamed malicious files (fake extensions)
 * - ZIP bombs / DoS attacks (file size limits)
 * - Directory traversal attacks
 * - MIME type spoofing
 */

// Allowed image formats
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
];

// File size limits (in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_FILE_SIZE = 1024; // 1KB (prevent empty files)

// Magic numbers (file signatures) for image formats
const MAGIC_NUMBERS = {
    'image/jpeg': [
        [0xFF, 0xD8, 0xFF, 0xE0], // JPEG JFIF
        [0xFF, 0xD8, 0xFF, 0xE1], // JPEG EXIF
        [0xFF, 0xD8, 0xFF, 0xE2], // JPEG
        [0xFF, 0xD8, 0xFF, 0xE3], // JPEG
        [0xFF, 0xD8, 0xFF, 0xDB]  // JPEG raw
    ],
    'image/png': [
        [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] // PNG
    ],
    'image/webp': [
        [0x52, 0x49, 0x46, 0x46] // RIFF (WebP container)
    ]
};

// Known malicious file signatures (basic malware detection)
const MALICIOUS_SIGNATURES = [
    // Executable files
    [0x4D, 0x5A], // MZ (Windows executable)
    [0x7F, 0x45, 0x4C, 0x46], // ELF (Linux executable)

    // Script files
    [0x23, 0x21], // #! (Shebang - shell script)

    // Archive bombs
    [0x50, 0x4B, 0x03, 0x04], // ZIP file (potential zip bomb)
    [0x52, 0x61, 0x72, 0x21], // RAR file
];

// Dangerous file extensions
const DANGEROUS_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js',
    '.jar', '.app', '.deb', '.rpm', '.dmg', '.pkg', '.sh', '.bash',
    '.php', '.asp', '.aspx', '.jsp', '.py', '.rb', '.pl', '.cgi',
    '.dll', '.so', '.dylib', '.sys', '.drv'
];

/**
 * Validate file extension
 */
export const validateExtension = (filename) => {
    const ext = path.extname(filename).toLowerCase();

    // Check if extension is dangerous
    if (DANGEROUS_EXTENSIONS.includes(ext)) {
        throw new Error(`Dangerous file type detected: ${ext}`);
    }

    // Check if extension is allowed
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new Error(`File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`);
    }

    return ext;
};

/**
 * Validate MIME type
 */
export const validateMimeType = (mimetype) => {
    if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
        throw new Error(`MIME type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
    }

    return mimetype;
};

/**
 * Validate file size
 */
export const validateFileSize = (size) => {
    if (size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    if (size < MIN_FILE_SIZE) {
        throw new Error(`File too small. Minimum size: ${MIN_FILE_SIZE / 1024}KB`);
    }

    return size;
};

/**
 * Read file header (first N bytes)
 */
const readFileHeader = async (filePath, bytesToRead = 16) => {
    try {
        const fileHandle = await fs.open(filePath, 'r');
        const buffer = Buffer.alloc(bytesToRead);
        await fileHandle.read(buffer, 0, bytesToRead, 0);
        await fileHandle.close();
        return buffer;
    } catch (error) {
        throw new Error('Failed to read file header');
    }
};

/**
 * Verify magic number (file signature)
 */
export const verifyMagicNumber = async (filePath, declaredMimeType) => {
    const header = await readFileHeader(filePath, 16);

    // Get expected magic numbers for declared MIME type
    const expectedSignatures = MAGIC_NUMBERS[declaredMimeType];

    if (!expectedSignatures) {
        throw new Error('Unsupported MIME type for magic number verification');
    }

    // Check if file header matches any expected signature
    const isValid = expectedSignatures.some(signature => {
        return signature.every((byte, index) => header[index] === byte);
    });

    if (!isValid) {
        throw new Error('File signature does not match declared type. Possible file type spoofing.');
    }

    return true;
};

/**
 * Scan for malicious signatures
 */
export const scanForMalware = async (filePath) => {
    const header = await readFileHeader(filePath, 16);

    // Check against known malicious signatures
    for (const signature of MALICIOUS_SIGNATURES) {
        const matches = signature.every((byte, index) => header[index] === byte);
        if (matches) {
            throw new Error('Malicious file signature detected. Upload rejected.');
        }
    }

    // Additional checks for embedded scripts
    const fileContent = await fs.readFile(filePath, 'utf-8').catch(() => null);

    if (fileContent) {
        // Check for script tags or PHP code in image files
        const dangerousPatterns = [
            /<script/i,
            /<\?php/i,
            /eval\(/i,
            /base64_decode/i,
            /system\(/i,
            /exec\(/i
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(fileContent)) {
                throw new Error('Embedded malicious code detected in file.');
            }
        }
    }

    return true;
};

/**
 * Generate secure random filename
 */
export const generateSecureFilename = (originalFilename, userId) => {
    const ext = path.extname(originalFilename).toLowerCase();
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(16).toString('hex');
    const userHash = crypto.createHash('sha256').update(userId.toString()).digest('hex').substring(0, 8);

    // Format: {timestamp}_{userHash}_{random}.{ext}
    return `${timestamp}_${userHash}_${randomString}${ext}`;
};

/**
 * Sanitize filename (remove dangerous characters)
 */
export const sanitizeFilename = (filename) => {
    // Remove path traversal attempts
    let sanitized = filename.replace(/\.\./g, '');

    // Remove special characters except dots, dashes, underscores
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Prevent multiple dots (potential extension spoofing)
    sanitized = sanitized.replace(/\.{2,}/g, '.');

    // Limit filename length
    const ext = path.extname(sanitized);
    const name = path.basename(sanitized, ext);
    const maxNameLength = 100;

    if (name.length > maxNameLength) {
        sanitized = name.substring(0, maxNameLength) + ext;
    }

    return sanitized;
};

/**
 * Validate image dimensions (optional - requires image processing library)
 */
export const validateImageDimensions = async (filePath, maxWidth = 4096, maxHeight = 4096) => {
    // This would require sharp or jimp library
    // For now, we'll return true
    // In production, add actual dimension checking
    return true;
};

/**
 * Complete file validation pipeline
 */
export const validateUploadedFile = async (file, userId) => {
    const validationReport = {
        filename: file.originalname,
        isValid: false,
        errors: [],
        warnings: [],
        secureFilename: null
    };

    try {
        // Step 1: Validate extension
        validateExtension(file.originalname);
        validationReport.warnings.push('Extension validated');

        // Step 2: Validate MIME type
        validateMimeType(file.mimetype);
        validationReport.warnings.push('MIME type validated');

        // Step 3: Validate file size
        validateFileSize(file.size);
        validationReport.warnings.push('File size validated');

        // Step 4: Verify magic number (file signature)
        await verifyMagicNumber(file.path, file.mimetype);
        validationReport.warnings.push('File signature verified');

        // Step 5: Scan for malware
        await scanForMalware(file.path);
        validationReport.warnings.push('Malware scan passed');

        // Step 6: Generate secure filename
        validationReport.secureFilename = generateSecureFilename(file.originalname, userId);

        validationReport.isValid = true;

    } catch (error) {
        validationReport.errors.push(error.message);
        validationReport.isValid = false;
    }

    return validationReport;
};

/**
 * Check if path contains directory traversal attempt
 */
export const isPathSafe = (filePath) => {
    const normalizedPath = path.normalize(filePath);

    // Check for directory traversal
    if (normalizedPath.includes('..')) {
        return false;
    }

    // Check for absolute paths
    if (path.isAbsolute(normalizedPath)) {
        return false;
    }

    return true;
};

/**
 * Get safe file storage path
 */
export const getSafeStoragePath = (filename, uploadDir = 'uploads/products') => {
    // Ensure upload directory is safe
    if (!isPathSafe(uploadDir)) {
        throw new Error('Invalid upload directory');
    }

    // Sanitize filename
    const safeFilename = sanitizeFilename(filename);

    // Construct safe path
    const safePath = path.join(uploadDir, safeFilename);

    // Verify final path doesn't escape upload directory
    const resolvedPath = path.resolve(safePath);
    const resolvedUploadDir = path.resolve(uploadDir);

    if (!resolvedPath.startsWith(resolvedUploadDir)) {
        throw new Error('Path traversal attempt detected');
    }

    return safePath;
};

/**
 * Log security event
 */
export const logSecurityEvent = (eventType, details) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        eventType,
        details,
        severity: eventType.includes('MALICIOUS') ? 'CRITICAL' : 'WARNING'
    };

    console.log('[FILE-SECURITY]', JSON.stringify(logEntry));

    // In production, send to centralized logging service
};

export default {
    validateExtension,
    validateMimeType,
    validateFileSize,
    verifyMagicNumber,
    scanForMalware,
    generateSecureFilename,
    sanitizeFilename,
    validateUploadedFile,
    isPathSafe,
    getSafeStoragePath,
    logSecurityEvent,
    ALLOWED_EXTENSIONS,
    ALLOWED_MIME_TYPES,
    MAX_FILE_SIZE,
    MIN_FILE_SIZE
};
