import React from 'react';
import { colors, spacing, borderRadius, transitions } from '../theme/tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    style,
    ...props
}) => {
    const inputStyles: React.CSSProperties = {
        width: '100%',
        padding: `${spacing[3]} ${spacing[4]}`,
        backgroundColor: colors.surface,
        border: `1px solid ${error ? colors.error : colors.border}`,
        borderRadius: borderRadius.md,
        color: colors.text,
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
        transition: transitions.fast,
        outline: 'none',
    };

    return (
        <div style={{ width: '100%' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: spacing[2],
                    fontSize: '14px',
                    fontWeight: 500,
                    color: colors.text,
                }}>
                    {label}
                </label>
            )}
            <input style={{ ...inputStyles, ...style }} {...props} />
            {error && (
                <div style={{
                    marginTop: spacing[2],
                    fontSize: '14px',
                    color: colors.error,
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};
