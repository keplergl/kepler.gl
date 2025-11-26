import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { colors, spacing, getCategoryColor } from '../theme/tokens';

interface POI {
    id: number;
    name: string;
    category: string;
    subcategory: string;
    lat: number;
    lon: number;
    tags?: Record<string, string>;
}

interface POIDetailsProps {
    poi: POI | null;
    onClose: () => void;
}

export const POIDetails: React.FC<POIDetailsProps> = ({ poi, onClose }) => {
    if (!poi) return null;

    const categoryColor = getCategoryColor(poi.category);

    return (
        <Card padding="0" style={{ overflow: 'hidden' }}>
            {/* Header with Category Color */}
            <div style={{
                height: '8px',
                backgroundColor: categoryColor,
                width: '100%'
            }} />

            <div style={{ padding: spacing[5] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[4] }}>
                    <div>
                        <div style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: categoryColor,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: spacing[1]
                        }}>
                            {poi.category} • {poi.subcategory}
                        </div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '20px',
                            color: colors.text,
                            lineHeight: 1.3
                        }}>
                            {poi.name || 'Unnamed Location'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: colors.textMuted,
                            cursor: 'pointer',
                            fontSize: '20px',
                            padding: '4px',
                            lineHeight: 1
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Coordinates */}
                <div style={{
                    display: 'flex',
                    gap: spacing[4],
                    marginBottom: spacing[4],
                    fontSize: '13px',
                    color: colors.textMuted,
                    fontFamily: 'monospace'
                }}>
                    <div>Lat: {poi.lat.toFixed(5)}</div>
                    <div>Lon: {poi.lon.toFixed(5)}</div>
                </div>

                {/* Tags / Metadata */}
                {poi.tags && Object.keys(poi.tags).length > 0 && (
                    <div style={{ marginBottom: spacing[5] }}>
                        <h4 style={{
                            margin: '0 0 8px 0',
                            fontSize: '12px',
                            color: colors.textMuted,
                            textTransform: 'uppercase'
                        }}>
                            Details
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', fontSize: '14px' }}>
                            {Object.entries(poi.tags).slice(0, 5).map(([key, value]) => (
                                <React.Fragment key={key}>
                                    <div style={{ color: colors.textMuted }}>{key}:</div>
                                    <div style={{ color: colors.text }}>{value}</div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: spacing[2] }}>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(`https://www.openstreetmap.org/node/${poi.id}`, '_blank')}
                        style={{ flex: 1 }}
                    >
                        View on OSM ↗
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${poi.lat},${poi.lon}`, '_blank')}
                        style={{ flex: 1 }}
                    >
                        Google Maps ↗
                    </Button>
                </div>
            </div>
        </Card>
    );
};
