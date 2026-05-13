// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC, useCallback, useRef, useState} from 'react';
import styled from 'styled-components';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

import {FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS} from './lexical-constants';
import {useLexicalTextStyle, useLexicalTextFormat, useInsertLexicalLink} from './use-lexical-toolbar';
import SingleColorPalette from '../../side-panel/layer-panel/single-color-palette';

export type LexicalToolbarProps = {
  isEditingText?: boolean;
  textVerticalAlign?: 'top' | 'bottom' | 'middle';
  onChangeTextVerticalAlign?: (value: 'top' | 'bottom' | 'middle') => void;
};

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0;
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
`;

const ToolbarDivider = styled.div`
  height: 20px;
  width: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  margin: 0 4px;
`;

const ToolbarSelect = styled.select`
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  padding: 2px 4px;
  font-size: 11px;
  cursor: pointer;
  max-width: 90px;
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const ToolbarButton = styled.button<{$active?: boolean}>`
  background: ${props => (props.$active ? 'rgba(255,255,255,0.2)' : 'transparent')};
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 3px 6px;
  font-size: 12px;
  cursor: pointer;
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  &:disabled {
    opacity: 0.4;
    cursor: default;
    &:hover {
      background: transparent;
    }
  }
`;

const ColorSwatch = styled.div<{$color: string}>`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background-color: ${props => props.$color};
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const ColorPickerPopover = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: rgba(30, 33, 40, 0.98);
  border-radius: 6px;
  padding: 8px;
  z-index: 20;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
`;

const ColorPresetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 4px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
  color: #fff;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ColorPresetSwatch = styled.div<{$color: string; $isSelected?: boolean}>`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: ${props => props.$color};
  border: 1.5px solid ${props => (props.$isSelected ? '#fff' : 'rgba(255,255,255,0.3)')};
  flex-shrink: 0;
`;

const CustomPickerWrapper = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 4px;
  margin-top: 2px;
`;

const SingleColorPaletteWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  z-index: 30;
  background: ${props => props.theme.panelBackground || 'rgba(30, 33, 40, 0.98)'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  overflow: hidden;
  width: 220px;
`;

type ColorPickerButtonProps = {
  color: string;
  presets: Array<{color: string; label: string}>;
  title: string;
  label?: string;
  renderIcon?: () => React.ReactNode;
  onSelectColor: (color: string) => void;
};

const ColorPickerWrapper = styled.div`
  position: relative;
`;

const ColorPickerButton: FC<ColorPickerButtonProps> = ({color, presets, title, label, renderIcon, onSelectColor}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
    setShowCustom(false);
  }, []);

  const handlePresetSelect = useCallback(
    (c: string) => {
      onSelectColor(c);
      setIsOpen(false);
      setShowCustom(false);
    },
    [onSelectColor]
  );

  const handleCustomSelect = useCallback(
    (color: [number, number, number] | {colors: string[]}) => {
      if (Array.isArray(color)) {
        const hex = `#${color.map(v => v.toString(16).padStart(2, '0')).join('')}`;
        onSelectColor(hex);
      }
      setIsOpen(false);
      setShowCustom(false);
    },
    [onSelectColor]
  ) as (color: any, e?: any) => void;

  return (
    <ColorPickerWrapper ref={wrapperRef}>
      <ToolbarButton onClick={handleToggle} title={title}>
        {renderIcon ? renderIcon() : <span style={{fontSize: '10px'}}>{label}</span>}
        <ColorSwatch $color={color === 'transparent' ? 'rgba(255,255,255,0.1)' : color} style={{marginLeft: 4}} />
      </ToolbarButton>
      {isOpen && !showCustom && (
        <ColorPickerPopover onMouseDown={e => e.preventDefault()}>
          {presets.map(p => (
            <ColorPresetRow key={p.color} onClick={() => handlePresetSelect(p.color)}>
              <ColorPresetSwatch
                $color={p.color === 'transparent' ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px' : p.color}
                $isSelected={color === p.color}
                style={p.color === 'transparent' ? {background: 'repeating-conic-gradient(#606060 0% 25%, #404040 0% 50%) 50% / 8px 8px'} : undefined}
              />
              {p.label}
            </ColorPresetRow>
          ))}
          <CustomPickerWrapper>
            <ColorPresetRow onClick={() => setShowCustom(true)}>
              <ColorPresetSwatch
                $color="linear-gradient(135deg, #f00, #0f0, #00f)"
                style={{background: 'linear-gradient(135deg, #f44, #4f4, #44f)'}}
              />
              Custom...
            </ColorPresetRow>
          </CustomPickerWrapper>
        </ColorPickerPopover>
      )}
      {isOpen && showCustom && (
        <SingleColorPaletteWrapper onMouseDown={e => e.preventDefault()}>
          <SingleColorPalette
            selectedColor={color === 'transparent' ? '#000000' : color}
            onSelectColor={handleCustomSelect}
          />
        </SingleColorPaletteWrapper>
      )}
    </ColorPickerWrapper>
  );
};

const FONT_COLOR_PRESETS = [
  {color: '#FFFFFF', label: 'White'},
  {color: '#000000', label: 'Black'}
];

const BG_COLOR_PRESETS = [
  {color: 'transparent', label: 'No fill'},
  {color: '#000000', label: 'Black'},
  {color: '#FFFFFF', label: 'White'}
];

export const LexicalToolbar: FC<LexicalToolbarProps> = ({
  isEditingText,
  textVerticalAlign,
  onChangeTextVerticalAlign
}) => {
  const [editor] = useLexicalComposerContext();
  const {fontSize, fontFamily, fontColor, bgColor, handleChangeStyle} =
    useLexicalTextStyle({
      editor,
      isEditingText: Boolean(isEditingText)
    });
  const {isBold, isItalic, isUnderline, handleToggleTextFormat} = useLexicalTextFormat({
    editor,
    isEditingText: Boolean(isEditingText)
  });
  const {isLink, insertLink} = useInsertLexicalLink({
    editor,
    isEditingText: Boolean(isEditingText)
  });

  return (
    <ToolbarContainer className="lexical-toolbar" onMouseDown={e => {
      if (e.target instanceof HTMLSelectElement) return;
      e.preventDefault();
    }}>
      <ToolbarRow>
        <ToolbarSelect
          value={fontFamily}
          onChange={e => handleChangeStyle('font-family', e.target.value)}
          style={{marginRight: 2}}
        >
          {FONT_FAMILY_OPTIONS.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </ToolbarSelect>
        <ToolbarSelect
          value={fontSize}
          onChange={e => handleChangeStyle('font-size', e.target.value)}
        >
          {FONT_SIZE_OPTIONS.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </ToolbarSelect>
        <ToolbarDivider />
        <ToolbarButton $active={isBold} onClick={() => handleToggleTextFormat('bold')} title="Bold">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          $active={isItalic}
          onClick={() => handleToggleTextFormat('italic')}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          $active={isUnderline}
          onClick={() => handleToggleTextFormat('underline')}
          title="Underline"
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarDivider />
        <ColorPickerButton
          color={fontColor}
          presets={FONT_COLOR_PRESETS}
          title="Text Color"
          label="A"
          onSelectColor={c => handleChangeStyle('color', c)}
        />
        <ColorPickerButton
          color={bgColor}
          presets={BG_COLOR_PRESETS}
          title="Background Color"
          label=""
          renderIcon={() => (
            <svg viewBox="0 0 16 16" width="12" height="12" style={{fill: 'none', stroke: 'currentColor', strokeWidth: 1.5}}>
              <rect x="2" y="2" width="12" height="12" rx="1" strokeDasharray="2 1.5" />
              <line x1="4" y1="14" x2="14" y2="4" />
              <line x1="4" y1="10" x2="10" y2="4" />
              <line x1="4" y1="6" x2="6" y2="4" />
            </svg>
          )}
          onSelectColor={c => handleChangeStyle('background-color', c)}
        />
        <ToolbarDivider />
        <ToolbarButton
          $active={isLink}
          onClick={insertLink}
          disabled={!isEditingText}
          title="Insert Link"
        >
          🔗
        </ToolbarButton>
      </ToolbarRow>
    </ToolbarContainer>
  );
};
