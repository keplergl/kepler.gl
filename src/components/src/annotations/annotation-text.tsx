// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC, useCallback, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import {useDraggable} from '@dnd-kit/core';
import {Annotation} from '@kepler.gl/types';
import {AnnotationKind} from '@kepler.gl/constants';
import {hexToRgb, normalizeAnnotationLabelBackground} from '@kepler.gl/utils';
import {
  getAnnotationTextBoxStyle,
  getRulerDistanceLabel,
  makeMarker,
  RulerAnnotationMarker,
  isPointVisibleOnGlobe,
  MapViewport
} from './annotation-utils';
import {LexicalRichTextEditor, LexicalToolbar} from './lexical-editor';
import {
  SerializedEditorState,
  SerializedElementNode,
  SerializedLexicalNode,
  SerializedTextNode
} from 'lexical';

function firstTextNode(
  node: SerializedLexicalNode,
  requireContent = false
): SerializedTextNode | undefined {
  if (!node) return undefined;
  if (node.type === 'text') {
    const text = node as SerializedTextNode;
    return !requireContent || (typeof text.text === 'string' && text.text.trim())
      ? text
      : undefined;
  }
  const children = (node as SerializedElementNode).children;
  if (!Array.isArray(children)) return undefined;
  for (const child of children) {
    const text = firstTextNode(child, requireContent);
    if (text) return text;
  }
  return undefined;
}

function readoutEditorState(
  editorState: SerializedEditorState | undefined,
  value: string
): SerializedEditorState<SerializedElementNode<SerializedTextNode>> | undefined {
  const blocks = editorState?.root?.children;
  if (!editorState || !Array.isArray(blocks) || !blocks.length) return undefined;
  // Readouts use the first text run's formatting, including empty styled labels.
  const block = (blocks.find(node => firstTextNode(node)) ??
    blocks.find(node => node?.type === 'paragraph')) as SerializedElementNode | undefined;
  if (!block) return undefined;
  const text = firstTextNode(block);
  return {
    root: {
      ...editorState.root,
      children: [
        {
          type: 'paragraph',
          version: 1,
          direction: block.direction,
          format: block.format,
          indent: 0,
          children: [
            {
              type: 'text',
              version: 1,
              text: value,
              style: text?.style ?? '',
              format: text?.format ?? 0,
              detail: 0,
              mode: 'normal'
            }
          ]
        }
      ]
    }
  };
}

const ignoreReadoutChange = () => undefined;

// A distance-only ruler can have no caption at all. Initialize its hidden
// formatting editor with a paragraph so Lexical reports the first style edit.
const EMPTY_LABEL_STATE: SerializedEditorState = {
  root: {
    type: 'root',
    version: 1,
    direction: null,
    format: '',
    indent: 0,
    children: [
      {
        type: 'paragraph',
        version: 1,
        direction: null,
        format: '',
        indent: 0,
        children: []
      } as SerializedElementNode
    ]
  }
};

type StyledAnnotationTextProps = {
  $isEditing?: boolean;
  $isSelected?: boolean;
  $isEditingText?: boolean;
  $isDraggable?: boolean;
  $textVerticalAlign?: string;
  $isViewport?: boolean;
  $emptyLabel?: boolean;
  $hideCustomText?: boolean;
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
        cursor: ${props.$isDraggable ? 'move' : 'default'};
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
  ${props =>
    props.$emptyLabel
      ? props.$isEditing && props.$isEditingText
        ? `
    > .editor-container > .editor-inner {
      height: 0;
      justify-content: flex-start;
    }
    > .editor-container > .editor-inner > .editor-input {
      position: absolute;
      width: 6px;
      margin-inline-start: -6px;
    }
  `
        : `
    > .editor-container > .editor-inner { display: none; }
  `
      : ''}
  ${props =>
    props.$hideCustomText ? `> .editor-container > .editor-inner { display: none; }` : ''}
  .editor-inner {
    justify-content: ${props =>
      props.$textVerticalAlign === 'top'
        ? 'flex-start'
        : props.$textVerticalAlign === 'middle'
        ? 'center'
        : 'flex-end'};
  }
  ${props =>
    props.$isViewport
      ? `
    .editor-inner { max-width: 100%; }
    .editor-input { min-width: 0; }
  `
      : ''}
`;

const StyledToolbarWrapper = styled.div<{$isViewport?: boolean}>`
  position: ${props => (props.$isViewport ? 'relative' : 'absolute')};
  bottom: ${props => (props.$isViewport ? 'auto' : '100%')};
  left: 0;
  background-color: rgba(30, 33, 40, 0.95);
  border-radius: 5px;
  width: max-content;
  max-width: ${props => (props.$isViewport ? '100%' : 'none')};
  padding: 2px 5px;
  margin-bottom: 4px;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const StyledRulerDistance = styled.div`
  line-height: 1.4;
  white-space: nowrap;
`;

export type AnnotationTextProps = {
  isGlobeEnabled?: boolean;
  annotation: Annotation;
  readoutValue?: string;
  opacity?: number;
  viewport: MapViewport;
  isEditing: boolean;
  isSelected: boolean;
  isEditingText: boolean;
  onSelect: (isEditingText: boolean) => void;
  onChangeText: (text: string, editorState?: SerializedEditorState) => void;
  onUpdateAnnotation: (config: Partial<Annotation>) => void;
};

const AnnotationText: FC<AnnotationTextProps> = ({
  isGlobeEnabled,
  annotation,
  readoutValue,
  opacity = 1,
  viewport,
  isEditing,
  isSelected,
  isEditingText,
  onSelect,
  onChangeText,
  onUpdateAnnotation
}) => {
  const isViewport = annotation.kind === AnnotationKind.TEXT && Boolean(annotation.viewport);
  const isRuler = annotation.kind === AnnotationKind.RULER;
  const showCustomText = !isRuler || annotation.showCustomText;
  const hasReadout = showCustomText && Boolean(annotation.readout);
  const formattedReadout = useMemo(
    () =>
      hasReadout
        ? readoutEditorState(
            annotation.editorState as SerializedEditorState | undefined,
            readoutValue ?? '—'
          )
        : undefined,
    [hasReadout, annotation.editorState, readoutValue]
  );
  const hasLabel = useMemo(() => {
    if (!hasReadout) return true;
    const blocks = (annotation.editorState as SerializedEditorState | undefined)?.root?.children;
    return Array.isArray(blocks)
      ? blocks.some(node => firstTextNode(node, true))
      : Boolean(annotation.label?.trim());
  }, [hasReadout, annotation.editorState, annotation.label]);
  // Keep the editor mounted and focused when its empty caption no longer takes a row.
  const emptyLabel = !hasLabel;
  const distanceText = isRuler && annotation.showDistance ? getRulerDistanceLabel(annotation) : '';
  const styledRuler = isRuler && Boolean(annotation.rulerStyle);
  const formattedDistance = useMemo(
    () =>
      styledRuler
        ? readoutEditorState(
            annotation.editorState as SerializedEditorState | undefined,
            distanceText
          )
        : undefined,
    [styledRuler, annotation.editorState, distanceText]
  );
  const background = normalizeAnnotationLabelBackground(annotation.labelBackground);
  const backgroundStyle = background
    ? {
        backgroundColor: `rgba(${hexToRgb(background.color).join(',')},${background.opacity})`,
        padding: background.padding
      }
    : {};
  const isDraggable = !isRuler;
  const {attributes, listeners, setNodeRef} = useDraggable({
    id: `${annotation.id}:MOVE_TEXT`,
    disabled: !isDraggable
  });

  const {textWidth, textHeight, textVerticalAlign} = annotation;

  const style = useMemo(
    () => getAnnotationTextBoxStyle(annotation, viewport, isGlobeEnabled),
    [annotation, viewport, isGlobeEnabled]
  );

  const handleEditorChange = useCallback(
    (change: {text: string; editorState: SerializedEditorState}) => {
      onChangeText(change.text, change.editorState);
    },
    [onChangeText]
  );

  useEffect(() => {
    if (!isEditingText || !isSelected || !isEditing || !showCustomText) {
      window.getSelection()?.removeAllRanges();
    }
  }, [isEditingText, isSelected, isEditing, showCustomText]);

  const endpoints =
    isRuler && annotation.rulerStyle
      ? (() => {
          const marker = makeMarker(annotation, viewport) as RulerAnnotationMarker;
          return [
            {
              name: annotation.rulerStyle.startLabel,
              point: annotation.anchorPoint,
              x: marker.x,
              y: marker.y
            },
            {
              name: annotation.rulerStyle.endLabel,
              point: annotation.endPoint,
              x: marker.x + marker.ex,
              y: marker.y + marker.ey
            }
          ].filter(
            endpoint =>
              endpoint.name && (!isGlobeEnabled || isPointVisibleOnGlobe(endpoint.point, viewport))
          );
        })()
      : [];
  const hasMidpointText = showCustomText || Boolean(distanceText);
  if (!hasMidpointText && !endpoints.length) return null;

  return (
    <>
      {hasMidpointText ? (
        <StyledAnnotationText
          ref={setNodeRef}
          $isEditing={isEditing}
          $isEditingText={isEditingText}
          $isSelected={isSelected}
          $isDraggable={isDraggable}
          $textVerticalAlign={textVerticalAlign}
          $isViewport={isViewport}
          $emptyLabel={emptyLabel}
          $hideCustomText={!showCustomText}
          data-annotation-id={annotation.id}
          data-annotation-part="text"
          style={{
            ...style,
            ...backgroundStyle,
            // Keep editing popovers reachable; view/export composition stays clipped to its margins.
            ...(isViewport && isEditing && isSelected ? {overflow: 'visible'} : {}),
            opacity,
            visibility: opacity === 0 ? 'hidden' : undefined,
            pointerEvents: opacity === 0 ? 'none' : undefined
          }}
          {...(isEditing && isDraggable
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
              onSelect(showCustomText);
            }
          }}
          onDoubleClick={() => {
            if (!isEditing) {
              onSelect(true);
            }
          }}
        >
          {showCustomText || (styledRuler && isEditing && isSelected) ? (
            <LexicalRichTextEditor
              {...(isEditingText && annotation.autoSize ? {} : {width: textWidth || undefined})}
              {...(isEditingText && annotation.autoSizeY ? {} : {height: textHeight || undefined})}
              isEditable={isEditing && isEditingText && showCustomText}
              editorState={
                (annotation.editorState as SerializedEditorState | undefined) ??
                (styledRuler && !annotation.label ? EMPTY_LABEL_STATE : undefined)
              }
              initialText={annotation.label}
              onChange={handleEditorChange}
            >
              {isEditing && isSelected ? (
                <StyledToolbarWrapper $isViewport={isViewport}>
                  <LexicalToolbar
                    isEditingText={isEditingText && showCustomText}
                    textVerticalAlign={textVerticalAlign}
                    onChangeTextVerticalAlign={value => {
                      onUpdateAnnotation({textVerticalAlign: value});
                    }}
                  />
                </StyledToolbarWrapper>
              ) : null}
            </LexicalRichTextEditor>
          ) : null}
          {distanceText ? (
            <StyledRulerDistance data-annotation-part="distance">
              {styledRuler ? (
                <LexicalRichTextEditor
                  key={JSON.stringify([distanceText, formattedDistance])}
                  isEditable={false}
                  editorState={formattedDistance}
                  initialText={distanceText}
                  onChange={ignoreReadoutChange}
                />
              ) : (
                distanceText
              )}
            </StyledRulerDistance>
          ) : null}
          {hasReadout ? (
            <div data-annotation-part="readout">
              <LexicalRichTextEditor
                // Initialize each value synchronously, before an export frame can capture it.
                key={readoutValue ?? '—'}
                isEditable={false}
                editorState={formattedReadout}
                height={emptyLabel && !annotation.autoSizeY ? textHeight || undefined : undefined}
                initialText={readoutValue ?? '—'}
                onChange={ignoreReadoutChange}
              />
            </div>
          ) : null}
        </StyledAnnotationText>
      ) : null}
      {endpoints.map((endpoint, index) => (
        <StyledAnnotationText
          key={index}
          data-annotation-id={annotation.id}
          data-annotation-part="endpoint-label"
          style={{
            ...backgroundStyle,
            left: endpoint.x,
            top: endpoint.y - 10,
            transform: 'translate(-50%, -100%)',
            opacity,
            visibility: opacity === 0 ? 'hidden' : undefined
          }}
        >
          <LexicalRichTextEditor
            key={JSON.stringify([endpoint.name, annotation.editorState])}
            isEditable={false}
            editorState={readoutEditorState(
              annotation.editorState as SerializedEditorState | undefined,
              endpoint.name
            )}
            initialText={endpoint.name}
            onChange={ignoreReadoutChange}
          />
        </StyledAnnotationText>
      ))}
    </>
  );
};

export default AnnotationText;
