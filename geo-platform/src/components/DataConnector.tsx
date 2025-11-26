import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { colors, spacing } from '../theme/tokens';

interface DataConnectorProps {
    onConnect: (type: 'url' | 'file' | 'sample', value?: string | File) => void;
    isLoading?: boolean;
    error?: string;
}

export const DataConnector: React.FC<DataConnectorProps> = ({
    onConnect,
    isLoading = false,
    error,
}) => {
    const [url, setUrl] = useState('');
    const [activeTab, setActiveTab] = useState<'sample' | 'url' | 'file'>('sample');

    const tabs = [
        { id: 'sample', label: 'Sample Data' },
        { id: 'url', label: 'URL' },
        { id: 'file', label: 'Local File' },
    ] as const;

    return (
        <Card padding="6">
            <h3 style={{ margin: '0 0 16px 0', color: colors.text }}>Connect Data</h3>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: `1px solid ${colors.border}` }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? `2px solid ${colors.primary}` : '2px solid transparent',
                            color: activeTab === tab.id ? colors.primary : colors.textMuted,
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            transition: 'all 0.2s',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ minHeight: '120px' }}>
                {activeTab === 'sample' && (
                    <div>
                        <p style={{ color: colors.textMuted, marginBottom: '16px', fontSize: '14px' }}>
                            Load the North America POI dataset (GeoParquet) for high-performance local analysis.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '8px',
                                backgroundColor: 'rgba(255, 215, 0, 0.1)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                            }}>
                                🦆
                            </div>
                            <div>
                                <div style={{ color: colors.text, fontWeight: 500 }}>DuckDB + GeoParquet</div>
                                <div style={{ color: colors.textMuted, fontSize: '12px' }}>~2.3M rows • Compressed</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <Button
                                variant="primary"
                                onClick={() => onConnect('sample')}
                                disabled={isLoading}
                                style={{ width: '100%' }}
                            >
                                {isLoading ? 'Loading DuckDB...' : 'Load Sample Data'}
                            </Button>
                        </div>
                    </div>
                )}

                {activeTab === 'url' && (
                    <div>
                        <Input
                            label="Dataset URL (Parquet/CSV/JSON)"
                            placeholder="https://example.com/data.parquet"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            style={{ marginBottom: '16px' }}
                        />
                        <Button
                            variant="primary"
                            onClick={() => onConnect('url', url)}
                            disabled={isLoading || !url}
                            style={{ width: '100%' }}
                        >
                            Connect URL
                        </Button>
                    </div>
                )}

                {activeTab === 'file' && (
                    <div style={{
                        border: `2px dashed ${colors.border}`,
                        borderRadius: '8px',
                        padding: '32px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📂</div>
                        <div style={{ color: colors.text, fontWeight: 500 }}>Click to upload</div>
                        <div style={{ color: colors.textMuted, fontSize: '12px' }}>Parquet, CSV, Arrow, JSON</div>
                    </div>
                )}
            </div>

            {error && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${colors.error}`,
                    borderRadius: '6px',
                    color: colors.error,
                    fontSize: '14px'
                }}>
                    {error}
                </div>
            )}
        </Card>
    );
};
