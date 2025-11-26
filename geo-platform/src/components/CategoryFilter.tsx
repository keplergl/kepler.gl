import React from 'react';
import { colors, spacing, getCategoryColor } from '../theme/tokens';

interface Category {
    name: string;
    count: number;
    color?: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selected: string[];
    onChange: (selected: string[]) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selected,
    onChange,
}) => {
    const handleToggle = (categoryName: string) => {
        if (selected.includes(categoryName)) {
            onChange(selected.filter(c => c !== categoryName));
        } else {
            onChange([...selected, categoryName]);
        }
    };

    const handleSelectAll = () => {
        onChange(categories.map(c => c.name));
    };

    const handleSelectNone = () => {
        onChange([]);
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing[4],
            }}>
                <h3 style={{ margin: 0, color: colors.text, fontSize: '16px', fontWeight: 600 }}>
                    Categories
                </h3>
                <div style={{ display: 'flex', gap: spacing[2] }}>
                    <button
                        onClick={handleSelectAll}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: colors.primary,
                            fontSize: '14px',
                            cursor: 'pointer',
                            padding: 0,
                        }}
                    >
                        All
                    </button>
                    <span style={{ color: colors.border }}>|</span>
                    <button
                        onClick={handleSelectNone}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: colors.primary,
                            fontSize: '14px',
                            cursor: 'pointer',
                            padding: 0,
                        }}
                    >
                        None
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                {categories.map((category) => {
                    const isSelected = selected.includes(category.name);
                    const categoryColor = category.color || getCategoryColor(category.name);

                    return (
                        <label
                            key={category.name}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: spacing[3],
                                padding: spacing[2],
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                transition: 'background-color 150ms',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggle(category.name)}
                                style={{ cursor: 'pointer' }}
                            />
                            <div
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '4px',
                                    backgroundColor: categoryColor,
                                }}
                            />
                            <span style={{
                                flex: 1,
                                color: colors.text,
                                fontSize: '14px',
                                fontWeight: isSelected ? 500 : 400,
                            }}>
                                {category.name}
                            </span>
                            <span style={{
                                fontSize: '12px',
                                color: colors.textMuted,
                                backgroundColor: colors.surface,
                                padding: `${spacing[1]} ${spacing[2]}`,
                                borderRadius: '12px',
                            }}>
                                {category.count.toLocaleString()}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};
