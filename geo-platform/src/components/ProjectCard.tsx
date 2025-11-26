import React from 'react';
import { Card } from './Card';
import { colors, spacing } from '../theme/tokens';

interface Project {
    id: string;
    name: string;
    description: string;
    lastModified: string;
    thumbnailUrl?: string;
    datasetCount: number;
}

interface ProjectCardProps {
    project: Project;
    onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    return (
        <div onClick={() => onClick(project)} style={{ cursor: 'pointer' }}>
            <Card padding="0" style={{ overflow: 'hidden', height: '100%', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-4px)' } }}>
                {/* Thumbnail */}
                <div style={{
                    height: '140px',
                    backgroundColor: colors.backgroundDark,
                    backgroundImage: project.thumbnailUrl ? `url(${project.thumbnailUrl})` : 'linear-gradient(45deg, #1e293b 25%, #0f172a 25%, #0f172a 50%, #1e293b 50%, #1e293b 75%, #0f172a 75%, #0f172a 100%)',
                    backgroundSize: '20px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.textMuted
                }}>
                    {!project.thumbnailUrl && <span style={{ fontSize: '24px' }}>🗺️</span>}
                </div>

                {/* Content */}
                <div style={{ padding: spacing[4] }}>
                    <h3 style={{ margin: '0 0 8px 0', color: colors.text, fontSize: '16px' }}>{project.name}</h3>
                    <p style={{ margin: '0 0 16px 0', color: colors.textMuted, fontSize: '13px', lineHeight: 1.4 }}>
                        {project.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: colors.textMuted }}>
                        <span>{project.datasetCount} Datasets</span>
                        <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};
