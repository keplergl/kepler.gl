import React from 'react';
import { colors, spacing, borderRadius, shadows } from '../theme/tokens';

interface CardProps {
    children: React.ReactNode;
    padding?: keyof typeof spacing;
    glass?: boolean;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
    children,
    padding = '4',
    glass = false,
    style,
}) => {
    const baseStyles: React.CSSProperties = {
        backgroundColor: glass ? 'rgba(30, 41, 59, 0.8)' : colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing[padding],
        border: `1px solid ${colors.border}`,
        boxShadow: glass ? shadows.glass : shadows.md,
        backdropFilter: glass ? 'blur(12px)' : 'none',
    };

    return <div style={{ ...baseStyles, ...style }}>{children}</div>;
};
