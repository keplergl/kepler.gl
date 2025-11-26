import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../components/Card';

const meta: Meta<typeof Card> = {
    title: 'Components/Card',
    component: Card,
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0F172A' }],
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {
        children: (
            <div>
                <h3 style={{ margin: 0, marginBottom: '8px', color: '#F1F5F9' }}>Card Title</h3>
                <p style={{ margin: 0, color: '#94A3B8' }}>This is a card component with default styling.</p>
            </div>
        ),
    },
};

export const Glass: Story = {
    args: {
        glass: true,
        children: (
            <div>
                <h3 style={{ margin: 0, marginBottom: '8px', color: '#F1F5F9' }}>Glass Card</h3>
                <p style={{ margin: 0, color: '#94A3B8' }}>This card has a glassmorphism effect.</p>
            </div>
        ),
    },
};

export const StatCard: Story = {
    args: {
        children: (
            <div>
                <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '4px' }}>Total POIs</div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#F1F5F9' }}>2,327,771</div>
                <div style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>↑ 12% from last week</div>
            </div>
        ),
    },
};
