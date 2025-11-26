import type { Meta, StoryObj } from '@storybook/react';
import { SidePanel } from '../components/SidePanel';
import { StatsCard } from '../components/StatsCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { Input } from '../components/Input';
import { useState } from 'react';

const meta: Meta<typeof SidePanel> = {
    title: 'Dashboard/SidePanel',
    component: SidePanel,
    parameters: {
        layout: 'fullscreen',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0F172A' }],
        },
    },
};

export default meta;
type Story = StoryObj<typeof SidePanel>;

const mockCategories = [
    { name: 'Food', count: 45230 },
    { name: 'Health', count: 12450 },
    { name: 'Transport', count: 89100 },
    { name: 'Education', count: 23400 },
];

export const Default: Story = {
    args: {
        children: (
            <div>
                <h2 style={{ margin: 0, marginBottom: '24px', color: '#F1F5F9' }}>
                    Geo Platform
                </h2>
                <p style={{ color: '#94A3B8', marginBottom: '32px' }}>
                    Explore 2.3M points of interest across North America
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <StatsCard label="Total POIs" value={2327771} icon="📍" />
                    <StatsCard label="Loaded" value={10000} icon="🗺️" />
                </div>
            </div>
        ),
    },
};

export const WithFilters: Story = {
    render: () => {
        const [selected, setSelected] = useState<string[]>(['Food', 'Health']);
        return (
            <SidePanel>
                <h2 style={{ margin: 0, marginBottom: '24px', color: '#F1F5F9' }}>
                    Dashboard
                </h2>
                <div style={{ marginBottom: '24px' }}>
                    <Input placeholder="🔍 Search POIs..." />
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <StatsCard label="Total POIs" value={2327771} icon="📍" />
                </div>
                <CategoryFilter
                    categories={mockCategories}
                    selected={selected}
                    onChange={setSelected}
                />
            </SidePanel>
        );
    },
};

export const RightSide: Story = {
    args: {
        position: 'right',
        children: (
            <div>
                <h2 style={{ margin: 0, marginBottom: '24px', color: '#F1F5F9' }}>
                    Layers
                </h2>
                <p style={{ color: '#94A3B8' }}>
                    Layer controls would go here
                </p>
            </div>
        ),
    },
};
