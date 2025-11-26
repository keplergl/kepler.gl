import type { Meta, StoryObj } from '@storybook/react';
import { colors, getCategoryColor } from '../theme/tokens';

const ColorPalette = () => {
    return (
        <div style={{ padding: '40px', fontFamily: 'Inter, sans-serif', backgroundColor: colors.background, color: colors.text }}>
            <h1 style={{ marginBottom: '32px' }}>Design Tokens</h1>

            <section style={{ marginBottom: '48px' }}>
                <h2 style={{ marginBottom: '24px' }}>Brand Colors</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {Object.entries({ primary: colors.primary, secondary: colors.secondary, accent: colors.accent }).map(([name, color]) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: color, borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} />
                            <div>
                                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{name}</div>
                                <div style={{ fontSize: '14px', color: colors.textMuted }}>{color}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: '48px' }}>
                <h2 style={{ marginBottom: '24px' }}>POI Categories</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {Object.entries(colors.categories).map(([name, color]) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: color, borderRadius: '8px' }} />
                            <div>
                                <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{name}</div>
                                <div style={{ fontSize: '12px', color: colors.textMuted }}>{color}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 style={{ marginBottom: '24px' }}>UI Colors</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {Object.entries({
                        background: colors.background,
                        surface: colors.surface,
                        border: colors.border,
                        text: colors.text,
                        textMuted: colors.textMuted,
                    }).map(([name, color]) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: color, borderRadius: '8px', border: `1px solid ${colors.border}` }} />
                            <div>
                                <div style={{ fontWeight: 500 }}>{name}</div>
                                <div style={{ fontSize: '12px', color: colors.textMuted }}>{color}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const meta: Meta<typeof ColorPalette> = {
    title: 'Design System/Colors',
    component: ColorPalette,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const Default: Story = {};
