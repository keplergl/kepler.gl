import type { Meta, StoryObj } from '@storybook/react';
import { DataConnector } from '../components/DataConnector';

const meta: Meta<typeof DataConnector> = {
    title: 'Dashboard/DataConnector',
    component: DataConnector,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0F172A' }],
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: '400px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof DataConnector>;

export const Default: Story = {
    args: {},
};

export const Loading: Story = {
    args: {
        isLoading: true,
    },
};

export const WithError: Story = {
    args: {
        error: 'Failed to initialize DuckDB-WASM. Please check your connection.',
    },
};
