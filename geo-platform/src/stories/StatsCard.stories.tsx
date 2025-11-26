import type { Meta, StoryObj } from '@storybook/react';
import { StatsCard } from '../components/StatsCard';

const meta: Meta<typeof StatsCard> = {
    title: 'Dashboard/StatsCard',
    component: StatsCard,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0F172A' }],
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: '280px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof StatsCard>;

export const TotalPOIs: Story = {
    args: {
        label: 'Total POIs',
        value: 2327771,
        icon: '📍',
        trend: {
            value: 12,
            isPositive: true,
        },
    },
};

export const ActiveFilters: Story = {
    args: {
        label: 'Active Filters',
        value: 3,
        icon: '🔍',
    },
};

export const LoadedData: Story = {
    args: {
        label: 'Loaded Points',
        value: 10000,
        icon: '🗺️',
        trend: {
            value: 5,
            isPositive: false,
        },
    },
};

export const AllStats: Story = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '600px' }}>
            <StatsCard label="Total POIs" value={2327771} icon="📍" trend={{ value: 12, isPositive: true }} />
            <StatsCard label="Categories" value={8} icon="🏷️" />
            <StatsCard label="Loaded Points" value={10000} icon="🗺️" />
            <StatsCard label="Active Filters" value={3} icon="🔍" />
        </div>
    ),
};
