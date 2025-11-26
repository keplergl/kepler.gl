import React, { useState } from 'react';
import { colors, spacing, shadows, transitions } from '../theme/tokens';

interface SidePanelProps {
    children: React.ReactNode;
    defaultOpen?: boolean;
    width?: number;
    position?: 'left' | 'right';
}

export const SidePanel: React.FC<SidePanelProps> = ({
    children,
    defaultOpen = true,
    width = 320,
    position = 'left',
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const panelStyles: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        [position]: isOpen ? 0 : -width,
        width: `${width}px`,
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRight: position === 'left' ? `1px solid ${colors.border}` : 'none',
        borderLeft: position === 'right' ? `1px solid ${colors.border}` : 'none',
        boxShadow: shadows.xl,
        transition: transitions.normal,
        zIndex: 1000,
        overflowY: 'auto',
        padding: spacing[6],
    };

    const toggleButtonStyles: React.CSSProperties = {
        position: 'fixed',
        top: spacing[4],
        [position]: isOpen ? `${width + 16}px` : '16px',
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: `${spacing[2]} ${spacing[3]}`,
        cursor: 'pointer',
        transition: transitions.normal,
        zIndex: 1001,
        color: colors.text,
        fontSize: '20px',
        boxShadow: shadows.md,
    };

    return (
        <>
            <div style={panelStyles}>
                {children}
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={toggleButtonStyles}
                aria-label={isOpen ? 'Close panel' : 'Open panel'}
            >
                {isOpen ? (position === 'left' ? '←' : '→') : (position === 'left' ? '→' : '←')}
            </button>
        </>
    );
};
