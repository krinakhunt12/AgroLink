import crypto from 'crypto';

/**
 * DATA PRIVACY & COMPLIANCE - ENCRYPTION UTILITIES
 * 
 * Implements strong encryption for sensitive user data (PII - Personally Identifiable Information)
 * following GDPR-like principles and industry best practices.
 * 
 * Encryption Standards:
 * - Algorithm: AES-256-GCM (Authenticated Encryption)
 * - Key Derivation: PBKDF2 with SHA-256
 * - IV: Random 16 bytes per encryption
 * - Auth Tag: 16 bytes for integrity verification
 * 
 * Sensitive Fields Protected:
 * - Phone numbers
 * - Email addresses
 * - Payment details
 * - Bank account information
 * - Personal addresses
 * - Government IDs (Aadhaar, PAN)
 */

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

// Get encryption key from environment (must be 32 bytes)
const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('ENCRYPTION_KEY environment variable not set');
    }

    // Derive a proper 32-byte key from the environment variable
    return crypto.pbkdf2Sync(key, 'agrolink-salt', 100000, KEY_LENGTH, 'sha256');
};

/**
 * Encrypt sensitive data
 * @param {string} plaintext - Data to encrypt
 * @returns {string} - Encrypted data in format: iv:authTag:ciphertext (hex encoded)
 */
export const encrypt = (plaintext) => {
    if (!plaintext) return null;

    try {
        const key = getEncryptionKey();
        const iv = crypto.randomBytes(IV_LENGTH);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
        ciphertext += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        // Format: iv:authTag:ciphertext (all hex encoded)
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${ciphertext}`;
    } catch (error) {
        console.error('[ENCRYPTION-ERROR] Failed to encrypt data:', error.message);
        throw new Error('Data encryption failed');
    }
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedData - Encrypted data in format: iv:authTag:ciphertext
 * @returns {string} - Decrypted plaintext
 */
export const decrypt = (encryptedData) => {
    if (!encryptedData) return null;

    try {
        const key = getEncryptionKey();
        const parts = encryptedData.split(':');

        if (parts.length !== 3) {
            throw new Error('Invalid encrypted data format');
        }

        const iv = Buffer.from(parts[0], 'hex');
        const authTag = Buffer.from(parts[1], 'hex');
        const ciphertext = parts[2];

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
        plaintext += decipher.final('utf8');

        return plaintext;
    } catch (error) {
        console.error('[DECRYPTION-ERROR] Failed to decrypt data:', error.message);
        throw new Error('Data decryption failed');
    }
};

/**
 * Hash sensitive data (one-way, for comparison purposes)
 * Used for: Password hashing, data integrity checks
 * @param {string} data - Data to hash
 * @returns {string} - SHA-256 hash (hex encoded)
 */
export const hash = (data) => {
    if (!data) return null;
    return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Mask sensitive data for display/logging
 * @param {string} data - Data to mask
 * @param {string} type - Type of data (phone, email, card, etc.)
 * @returns {string} - Masked data
 */
export const mask = (data, type = 'default') => {
    if (!data) return null;

    switch (type) {
        case 'phone':
            // +91-XXXX-XX-1234
            if (data.length >= 10) {
                return `+91-XXXX-XX-${data.slice(-4)}`;
            }
            return 'XXXX-XXXX';

        case 'email':
            // u***@example.com
            const [local, domain] = data.split('@');
            if (local && domain) {
                return `${local[0]}***@${domain}`;
            }
            return 'u***@example.com';

        case 'card':
            // XXXX-XXXX-XXXX-1234
            if (data.length >= 4) {
                return `XXXX-XXXX-XXXX-${data.slice(-4)}`;
            }
            return 'XXXX-XXXX-XXXX-XXXX';

        case 'account':
            // Bank account: XXXXXXXX1234
            if (data.length >= 4) {
                return `${'X'.repeat(data.length - 4)}${data.slice(-4)}`;
            }
            return 'XXXXXXXXXXXX';

        case 'aadhaar':
            // XXXX-XXXX-1234
            if (data.length >= 4) {
                return `XXXX-XXXX-${data.slice(-4)}`;
            }
            return 'XXXX-XXXX-XXXX';

        case 'price':
            // For sensitive pricing: ₹XX,XXX
            return '₹XX,XXX';

        default:
            // Generic masking: show first and last char
            if (data.length > 2) {
                return `${data[0]}${'*'.repeat(data.length - 2)}${data[data.length - 1]}`;
            }
            return '***';
    }
};

/**
 * Anonymize user data for analytics/ML
 * Replaces PII with anonymous identifiers
 * @param {Object} userData - User data object
 * @returns {Object} - Anonymized data
 */
export const anonymize = (userData) => {
    if (!userData) return null;

    const anonymized = { ...userData };

    // Replace PII with hashed/anonymous versions
    if (anonymized.phone) {
        anonymized.phone = hash(anonymized.phone).substring(0, 16); // Anonymous ID
    }

    if (anonymized.email) {
        anonymized.email = hash(anonymized.email).substring(0, 16);
    }

    if (anonymized.name) {
        anonymized.name = 'User_' + hash(anonymized.name).substring(0, 8);
    }

    // Remove highly sensitive fields
    delete anonymized.password;
    delete anonymized.bankAccount;
    delete anonymized.upiId;
    delete anonymized.aadhaar;
    delete anonymized.pan;

    // Keep only necessary fields for analytics
    return {
        userId: anonymized._id || anonymized.userId,
        userType: anonymized.userType,
        location: anonymized.location,
        createdAt: anonymized.createdAt,
        // Add anonymized identifiers
        anonymousPhone: anonymized.phone,
        anonymousEmail: anonymized.email,
        anonymousName: anonymized.name
    };
};

/**
 * Pseudonymize data (reversible anonymization for internal use)
 * @param {string} data - Data to pseudonymize
 * @param {string} salt - Salt for pseudonymization
 * @returns {string} - Pseudonymized data
 */
export const pseudonymize = (data, salt = 'agrolink-pseudo') => {
    if (!data) return null;
    return crypto.createHmac('sha256', salt).update(data).digest('hex').substring(0, 16);
};

/**
 * Generate secure random token (for consent tokens, deletion tokens, etc.)
 * @param {number} length - Token length in bytes (default 32)
 * @returns {string} - Random token (hex encoded)
 */
export const generateSecureToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Validate encryption key strength
 * @returns {boolean} - True if encryption key is strong enough
 */
export const validateEncryptionKey = () => {
    try {
        const key = process.env.ENCRYPTION_KEY;
        if (!key) return false;
        if (key.length < 32) {
            console.warn('[ENCRYPTION-WARNING] Encryption key should be at least 32 characters');
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Encrypt object fields selectively
 * @param {Object} obj - Object with fields to encrypt
 * @param {Array} fieldsToEncrypt - Array of field names to encrypt
 * @returns {Object} - Object with encrypted fields
 */
export const encryptFields = (obj, fieldsToEncrypt = []) => {
    if (!obj) return null;

    const encrypted = { ...obj };

    for (const field of fieldsToEncrypt) {
        if (encrypted[field]) {
            encrypted[field] = encrypt(encrypted[field]);
        }
    }

    return encrypted;
};

/**
 * Decrypt object fields selectively
 * @param {Object} obj - Object with encrypted fields
 * @param {Array} fieldsToDecrypt - Array of field names to decrypt
 * @returns {Object} - Object with decrypted fields
 */
export const decryptFields = (obj, fieldsToDecrypt = []) => {
    if (!obj) return null;

    const decrypted = { ...obj };

    for (const field of fieldsToDecrypt) {
        if (decrypted[field]) {
            try {
                decrypted[field] = decrypt(decrypted[field]);
            } catch (error) {
                console.error(`[DECRYPTION-ERROR] Failed to decrypt field: ${field}`);
                decrypted[field] = null;
            }
        }
    }

    return decrypted;
};

/**
 * Sanitize data for logging (remove sensitive fields)
 * @param {Object} data - Data to sanitize
 * @returns {Object} - Sanitized data safe for logging
 */
export const sanitizeForLogging = (data) => {
    if (!data) return null;

    const sanitized = { ...data };

    // Remove sensitive fields
    const sensitiveFields = [
        'password',
        'phone',
        'email',
        'bankAccount',
        'upiId',
        'aadhaar',
        'pan',
        'cardNumber',
        'cvv',
        'pin',
        'otp'
    ];

    for (const field of sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    }

    return sanitized;
};

export default {
    encrypt,
    decrypt,
    hash,
    mask,
    anonymize,
    pseudonymize,
    generateSecureToken,
    validateEncryptionKey,
    encryptFields,
    decryptFields,
    sanitizeForLogging
};
