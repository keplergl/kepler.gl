// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {FC, useCallback, useLayoutEffect, useMemo} from 'react';
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
import {Annotation, RulerAnnotation} from '@kepler.gl/types';
import {AnnotationKind} from '@kepler.gl/constants';
import {ActionHandler, updateAnnotation, setSelectedAnnotation} from '@kepler.gl/actions';
import AnnotationNode, {RulerEndpointHandles} from './annotation-node';
import AnnotationText from './annotation-text';
import {
  MapViewport,
  AnnotationWorldCopy,
  PickWorldPosition,
  getAnnotationWorldCopy,
  getWorldCopyLongitude,
  isAnnotationVisibleOnGlobe,
  movePoint,
  moveRulerEndpoint,
  moveText,
  resizeCircle
} from './annotation-utils';

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

function viewportForWorldCopy(viewport: MapViewport, copy?: AnnotationWorldCopy): MapViewport {
  if (!copy) return viewport;
  return {
    ...viewport,
    project: point => viewport.project(point),
    unproject: point => viewport.unproject(point),
    annotationAnchorLongitude: getWorldCopyLongitude(copy, viewport)
  };
}

export type AnnotationOverlayProps = {
  annotations: Annotation[];
  getAnnotationOpacity?: (annotationId: string) => number;
  selectedAnnotationId: string | null;
  isEditingAnnotationText: boolean;
  isAnnotationMode: boolean;
  mapIndex: number;
  viewport: MapViewport;
  isGlobeEnabled?: boolean;
  pickWorldPosition?: PickWorldPosition;
  updateAnnotation: ActionHandler<typeof updateAnnotation>;
  setSelectedAnnotation: ActionHandler<typeof setSelectedAnnotation>;
};

const AnnotationOverlay: FC<AnnotationOverlayProps> = ({
  annotations,
  getAnnotationOpacity = () => 1,
  selectedAnnotationId,
  isEditingAnnotationText,
  isAnnotationMode,
  mapIndex,
  viewport,
  isGlobeEnabled,
  pickWorldPosition,
  updateAnnotation: onUpdateAnnotation,
  setSelectedAnnotation: onSetSelectedAnnotation
}) => {
  const annotationsToRender = useMemo(
    () =>
      annotations
        .filter(
          ann =>
            (ann.mapIndex ?? 0) === mapIndex &&
            ann.isVisible &&
            // Hide annotations on the far side of the globe (occluded by the planet)
            (!isGlobeEnabled || isAnnotationVisibleOnGlobe(ann, viewport))
        )
        .reverse(),
    [annotations, mapIndex, isGlobeEnabled, viewport]
  );

  const draggedAnnotationRef = React.useRef<{
    annotation: Annotation;
    copy?: AnnotationWorldCopy;
  } | null>(null);
  const worldCopiesRef = React.useRef(new Map<string, AnnotationWorldCopy>());
  const {worldCopies, annotationViewports} = useMemo(() => {
    const copies = new Map<string, AnnotationWorldCopy>();
    const viewports = new Map<string, MapViewport>();
    for (const annotation of annotationsToRender) {
      const copy = isGlobeEnabled
        ? undefined
        : getAnnotationWorldCopy(
            annotation,
            viewport,
            worldCopiesRef.current.get(annotation.id),
            draggedAnnotationRef.current?.annotation.id === annotation.id
          );
      if (copy) copies.set(annotation.id, copy);
      viewports.set(annotation.id, viewportForWorldCopy(viewport, copy));
    }
    return {worldCopies: copies, annotationViewports: viewports};
  }, [annotationsToRender, viewport, isGlobeEnabled]);

  // Commit only rendered state, and discard copies for removed/hidden annotations
  // and globe mode. Each map overlay owns its own transient selection.
  useLayoutEffect(() => {
    worldCopiesRef.current = worldCopies;
  }, [worldCopies]);

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
      draggedAnnotationRef.current = ann
        ? {annotation: ann, copy: worldCopiesRef.current.get(annId)}
        : null;
      if (ann) {
        onSetSelectedAnnotation(ann.id, false);
      }
    },
    [annotations, onSetSelectedAnnotation]
  );

  const handleDragMove = useCallback(
    (ev: DragMoveEvent) => {
      const [annId, handleKind] = `${ev.active.id}`.split(':');
      const drag = draggedAnnotationRef.current;
      const draggedAnn = drag?.annotation;
      if (!draggedAnn || draggedAnn.id !== annId) return;
      // Dnd-kit deltas are cumulative, so retain the copy selected at drag start.
      const dragViewport = viewportForWorldCopy(viewport, isGlobeEnabled ? undefined : drag?.copy);

      let changes: Partial<Annotation> = {};
      switch (handleKind) {
        case 'MOVE_POINT':
          changes = movePoint(draggedAnn, ev.delta, dragViewport, pickWorldPosition);
          break;
        case 'MOVE_RULER_START':
          changes = moveRulerEndpoint(
            draggedAnn,
            'start',
            ev.delta,
            dragViewport,
            pickWorldPosition
          );
          break;
        case 'MOVE_RULER_END':
          changes = moveRulerEndpoint(draggedAnn, 'end', ev.delta, dragViewport, pickWorldPosition);
          break;
        case 'MOVE_TEXT':
          changes = moveText(draggedAnn, ev.delta, dragViewport, pickWorldPosition);
          break;
        case 'RESIZE':
          changes = resizeCircle(draggedAnn, ev.delta, dragViewport);
          break;
      }
      if (Object.keys(changes).length > 0) {
        if (changes.anchorPoint && !isGlobeEnabled) {
          worldCopiesRef.current.set(annId, {
            anchorLongitude: changes.anchorPoint[0],
            viewLongitude: viewport.longitude
          });
        }
        onUpdateAnnotation(annId, changes);
      }
    },
    [viewport, isGlobeEnabled, onUpdateAnnotation, pickWorldPosition]
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
        onDragCancel={handleDragEnd}
      >
        <AnnotationSvgContainer width={width} height={height}>
          {annotationsToRender.map(annotation => (
            <AnnotationNode
              key={annotation.id}
              annotation={annotation}
              opacity={getAnnotationOpacity(annotation.id)}
              viewport={annotationViewports.get(annotation.id)!}
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
              opacity={getAnnotationOpacity(annotation.id)}
              viewport={annotationViewports.get(annotation.id)!}
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
        <AnnotationSvgContainer width={width} height={height}>
          {annotationsToRender
            .filter(
              (annotation): annotation is RulerAnnotation =>
                annotation.kind === AnnotationKind.RULER
            )
            .map(annotation => (
              <RulerEndpointHandles
                key={annotation.id}
                annotation={annotation}
                opacity={getAnnotationOpacity(annotation.id)}
                viewport={annotationViewports.get(annotation.id)!}
                isEditing={isAnnotationMode}
                isSelected={annotation.id === selectedAnnotationId}
              />
            ))}
        </AnnotationSvgContainer>
      </DndContext>
    </AnnotationOverlayContainer>
  );
};

export default AnnotationOverlay;
