import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/Input';

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0F172A' }],
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ width: '400px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Search POIs',
        placeholder: 'Type to search...',
    },
};

export const WithError: Story = {
    args: {
        label: 'Email',
        placeholder: 'you@example.com',
        error: 'Please enter a valid email address',
        value: 'invalid-email',
    },
};

export const SearchBar: Story = {
    args: {
        placeholder: '🔍 Search locations, categories...',
        style: { fontSize: '18px', padding: '16px 20px' },
    },
};
