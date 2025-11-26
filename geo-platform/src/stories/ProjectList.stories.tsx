import type { Meta, StoryObj } from '@storybook/react';
import { ProjectList } from '../components/ProjectList';

const meta: Meta<typeof ProjectList> = {
    title: 'Dashboard/ProjectList',
    component: ProjectList,
    parameters: {
        layout: 'fullscreen',
        backgrounds: {
            default: 'dark',
            values: [{ name: 'dark', value: '#0F172A' }],
        },
    },
};

export default meta;
type Story = StoryObj<typeof ProjectList>;

const mockProjects = [
    {
        id: '1',
        name: 'North America Retail Analysis',
        description: 'Analyzing coffee shop density and competitor locations across major US cities.',
        lastModified: '2023-11-25T10:00:00Z',
        datasetCount: 3,
    },
    {
        id: '2',
        name: 'Urban Mobility Study',
        description: 'Visualizing public transport stops and accessibility zones in San Francisco.',
        lastModified: '2023-11-24T15:30:00Z',
        datasetCount: 1,
    },
    {
        id: '3',
        name: 'Real Estate Prospecting',
        description: 'Identifying high-value zones based on proximity to schools and parks.',
        lastModified: '2023-11-20T09:15:00Z',
        datasetCount: 5,
    },
];

export const Default: Story = {
    args: {
        projects: mockProjects,
        onNewProject: () => console.log('New Project'),
        onOpenProject: (p) => console.log('Open', p),
    },
};

export const Empty: Story = {
    args: {
        projects: [],
        onNewProject: () => console.log('New Project'),
        onOpenProject: (p) => console.log('Open', p),
    },
};
