import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from '../components/SearchBar';

const meta: Meta<typeof SearchBar> = {
    title: 'Components/SearchBar',
    component: SearchBar,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0F172A' }],
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: '400px', height: '300px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

const mockResults = [
    { id: 1, name: 'San Francisco', category: 'City', lat: 37.77, lon: -122.41 },
    { id: 2, name: 'San Jose', category: 'City', lat: 37.33, lon: -121.88 },
    { id: 3, name: 'Santa Monica', category: 'City', lat: 34.01, lon: -118.49 },
    { id: 4, name: 'San Diego', category: 'City', lat: 32.71, lon: -117.16 },
];

export const Default: Story = {
    args: {
        onSearch: async (query) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockResults.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
        },
        onSelect: (result) => console.log('Selected:', result),
    },
};
