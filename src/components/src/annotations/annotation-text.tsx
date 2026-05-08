// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import {useDraggable} from '@dnd-kit/core';
import {Annotation, AnnotationWithArm} from '@kepler.gl/types';
import {AnnotationKind} from '@kepler.gl/constants';
import {makeMarker, isLeftOriented, MapViewport} from './annotation-utils';

type StyledAnnotationTextProps = {
  $isEditing?: boolean;
  $isSelected?: boolean;
  $isEditingText?: boolean;
};

const StyledAnnotationText = styled.div<StyledAnnotationTextProps>`
  position: absolute;
  color: #fff;
  transition: border-color 0.2s;
  border: 2px solid transparent;
  font-size: 14px;
  line-height: 1.4;
  padding: 4px 8px;
  white-space: pre-wrap;
  word-break: break-word;
  &:focus {
    outline: none;
  }
  ${props =>
    props.$isEditing
      ? `
        border-color: ${props.$isSelected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'};
        &:hover {
          border-color: rgba(255,255,255,0.6);
        }
        cursor: ${props.$isEditingText ? 'text' : 'move'};
        pointer-events: all;
      `
      : `
        pointer-events: none;
      `}
`;

const StyledInput = styled.textarea`
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
  width: 100%;
  min-width: 80px;
  min-height: 24px;
  resize: none;
  outline: none;
  padding: 0;
  overflow: hidden;
`;

export type AnnotationTextProps = {
  annotation: Annotation;
  viewport: MapViewport;
  isEditing: boolean;
  isSelected: boolean;
  isEditingText: boolean;
  onSelect: (isEditingText: boolean) => void;
  onChangeText: (text: string) => void;
};

const AnnotationText: FC<AnnotationTextProps> = ({
  annotation,
  viewport,
  isEditing,
  isSelected,
  isEditingText,
  onSelect,
  onChangeText
}) => {
  const {attributes, listeners, setNodeRef} = useDraggable({
    id: `${annotation.id}:MOVE_TEXT`
  });

  const {textWidth, lineColor, lineWidth} = annotation;
  const {x, y, tx, ty} = makeMarker(annotation, viewport);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [localText, setLocalText] = useState(annotation.label);

  const isArm = 'armLength' in annotation;
  const isLeft = isArm && isLeftOriented((annotation as AnnotationWithArm).angle);

  const style = useMemo(
    () => ({
      ...(annotation.autoSize ? {minWidth: 80} : {width: textWidth || 120}),
      bottom: viewport.height - (y + ty),
      borderBottom: annotation.kind !== AnnotationKind.TEXT
        ? `${lineWidth}px solid ${lineColor}`
        : undefined,
      ...(annotation.kind === AnnotationKind.TEXT
        ? {left: x + tx - (textWidth || 80) / 2}
        : isLeft
          ? {right: viewport.width - x - tx}
          : {left: x + tx})
    }),
    [annotation, textWidth, tx, ty, viewport.width, viewport.height, x, y, isLeft, lineWidth, lineColor]
  );

  const handleDoubleClick = useCallback(() => {
    onSelect(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [onSelect]);

  const handleBlur = useCallback(() => {
    if (localText !== annotation.label) {
      onChangeText(localText);
    }
    onSelect(false);
  }, [localText, annotation.label, onChangeText, onSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSelect(false);
      }
    },
    [onSelect]
  );

  // Keep localText in sync with annotation.label when not editing
  React.useEffect(() => {
    if (!isEditingText) {
      setLocalText(annotation.label);
    }
  }, [annotation.label, isEditingText]);

  return (
    <StyledAnnotationText
      ref={setNodeRef}
      $isEditing={isEditing}
      $isEditingText={isEditingText}
      $isSelected={isSelected}
      style={style}
      {...(isEditing && !isEditingText ? {...attributes, ...listeners} : {})}
      onDoubleClick={handleDoubleClick}
      onClick={e => {
        if (isEditing && !isSelected) {
          e.stopPropagation();
          onSelect(false);
        }
      }}
    >
      {isEditingText ? (
        <StyledInput
          ref={inputRef}
          value={localText}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span>{annotation.label}</span>
      )}
    </StyledAnnotationText>
  );
};

export default AnnotationText;
