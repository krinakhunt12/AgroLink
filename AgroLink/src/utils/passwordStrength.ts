/**
 * Password Strength Checker
 * Validates password strength and provides feedback
 */

export interface PasswordStrength {
    score: number; // 0-4
    label: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
    color: string;
    percentage: number;
    feedback: string[];
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
        score++;
    } else {
        feedback.push('At least 8 characters required');
    }

    if (password.length >= 12) {
        score++;
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score++;
    } else {
        feedback.push('Add uppercase letters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score++;
    } else {
        feedback.push('Add lowercase letters');
    }

    // Number check
    if (/[0-9]/.test(password)) {
        score++;
    } else {
        feedback.push('Add numbers');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score++;
    } else {
        feedback.push('Add special characters');
    }

    // Determine label and color
    let label: PasswordStrength['label'];
    let color: string;

    if (score <= 2) {
        label = 'weak';
        color = '#ef4444'; // red-500
    } else if (score === 3) {
        label = 'fair';
        color = '#f59e0b'; // amber-500
    } else if (score === 4) {
        label = 'good';
        color = '#3b82f6'; // blue-500
    } else if (score === 5) {
        label = 'strong';
        color = '#10b981'; // emerald-500
    } else {
        label = 'very-strong';
        color = '#16a34a'; // green-600
    }

    const percentage = Math.min((score / 6) * 100, 100);

    return {
        score,
        label,
        color,
        percentage,
        feedback: feedback.length > 0 ? feedback : ['Password is strong!']
    };
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword && password.length > 0;
};
