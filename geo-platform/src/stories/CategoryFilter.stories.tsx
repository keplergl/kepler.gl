import type { Meta, StoryObj } from '@storybook/react';
import { CategoryFilter } from '../components/CategoryFilter';
import { useState } from 'react';

const meta: Meta<typeof CategoryFilter> = {
    title: 'Dashboard/CategoryFilter',
    component: CategoryFilter,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0F172A' }],
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: '300px', padding: '20px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof CategoryFilter>;

const mockCategories = [
    { name: 'Food', count: 45230 },
    { name: 'Health', count: 12450 },
    { name: 'Transport', count: 89100 },
    { name: 'Education', count: 23400 },
    { name: 'Entertainment', count: 15600 },
    { name: 'Shopping', count: 34200 },
    { name: 'Tourism', count: 18900 },
    { name: 'Other', count: 88891 },
];

export const Default: Story = {
    render: () => {
        const [selected, setSelected] = useState<string[]>(['Food', 'Health', 'Transport']);
        return (
            <CategoryFilter
                categories={mockCategories}
                selected={selected}
                onChange={setSelected}
            />
        );
    },
};

export const AllSelected: Story = {
    render: () => {
        const [selected, setSelected] = useState<string[]>(mockCategories.map(c => c.name));
        return (
            <CategoryFilter
                categories={mockCategories}
                selected={selected}
                onChange={setSelected}
            />
        );
    },
};

export const NoneSelected: Story = {
    render: () => {
        const [selected, setSelected] = useState<string[]>([]);
        return (
            <CategoryFilter
                categories={mockCategories}
                selected={selected}
                onChange={setSelected}
            />
        );
    },
};
