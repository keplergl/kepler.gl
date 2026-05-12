// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC, useCallback, useMemo, useRef} from 'react';
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
        cursor: ${props.$isEditingText ? 'text' : 'move'};
        pointer-events: all;
      `
      : `
        pointer-events: none;
      `}
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
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const DragHandle = styled.div`
  position: absolute;
  bottom: -1px;
  left: -24px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  pointer-events: all;
  z-index: 5;
  opacity: 0.85;
  transition: opacity 0.15s, background 0.15s;
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.35);
  }
  svg {
    width: 14px;
    height: 14px;
    fill: #fff;
  }
`;

function isDoubleClick(clickTime: number, prevClickTime: number): boolean {
  return clickTime - prevClickTime < 300;
}

const MoveIcon = () => (
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0l2 3H9v4h4V6l3 2-3 2V9H9v4h1l-2 3-2-3h1V9H3v1L0 8l3-2v1h4V3H6l2-3z" />
  </svg>
);

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

  const {textWidth, textHeight, lineColor, lineWidth, textVerticalAlign} = annotation;
  const {x, y, tx, ty} = makeMarker(annotation, viewport);
  const prevPointerDownTime = useRef(0);

  const isArm = 'armLength' in annotation;
  const isLeft = isArm && isLeftOriented((annotation as AnnotationWithArm).angle);

  const style = useMemo(
    () => ({
      ...(annotation.autoSize ? {minWidth: 80} : {width: textWidth || 120}),
      bottom: viewport.height - (y + ty),
      borderBottom:
        annotation.kind !== AnnotationKind.TEXT ? `${lineWidth}px solid ${lineColor}` : undefined,
      ...(annotation.kind === AnnotationKind.TEXT
        ? {left: x + tx - (textWidth || 80) / 2}
        : isLeft
        ? {right: viewport.width - x - tx}
        : {left: x + tx})
    }),
    [annotation, textWidth, tx, ty, viewport.width, viewport.height, x, y, isLeft, lineWidth, lineColor]
  );

  const handleEditorChange = useCallback(
    (change: {text: string; editorState: SerializedEditorState}) => {
      onChangeText(change.text, change.editorState);
    },
    [onChangeText]
  );

  const handleDoubleClick = useCallback(() => {
    onSelect(true);
  }, [onSelect]);

  return (
    <StyledAnnotationText
      ref={setNodeRef}
      $isEditing={isEditing}
      $isEditingText={isEditingText}
      $isSelected={isSelected}
      $textVerticalAlign={textVerticalAlign}
      style={style}
      {...(isEditing && !isEditingText
        ? {
            ...attributes,
            ...listeners,
            onPointerDown: (evt: React.PointerEvent) => {
              const {target, timeStamp} = evt;
              if (target instanceof Element && target.closest('.lexical-toolbar')) {
                return;
              }
              if (target instanceof Element && target.closest('.drag-handle')) {
                return;
              }
              if (isSelected && isDoubleClick(timeStamp, prevPointerDownTime.current)) {
                onSelect(true);
              } else {
                listeners?.onPointerDown?.(evt as any);
                onSelect(false);
              }
              prevPointerDownTime.current = timeStamp;
            }
          }
        : null)}
      onPointerDown={(evt: React.PointerEvent) => {
        if (!isEditing) return;
        if (isEditingText) {
          const {target, timeStamp} = evt;
          if (target instanceof Element && target.closest('.drag-handle')) {
            return;
          }
          prevPointerDownTime.current = timeStamp;
        }
      }}
      onClick={evt => {
        if (isSelected) {
          evt.stopPropagation();
        }
      }}
      onDoubleClick={() => {
        if (!isEditing) {
          handleDoubleClick();
        }
      }}
    >
      {isEditing && isSelected && (
        <DragHandle className="drag-handle" {...attributes} {...listeners}>
          <MoveIcon />
        </DragHandle>
      )}
      <LexicalRichTextEditor
        {...(isEditingText && annotation.autoSize ? {} : {width: textWidth || undefined})}
        {...(isEditingText && annotation.autoSizeY ? {} : {height: textHeight || undefined})}
        isEditable={isEditingText}
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
