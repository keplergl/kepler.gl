import React from 'react';
import { Button } from './Button';
import { ProjectCard } from './ProjectCard';
import { colors, spacing } from '../theme/tokens';

interface ProjectListProps {
    projects: Array<{
        id: string;
        name: string;
        description: string;
        lastModified: string;
        datasetCount: number;
    }>;
    onNewProject: () => void;
    onOpenProject: (project: any) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onNewProject, onOpenProject }) => {
    return (
        <div style={{ padding: spacing[6], maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[6] }}>
                <div>
                    <h1 style={{ margin: 0, color: colors.text, fontSize: '24px' }}>My Projects</h1>
                    <p style={{ margin: '8px 0 0 0', color: colors.textMuted }}>Manage your geospatial analysis projects</p>
                </div>
                <Button variant="primary" onClick={onNewProject}>+ New Project</Button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: spacing[6]
            }}>
                {projects.map(project => (
                    <ProjectCard key={project.id} project={project} onClick={onOpenProject} />
                ))}
            </div>
        </div>
    );
};
