import type { Meta, StoryObj } from '@storybook/react';
import { POIDetails } from '../components/POIDetails';

const meta: Meta<typeof POIDetails> = {
    title: 'Components/POIDetails',
    component: POIDetails,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0F172A' }],
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: '360px' }}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof POIDetails>;

const mockPOI = {
    id: 123456,
    name: 'Blue Bottle Coffee',
    category: 'Food',
    subcategory: 'Cafe',
    lat: 37.7853,
    lon: -122.41669,
    tags: {
        cuisine: 'coffee_shop',
        opening_hours: 'Mo-Fr 07:00-19:00',
        wifi: 'yes',
        outdoor_seating: 'yes',
        wheelchair: 'yes'
    }
};

export const Default: Story = {
    args: {
        poi: mockPOI,
        onClose: () => console.log('Close clicked'),
    },
};

export const NoTags: Story = {
    args: {
        poi: { ...mockPOI, tags: {} },
        onClose: () => console.log('Close clicked'),
    },
};

export const Transport: Story = {
    args: {
        poi: {
            ...mockPOI,
            name: 'Powell St Station',
            category: 'Transport',
            subcategory: 'Subway',
            tags: { network: 'BART', operator: 'BART' }
        },
        onClose: () => console.log('Close clicked'),
    },
};
