import React from 'react';
import { Card } from './Card';
import { colors, spacing } from '../theme/tokens';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export const StatsCard: React.FC<StatsCardProps> = ({
    label,
    value,
    icon,
    trend,
}) => {
    return (
        <Card padding="4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: '14px',
                        color: colors.textMuted,
                        marginBottom: spacing[1],
                        fontWeight: 500,
                    }}>
                        {label}
                    </div>
                    <div style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: colors.text,
                        marginBottom: spacing[2],
                    }}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </div>
                    {trend && (
                        <div style={{
                            fontSize: '12px',
                            color: trend.isPositive ? colors.success : colors.error,
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing[1],
                        }}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}% from last week</span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div style={{
                        fontSize: '32px',
                        opacity: 0.5,
                    }}>
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
};
