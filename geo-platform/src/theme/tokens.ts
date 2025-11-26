// Design Tokens for Geo Platform
// Inspired by Kepler.gl, Mapbox Studio, and modern data visualization tools

export const colors = {
    // Premium Dark Theme Palette
    background: '#0B0F19', // Deep blue-black
    backgroundDark: '#050911', // Darker depth
    surface: 'rgba(30, 41, 59, 0.7)', // Glassmorphism base
    surfaceHighlight: 'rgba(51, 65, 85, 0.8)',

    // Vibrant Accents
    primary: '#3B82F6', // Electric Blue
    primaryHover: '#2563EB',
    secondary: '#10B981', // Emerald Green
    accent: '#8B5CF6', // Violet

    // Text
    text: '#F8FAFC', // Slate 50
    textMuted: '#94A3B8', // Slate 400
    textInverted: '#0F172A',

    // Functional
    border: 'rgba(148, 163, 184, 0.15)',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',

    // POI Categories (kept for compatibility)
    categories: {
        food: '#F472B6',
        health: '#EF4444',
        transport: '#3B82F6',
        education: '#8B5CF6',
        entertainment: '#F59E0B',
        shopping: '#10B981',
        tourism: '#06B6D4',
        other: '#94A3B8',
    },
};

export const spacing = {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '24px',
    6: '32px',
    8: '48px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
};

export const typography = {
    fontFamily: '"Inter", "Outfit", system-ui, -apple-system, sans-serif',
    h1: { fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '24px', fontWeight: 600, letterSpacing: '-0.01em' },
    h3: { fontSize: '18px', fontWeight: 600 },
    body: { fontSize: '14px', lineHeight: 1.6 },
    caption: { fontSize: '12px', color: colors.textMuted },
    // Kept for compatibility if needed, but the above are the main ones
    fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
};

export const borderRadius = {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
};

export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)', // Neon glow
};

export const glass = {
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(16px)',
    border: `1px solid ${colors.border}`,
};

export const transitions = {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const zIndex = {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1200,
    modal: 1300,
    popover: 1400,
    tooltip: 1500,
};

export const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
        Food: '#F472B6', // Pink
        Health: '#EF4444', // Red
        Transport: '#3B82F6', // Blue
        Education: '#8B5CF6', // Purple
        Entertainment: '#F59E0B', // Amber
        Shopping: '#10B981', // Emerald
        Tourism: '#06B6D4', // Cyan
        Other: '#94A3B8', // Slate
    };
    return map[category] || map.Other;
};

// Export theme object
export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    glass,
    transitions,
    zIndex,
};

export type Theme = typeof theme;
