import React from 'react';
import { useTranslation } from 'react-i18next';
import { checkPasswordStrength, type PasswordStrength } from '../../utils/passwordStrength';

interface PasswordStrengthMeterProps {
    password: string;
    showFeedback?: boolean;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
    password,
    showFeedback = true
}) => {
    const { t } = useTranslation();

    if (!password) return null;

    const strength: PasswordStrength = checkPasswordStrength(password);

    const getStrengthLabel = () => {
        switch (strength.label) {
            case 'weak':
                return t('auth.passwordStrength.weak', 'Weak');
            case 'fair':
                return t('auth.passwordStrength.fair', 'Fair');
            case 'good':
                return t('auth.passwordStrength.good', 'Good');
            case 'strong':
                return t('auth.passwordStrength.strong', 'Strong');
            case 'very-strong':
                return t('auth.passwordStrength.veryStrong', 'Very Strong');
            default:
                return '';
        }
    };

    return (
        <div className="mt-2 space-y-2">
            {/* Strength Bar */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full transition-all duration-300 ease-out rounded-full"
                        style={{
                            width: `${strength.percentage}%`,
                            backgroundColor: strength.color
                        }}
                    />
                </div>
                <span
                    className="text-xs font-bold uppercase tracking-wider min-w-[80px] text-right"
                    style={{ color: strength.color }}
                >
                    {getStrengthLabel()}
                </span>
            </div>

            {/* Feedback */}
            {showFeedback && strength.feedback.length > 0 && (
                <ul className="space-y-1">
                    {strength.feedback.map((item, index) => (
                        <li
                            key={index}
                            className="text-xs text-gray-600 flex items-center gap-2"
                        >
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
