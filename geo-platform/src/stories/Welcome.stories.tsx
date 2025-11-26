import type { Meta, StoryObj } from '@storybook/react';

// Welcome story
const Welcome = () => {
    return (
        <div style={{
            padding: '40px',
            fontFamily: 'Inter, sans-serif',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
                🗺️ Geo Platform Design System
            </h1>
            <p style={{ fontSize: '18px', color: '#64748B', marginBottom: '32px' }}>
                Component library for geospatial data visualization
            </p>

            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Getting Started</h2>
            <p style={{ marginBottom: '16px' }}>
                This Storybook contains all the UI components for the Geo Platform project.
                Browse the components in the sidebar to see examples and documentation.
            </p>

            <h3 style={{ fontSize: '20px', marginBottom: '12px', marginTop: '32px' }}>
                Component Categories
            </h3>
            <ul style={{ lineHeight: '1.8' }}>
                <li><strong>Map Components</strong> - MapView, POILayer, MapControls</li>
                <li><strong>Dashboard</strong> - SidePanel, CategoryFilter, StatsCard</li>
                <li><strong>Data</strong> - POITable, LoadingState, ErrorBoundary</li>
            </ul>
        </div>
    );
};

const meta: Meta<typeof Welcome> = {
    title: 'Introduction/Welcome',
    component: Welcome,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof Welcome>;

export const Default: Story = {};
