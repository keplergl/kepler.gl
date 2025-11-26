import React, { useState, useEffect, useRef } from 'react';
import { Input } from './Input';
import { Card } from './Card';
import { colors, spacing, shadows } from '../theme/tokens';

interface SearchResult {
    id: number;
    name: string;
    category: string;
    lat: number;
    lon: number;
}

interface SearchBarProps {
    onSearch: (query: string) => Promise<SearchResult[]>;
    onSelect: (result: SearchResult) => void;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    onSelect,
    placeholder = "Search locations...",
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await onSearch(query);
                setResults(data);
                setIsOpen(true);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <Input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.length >= 2 && setIsOpen(true)}
            />

            {isOpen && (results.length > 0 || isLoading) && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    zIndex: 1000,
                }}>
                    <Card padding="2" style={{ maxHeight: '300px', overflowY: 'auto', boxShadow: shadows.xl }}>
                        {isLoading ? (
                            <div style={{ padding: spacing[3], color: colors.textMuted, textAlign: 'center' }}>
                                Searching...
                            </div>
                        ) : (
                            results.map((result) => (
                                <div
                                    key={result.id}
                                    onClick={() => {
                                        onSelect(result);
                                        setIsOpen(false);
                                        setQuery(result.name);
                                    }}
                                    style={{
                                        padding: `${spacing[2]} ${spacing[3]}`,
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        transition: 'background-color 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: spacing[3],
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{ fontSize: '16px' }}>📍</div>
                                    <div>
                                        <div style={{ color: colors.text, fontWeight: 500 }}>{result.name}</div>
                                        <div style={{ color: colors.textMuted, fontSize: '12px' }}>{result.category}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};
