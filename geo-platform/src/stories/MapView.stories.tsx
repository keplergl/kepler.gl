import type { Meta, StoryObj } from '@storybook/react';
import { MapView } from '../components/MapView';
import { useState } from 'react';

const meta: Meta<typeof MapView> = {
    title: 'Map/MapView',
    component: MapView,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<typeof MapView>;

const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 13,
    pitch: 0,
    bearing: 0
};

const mockPoints = [
    { id: 1, lat: 37.7853, lon: -122.41669, category: 'Food', name: 'Burger Joint' },
    { id: 2, lat: 37.7863, lon: -122.41769, category: 'Health', name: 'Pharmacy' },
    { id: 3, lat: 37.7843, lon: -122.41569, category: 'Transport', name: 'Bus Stop' },
];

export const Default: Story = {
    render: () => {
        const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
        return (
            <div style={{ height: '100vh', width: '100vw' }}>
                <MapView
                    viewState={viewState}
                    onViewStateChange={setViewState}
                    points={mockPoints}
                    showTiles={false}
                />
            </div>
        );
    },
};
