import React from 'react';
import { colors, spacing, borderRadius, shadows, transitions } from '../theme/tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    style,
    ...props
}) => {
    const baseStyles: React.CSSProperties = {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        border: 'none',
        borderRadius: borderRadius.md,
        cursor: 'pointer',
        transition: transitions.fast,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            backgroundColor: colors.primary,
            color: colors.text,
            boxShadow: shadows.sm,
        },
        secondary: {
            backgroundColor: colors.surface,
            color: colors.text,
            border: `1px solid ${colors.border}`,
        },
        ghost: {
            backgroundColor: 'transparent',
            color: colors.textMuted,
        },
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
        sm: {
            padding: `${spacing[2]} ${spacing[3]}`,
            fontSize: '14px',
        },
        md: {
            padding: `${spacing[3]} ${spacing[4]}`,
            fontSize: '16px',
        },
        lg: {
            padding: `${spacing[4]} ${spacing[6]}`,
            fontSize: '18px',
        },
    };

    return (
        <button
            style={{
                ...baseStyles,
                ...variantStyles[variant],
                ...sizeStyles[size],
                ...style,
            }}
            {...props}
        >
            {children}
        </button>
    );
};
