// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC, useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {
  DndContext,
  DragMoveEvent,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {Annotation} from '@kepler.gl/types';
import {ActionHandler, updateAnnotation, setSelectedAnnotation} from '@kepler.gl/actions';
import AnnotationNode from './annotation-node';
import AnnotationText from './annotation-text';
import {MapViewport, movePoint, moveText, resizeCircle} from './annotation-utils';

const AnnotationOverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const AnnotationSvgContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const AnnotationTextContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`;

export type AnnotationOverlayProps = {
  annotations: Annotation[];
  selectedAnnotationId: string | null;
  isEditingAnnotationText: boolean;
  isAnnotationMode: boolean;
  mapIndex: number;
  viewport: MapViewport;
  updateAnnotation: ActionHandler<typeof updateAnnotation>;
  setSelectedAnnotation: ActionHandler<typeof setSelectedAnnotation>;
};

const AnnotationOverlay: FC<AnnotationOverlayProps> = ({
  annotations,
  selectedAnnotationId,
  isEditingAnnotationText,
  isAnnotationMode,
  mapIndex,
  viewport,
  updateAnnotation: onUpdateAnnotation,
  setSelectedAnnotation: onSetSelectedAnnotation
}) => {
  const annotationsToRender = useMemo(
    () => annotations.filter(ann => (ann.mapIndex ?? 0) === mapIndex && ann.isVisible).reverse(),
    [annotations, mapIndex]
  );

  const draggedAnnotationRef = React.useRef<Annotation | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {distance: 3}
    })
  );

  const accessibility = useMemo(
    () => ({
      announcements: {
        onDragStart() {
          return '';
        },
        onDragOver() {
          return '';
        },
        onDragEnd() {
          return '';
        },
        onDragCancel() {
          return '';
        }
      },
      screenReaderInstructions: {draggable: ''},
      ...(typeof document !== 'undefined' ? {container: document.body} : {})
    }),
    []
  );

  const handleDragStart = useCallback(
    (ev: DragStartEvent) => {
      const annId = `${ev.active.id}`.split(':')[0];
      const ann = annotations.find(a => a.id === annId) ?? null;
      draggedAnnotationRef.current = ann;
      if (ann) {
        onSetSelectedAnnotation(ann.id, false);
      }
    },
    [annotations, onSetSelectedAnnotation]
  );

  const handleDragMove = useCallback(
    (ev: DragMoveEvent) => {
      const [annId, handleKind] = `${ev.active.id}`.split(':');
      const draggedAnn = draggedAnnotationRef.current;
      if (!draggedAnn || draggedAnn.id !== annId) return;

      let changes: Partial<Annotation> = {};
      switch (handleKind) {
        case 'MOVE_POINT':
          changes = movePoint(draggedAnn, ev.delta, viewport);
          break;
        case 'MOVE_TEXT':
          changes = moveText(draggedAnn, ev.delta, viewport);
          break;
        case 'RESIZE':
          changes = resizeCircle(draggedAnn, ev.delta, viewport);
          break;
      }
      if (Object.keys(changes).length > 0) {
        onUpdateAnnotation(annId, changes);
      }
    },
    [viewport, onUpdateAnnotation]
  );

  const handleDragEnd = useCallback((_ev: DragEndEvent) => {
    draggedAnnotationRef.current = null;
  }, []);

  const handleSelectAnnotation = useCallback(
    (id: string, isEditingText: boolean) => {
      onSetSelectedAnnotation(id, isEditingText);
    },
    [onSetSelectedAnnotation]
  );

  const handleChangeText = useCallback(
    (id: string, text: string, editorState?: Record<string, any>) => {
      onUpdateAnnotation(id, {label: text, ...(editorState ? {editorState} : {})});
    },
    [onUpdateAnnotation]
  );

  if (!annotationsToRender.length) {
    return null;
  }

  const {width, height} = viewport;

  return (
    <AnnotationOverlayContainer>
      <DndContext
        sensors={sensors}
        accessibility={accessibility}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <AnnotationSvgContainer width={width} height={height}>
          {annotationsToRender.map(annotation => (
            <AnnotationNode
              key={annotation.id}
              annotation={annotation}
              viewport={viewport}
              isEditing={isAnnotationMode}
              isSelected={annotation.id === selectedAnnotationId}
            />
          ))}
        </AnnotationSvgContainer>
        <AnnotationTextContainer style={{width, height}}>
          {annotationsToRender.map(annotation => (
            <AnnotationText
              key={annotation.id}
              annotation={annotation}
              viewport={viewport}
              isEditing={isAnnotationMode}
              isSelected={annotation.id === selectedAnnotationId}
              isEditingText={annotation.id === selectedAnnotationId && isEditingAnnotationText}
              onSelect={isEditingText => handleSelectAnnotation(annotation.id, isEditingText)}
              onChangeText={(text, editorState) =>
                handleChangeText(annotation.id, text, editorState)
              }
              onUpdateAnnotation={config => onUpdateAnnotation(annotation.id, config)}
            />
          ))}
        </AnnotationTextContainer>
      </DndContext>
    </AnnotationOverlayContainer>
  );
};

export default AnnotationOverlay;
