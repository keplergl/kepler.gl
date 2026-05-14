// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC, useCallback, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {useDraggable} from '@dnd-kit/core';
import {Annotation, AnnotationWithArm} from '@kepler.gl/types';
import {AnnotationKind} from '@kepler.gl/constants';
import {makeMarker, isLeftOriented, MapViewport} from './annotation-utils';
import {LexicalRichTextEditor, LexicalToolbar} from './lexical-editor';
import {SerializedEditorState} from 'lexical';

type StyledAnnotationTextProps = {
  $isEditing?: boolean;
  $isSelected?: boolean;
  $isEditingText?: boolean;
  $textVerticalAlign?: string;
};

const StyledAnnotationText = styled.div<StyledAnnotationTextProps>`
  position: absolute;
  color: #fff;
  transition: border-color 0.2s;
  border: 2px solid transparent;
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
        cursor: move;
        pointer-events: all;
      `
      : `
        pointer-events: none;
        a {
          pointer-events: all;
          cursor: pointer;
        }
      `}
  ${props =>
    props.$isEditingText
      ? `
    .editor-inner {
      cursor: text;
    }
  `
      : ''}
  .editor-inner {
    justify-content: ${props =>
      props.$textVerticalAlign === 'top'
        ? 'flex-start'
        : props.$textVerticalAlign === 'middle'
        ? 'center'
        : 'flex-end'};
  }
`;

const StyledToolbarWrapper = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: rgba(30, 33, 40, 0.95);
  border-radius: 5px;
  width: max-content;
  padding: 2px 5px;
  margin-bottom: 4px;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

export type AnnotationTextProps = {
  annotation: Annotation;
  viewport: MapViewport;
  isEditing: boolean;
  isSelected: boolean;
  isEditingText: boolean;
  onSelect: (isEditingText: boolean) => void;
  onChangeText: (text: string, editorState?: SerializedEditorState) => void;
  onUpdateAnnotation: (config: Partial<Annotation>) => void;
};

const AnnotationText: FC<AnnotationTextProps> = ({
  annotation,
  viewport,
  isEditing,
  isSelected,
  isEditingText,
  onSelect,
  onChangeText,
  onUpdateAnnotation
}) => {
  const {attributes, listeners, setNodeRef} = useDraggable({
    id: `${annotation.id}:MOVE_TEXT`
  });

  const {textWidth, textHeight, lineColor, lineWidth, textVerticalAlign, autoSize, kind} =
    annotation;
  const {x, y, tx, ty} = makeMarker(annotation, viewport);

  const isArm = 'armLength' in annotation;
  const isLeft = isArm && isLeftOriented((annotation as AnnotationWithArm).angle);

  const style = useMemo(
    () => ({
      ...(autoSize ? {minWidth: 80} : {width: textWidth || 120}),
      bottom: viewport.height - (y + ty),
      borderBottom:
        kind !== AnnotationKind.TEXT ? `${lineWidth}px solid ${lineColor}` : undefined,
      ...(kind === AnnotationKind.TEXT
        ? {left: x + tx - (textWidth || 80) / 2}
        : isLeft
        ? {right: viewport.width - x - tx}
        : {left: x + tx})
    }),
    [autoSize, kind, textWidth, tx, ty, viewport.width, viewport.height, x, y, isLeft, lineWidth, lineColor]
  );

  const handleEditorChange = useCallback(
    (change: {text: string; editorState: SerializedEditorState}) => {
      onChangeText(change.text, change.editorState);
    },
    [onChangeText]
  );

  useEffect(() => {
    if (!isEditingText || !isSelected || !isEditing) {
      window.getSelection()?.removeAllRanges();
    }
  }, [isEditingText, isSelected, isEditing]);

  return (
    <StyledAnnotationText
      ref={setNodeRef}
      $isEditing={isEditing}
      $isEditingText={isEditingText}
      $isSelected={isSelected}
      $textVerticalAlign={textVerticalAlign}
      style={style}
      {...(isEditing
        ? {
            ...attributes,
            ...listeners,
            onPointerDown: (evt: React.PointerEvent) => {
              const {target} = evt;
              if (target instanceof Element && target.closest('.lexical-toolbar')) {
                return;
              }
              if (isEditingText) {
                if (target instanceof Element && target.closest('.editor-inner')) {
                  return;
                }
                listeners?.onPointerDown?.(evt as any);
                return;
              }
              listeners?.onPointerDown?.(evt as any);
              if (!isSelected) {
                onSelect(false);
              }
            }
          }
        : {})}
      onClick={evt => {
        if (!isEditing) return;
        const target = evt.target;
        if (target instanceof Element && target.closest('.lexical-toolbar')) {
          return;
        }
        evt.stopPropagation();
        if (!isEditingText) {
          onSelect(true);
        }
      }}
      onDoubleClick={() => {
        if (!isEditing) {
          onSelect(true);
        }
      }}
    >
      <LexicalRichTextEditor
        {...(isEditingText && annotation.autoSize ? {} : {width: textWidth || undefined})}
        {...(isEditingText && annotation.autoSizeY ? {} : {height: textHeight || undefined})}
        isEditable={isEditing && isEditingText}
        editorState={annotation.editorState as SerializedEditorState | undefined}
        initialText={annotation.label}
        onChange={handleEditorChange}
      >
        {isEditing && isSelected ? (
          <StyledToolbarWrapper>
            <LexicalToolbar
              isEditingText={isEditingText}
              textVerticalAlign={textVerticalAlign}
              onChangeTextVerticalAlign={value => {
                onUpdateAnnotation({textVerticalAlign: value});
              }}
            />
          </StyledToolbarWrapper>
        ) : null}
      </LexicalRichTextEditor>
    </StyledAnnotationText>
  );
};

export default AnnotationText;
