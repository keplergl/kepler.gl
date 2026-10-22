// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext, useId, useLayoutEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {
  CameraBookmark,
  CameraSnapshot,
  CameraTour,
  CameraTourStop,
  MapState
} from '@kepler.gl/types';
import {MapStateActions, UIStateActions, VisStateActions} from '@kepler.gl/actions';
import {generateHashId} from '@kepler.gl/common-utils';
import {getCameraSnapshot, normalizeCameraTour} from '@kepler.gl/utils';
import {Button, Input, InlineInput, PanelContent, PanelLabel} from '../../common/styled-components';
import {MapViewStateContext} from '../../map-view-state-context';
import useCameraTourPlayback from './use-camera-tour-playback';
import CameraPanelHeader, {CameraPanel, CameraIconButton} from './camera-panel-header';
import {Play, Pause, Reset, Add, LocationMarker, Replace, Delete, Copy} from '../../common/icons';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  CollisionDetection
} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {restrictToHorizontalAxis} from '@dnd-kit/modifiers';
import PanelHeaderActionFactory from '../panel-header-action';
import {Hint} from './zoom-opacity-config';
import Portaled from '../../common/portaled';
import {ContextMenu} from '../../common/context-menu';

const PanelHeaderAction = PanelHeaderActionFactory();
const TRACK_MODIFIERS = [restrictToHorizontalAxis];

// Identical arrival times have identical targets. Resolve them as a one-place
// move in the drag direction, rather than silently choosing DOM registration order.
const timelineCollision = (
  args: Parameters<CollisionDetection>[0],
  stops: CameraTourStop[],
  originX: number
) => {
  const hits = args.pointerCoordinates ? pointerWithin(args) : closestCenter(args);
  if (hits.length < 2 || !args.pointerCoordinates) return hits;
  const first = args.droppableRects.get(hits[0].id);
  if (!first) return hits;
  const tied = hits.filter(hit => {
    const rect = args.droppableRects.get(hit.id);
    return (
      rect && Math.abs(rect.left - first.left) < 0.5 && Math.abs(rect.width - first.width) < 0.5
    );
  });
  if (tied.length < 2) return hits;
  const direction = Math.sign(args.pointerCoordinates.x - originX);
  const from = stops.findIndex(stop => stop.id === args.active.id);
  const ordered = tied.sort(
    (a, b) => stops.findIndex(stop => stop.id === a.id) - stops.findIndex(stop => stop.id === b.id)
  );
  const target =
    direction > 0
      ? ordered.find(hit => stops.findIndex(stop => stop.id === hit.id) > from)
      : direction < 0
      ? [...ordered].reverse().find(hit => stops.findIndex(stop => stop.id === hit.id) < from)
      : undefined;
  const hit = target || tied.find(item => item.id === args.active.id);
  return hit ? [hit] : [];
};

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin-bottom: 8px;
  > button:first-child {
    flex-shrink: 0;
  }
`;
const TrackViewport = styled.div`
  max-width: 100%;
  margin-bottom: 8px;
`;
// Blocks use the full content width; only marker hit targets are clamped inward
// at the endpoints. Zero-length intervals remain zero width.
const StopTrack = styled.div`
  position: relative;
  height: 58px;
  user-select: none;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 16px;
    border-top: 1px solid ${props => props.theme.textColor};
    opacity: 0.25;
  }
`;
const MarkerSlot = styled.div`
  position: absolute;
  top: 0;
  width: 32px;
  height: 32px;
  margin-left: -16px;
`;
const TimeSegment = styled.button<{$travel: boolean; $selected: boolean}>`
  position: absolute;
  top: 34px;
  height: 22px;
  min-width: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  color: ${props => (props.$selected ? props.theme.textColorHl : props.theme.textColor)};
  background: ${props =>
    props.$travel
      ? `repeating-linear-gradient(135deg, ${props.theme.panelContentBackground} 0 3px, ${props.theme.panelBackgroundHover} 3px 4px)`
      : props.theme.panelBackgroundHover};
  box-shadow: inset 0 0 0 1px
    ${props => (props.$selected ? props.theme.activeColor : props.theme.panelBorderColor)};
  font-size: 10px;
  &:hover {
    box-shadow: inset 0 0 0 2px ${props => props.theme.activeColor};
  }
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: 1px;
    z-index: 2;
  }
`;
// The numbered marker is compact; its transparent button remains easy to target.
const StopMarker = styled.button<{$selected: boolean; $dragging: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: transparent;
  border: 0;
  color: ${props => (props.$selected ? props.theme.panelContentBackground : props.theme.textColor)};
  cursor: ${props => (props.$dragging ? 'grabbing' : 'grab')};
  width: 32px;
  height: 32px;
  padding: 0;
  touch-action: none;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: 18px;
    height: 18px;
    padding: 0 3px;
    border-radius: 9px;
    border: 1px solid
      ${props =>
        props.$selected ? props.theme.activeColor : props.theme.sliderInactiveBorderColor};
    background: ${props =>
      props.$selected ? props.theme.activeColor : props.theme.panelBackground};
    font-size: 10px;
    line-height: 1;
    font-weight: 600;
  }
  &[data-drop-target] span,
  &:hover span {
    border-color: ${props => props.theme.activeColor};
  }
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: -2px;
    border-radius: 3px;
  }
  &[aria-current='step']::after {
    content: '';
    position: absolute;
    bottom: 1px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: ${props => props.theme.textColor};
  }
`;
const StopEditor = styled.div`
  border: 1px solid ${props => props.theme.panelBorderColor};
  border-radius: 3px;
  padding: 8px;
`;
const StopHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
`;
const StopName = styled(InlineInput)`
  min-width: 0;
  flex: 1;
  height: 24px;
  padding: 2px 4px;
  font-size: 12px;
`;
const StopActions = styled.div`
  display: flex;
  flex-shrink: 0;
`;
const StopActionButton = styled(CameraIconButton)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 2px;
  color: ${props => props.theme.textColor};
  &:hover:not(:disabled) {
    background: ${props => props.theme.panelBackgroundHover};
    color: ${props => props.theme.textColorHl};
  }
  &:disabled {
    opacity: 0.4;
  }
`;
const Timing = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: end;
  gap: 8px;
  label {
    min-width: 0;
    margin-bottom: 0;
    text-transform: none;
  }
  input {
    width: 100%;
    height: ${props => props.theme.inputBoxHeightSmall};
    padding: ${props => props.theme.inputPaddingSmall};
    font-size: ${props => props.theme.inputFontSizeSmall};
    margin-top: 4px;
  }
`;
const EndOfTour = styled.div`
  color: ${props => props.theme.labelColor};
  font-size: 11px;
  span {
    display: flex;
    align-items: center;
    height: ${props => props.theme.inputBoxHeightSmall};
    margin-top: 4px;
  }
`;
const Timeline = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`;
const Scrubber = styled.input<{$progress: number}>`
  appearance: none;
  min-width: 24px;
  flex: 1;
  height: 24px;
  margin: 0 4px;
  background: transparent;
  cursor: pointer;
  &::-webkit-slider-runnable-track {
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(
      to right,
      ${props => props.theme.activeColor} ${props => props.$progress}%,
      ${props => props.theme.sliderBarBgd} ${props => props.$progress}%
    );
  }
  &::-moz-range-track {
    height: 3px;
    border-radius: 2px;
    background: ${props => props.theme.sliderBarBgd};
  }
  &::-moz-range-progress {
    height: 3px;
    background: ${props => props.theme.activeColor};
  }
  &::-webkit-slider-thumb {
    appearance: none;
    width: 9px;
    height: 9px;
    margin-top: -3px;
    border: 0;
    border-radius: 50%;
    background: ${props => props.theme.sliderHandleColor};
  }
  &::-moz-range-thumb {
    width: 9px;
    height: 9px;
    border: 0;
    border-radius: 50%;
    background: ${props => props.theme.sliderHandleColor};
  }
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: 1px;
  }
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;
const TimeReadout = styled.div<{$elapsedWidth: number}>`
  color: ${props => props.theme.textColor};
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
  output:first-child {
    display: inline-block;
    min-width: ${props => props.$elapsedWidth}ch;
    text-align: right;
  }
`;
const AddStopAnchor = styled.div`
  position: relative;
`;
const MenuAnchor = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 0;
`;
const SourceMenu = styled(ContextMenu)`
  ${props => props.theme.dropdownList};
  width: 226px;
  min-width: 0;
  max-width: calc(100vw - 80px);
  max-height: min(280px, calc(100vh - 80px));
  overflow-x: hidden;
  button {
    display: block;
    width: 100%;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
    &:focus-visible {
      outline: 2px solid ${props => props.theme.activeColor};
      outline-offset: -2px;
      background: ${props => props.theme.dropdownListHighlightBg};
    }
    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
  .list__item__anchor {
    display: block;
  }
`;

type StopSource = {key: string; label: string; disabled: boolean; bookmarkId?: string};

function StopSourceMenu({
  id,
  label,
  sources,
  onSelect,
  onClose
}: {
  id: string;
  label: string;
  sources: StopSource[];
  onSelect: (source: StopSource) => void;
  onClose: () => void;
}) {
  const menu = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    // Preserve focus by bookmark identity through list updates. If the focused
    // source was removed or disabled, fall back to the first available source.
    if (
      !menu.current?.contains(document.activeElement) ||
      (document.activeElement as HTMLButtonElement)?.disabled
    ) {
      menu.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    }
  }, [sources]);
  return (
    <SourceMenu
      id={id}
      ref={menu}
      role="menu"
      aria-label={label}
      onKeyDown={event => {
        if (event.key === 'Escape' || event.key === 'Tab') {
          event.preventDefault();
          event.stopPropagation();
          onClose();
          return;
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const items = Array.from(
          menu.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') || []
        );
        const index = items.indexOf(document.activeElement as HTMLButtonElement);
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
            ? items.length - 1
            : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
      }}
    >
      {sources.map(source => (
        <button
          key={source.key}
          type="button"
          role="menuitem"
          className="list__item"
          tabIndex={-1}
          disabled={source.disabled}
          onClick={() => onSelect(source)}
        >
          <span className="list__item__anchor" title={source.label}>
            {source.label}
          </span>
        </button>
      ))}
    </SourceMenu>
  );
}

function DraggableStopMarker({
  stop,
  index,
  selected,
  current,
  panelId,
  onSelect,
  onMoveFocus,
  markerRef,
  position
}: {
  stop: CameraTourStop;
  index: number;
  selected: boolean;
  current: boolean;
  panelId: string;
  onSelect: () => void;
  onMoveFocus: (key: string) => void;
  markerRef: (node: HTMLButtonElement | null) => void;
  position: number;
}) {
  const intl = useIntl();
  const {listeners, setNodeRef, transform, isDragging} = useDraggable({id: stop.id});
  const {setNodeRef: setDropRef, isOver} = useDroppable({id: stop.id});
  const label = `${intl.formatMessage({id: 'camera.stop', defaultMessage: 'Stop'})} ${index + 1}: ${
    stop.name
  }`;
  return (
    <MarkerSlot
      ref={setDropRef}
      className="camera-tour-marker-slot"
      style={{
        left: `clamp(16px, ${position}%, calc(100% - 16px))`,
        zIndex: isDragging ? 4 : isOver ? 3 : selected ? 2 : 1
      }}
    >
      <StopMarker
        {...listeners}
        ref={node => {
          setNodeRef(node);
          markerRef(node);
        }}
        id={`${panelId}-${stop.id}`}
        type="button"
        data-stop-id={stop.id}
        data-dragging={isDragging || undefined}
        $selected={selected}
        $dragging={isDragging}
        style={{transform: CSS.Translate.toString(transform)}}
        data-drop-target={isOver || undefined}
        aria-label={label}
        title={label}
        aria-pressed={selected}
        aria-current={current ? 'step' : undefined}
        aria-controls={`${panelId}-selected-stop`}
        onClick={onSelect}
        onKeyDown={event => {
          if (!isDragging && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            onMoveFocus(event.key);
          } else if (!isDragging && event.key === 'Enter') {
            event.preventDefault();
            onSelect();
          }
        }}
      >
        <span aria-hidden="true">{index + 1}</span>
      </StopMarker>
    </MarkerSlot>
  );
}

export type CameraTourConfigProps = {
  tour?: CameraTour | null;
  enabled?: boolean;
  uiStateActions?: typeof UIStateActions;
  bookmarks?: CameraBookmark[];
  mapState?: MapState;
  mapStateActions?: typeof MapStateActions;
  visStateActions: typeof VisStateActions;
};

export default function CameraTourConfig({
  tour,
  enabled = true,
  uiStateActions,
  bookmarks = [],
  mapState,
  mapStateActions,
  visStateActions
}: CameraTourConfigProps) {
  const panelId = `camera-tour-${useId()}`;
  const [open, setOpen] = useState(false);
  const [sourceMenuOpen, setSourceMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const intl = useIntl();
  const message = (key: string, fallback: string) =>
    intl.formatMessage({id: `camera.${key}`, defaultMessage: fallback});
  const seconds = (time: number) =>
    `${intl.formatNumber(time / 1000, {maximumFractionDigits: 2})} s`;
  const {getInternalViewState} = useContext(MapViewStateContext);
  const readCamera = () => getCameraSnapshot(getInternalViewState()) || getCameraSnapshot(mapState);
  const supported = Boolean(mapState && !mapState.isSplit && !mapState.globe?.enabled);
  const playback = useCameraTourPlayback(tour, mapStateActions?.updateMap, supported && enabled);
  const stops = tour?.stops || [];
  const selected = stops.find(stop => stop.id === selectedId) || stops[0];
  const selectedIndex = selected ? stops.indexOf(selected) : -1;
  const markerRefs = useRef(new Map<string, HTMLButtonElement>());
  const addButton = useRef<HTMLButtonElement>(null);
  const closeSourceMenu = () => {
    setSourceMenuOpen(false);
    addButton.current?.focus();
  };
  useLayoutEffect(() => {
    if (sourceMenuOpen && (!bookmarks.length || !supported || !open)) {
      setSourceMenuOpen(false);
      addButton.current?.focus();
    }
  }, [sourceMenuOpen, bookmarks.length, supported, open]);
  const sources: StopSource[] = [
    {key: 'current', label: message('currentView', 'Current view'), disabled: !readCamera()},
    ...bookmarks.map(bookmark => ({
      key: `bookmark:${bookmark.id}`,
      bookmarkId: bookmark.id,
      label: bookmark.name,
      disabled: !getCameraSnapshot(bookmark.camera)
    }))
  ];
  const timingInputs = useRef<
    Partial<Record<'holdDurationMs' | 'travelDurationMs', HTMLInputElement>>
  >({});
  const pendingTimingFocus = useRef<'holdDurationMs' | 'travelDurationMs' | null>(null);
  const dragStops = useRef<CameraTourStop[] | null>(null);
  const dragOriginX = useRef(0);
  const focusRequest = useRef<string | null | undefined>(undefined);
  useLayoutEffect(() => {
    if (pendingTimingFocus.current) {
      timingInputs.current[pendingTimingFocus.current]?.focus();
      pendingTimingFocus.current = null;
    }
    if (focusRequest.current === undefined) return;
    const target = focusRequest.current
      ? markerRefs.current.get(focusRequest.current)
      : addButton.current;
    target?.focus();
    focusRequest.current = undefined;
  }, [stops, selectedId]);
  const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 4}}));
  let time = 0;
  const starts = stops.map(stop => {
    const start = time;
    time += stop.holdDurationMs + stop.travelDurationMs;
    return start;
  });
  const percent = (duration: number) =>
    playback.duration > 0 && Number.isFinite(duration)
      ? Math.max(0, Math.min(100, (duration / playback.duration) * 100))
      : 0;
  const focusTiming = (stop: CameraTourStop, field: 'holdDurationMs' | 'travelDurationMs') => {
    playback.pause();
    if (selected?.id === stop.id) timingInputs.current[field]?.focus();
    else {
      pendingTimingFocus.current = field;
      setSelectedId(stop.id);
    }
  };
  const currentIndex = starts.reduce(
    (current, start, index) => (start <= playback.elapsed ? index : current),
    0
  );
  const commit = (next: CameraTourStop[]) => {
    // Reject unsafe combined durations without clearing the existing tour.
    if (next.length && !normalizeCameraTour({stops: next})) return false;
    playback.pause();
    visStateActions.setCameraTour(next.length ? {stops: next} : null);
    return true;
  };
  const add = (camera: CameraSnapshot | null, name?: string) => {
    if (!camera) return;
    const id = generateHashId(6);
    const saved = commit([
      ...stops,
      {
        id,
        name: name || `${message('stop', 'Stop')} ${stops.length + 1}`,
        camera,
        holdDurationMs: 2000,
        travelDurationMs: 3000
      }
    ]);
    if (saved) setSelectedId(id);
  };
  const update = (id: string, changes: Partial<CameraTourStop>) =>
    commit(stops.map(stop => (stop.id === id ? {...stop, ...changes} : stop)));
  const select = (index: number) => {
    playback.pause();
    setSelectedId(stops[index].id);
  };
  const stopActions = selected
    ? [
        {
          key: 'goTo',
          label: message('goTo', 'Go to'),
          Icon: LocationMarker,
          disabled: !enabled || !mapStateActions,
          onClick: () => playback.seek(starts[selectedIndex])
        },
        {
          key: 'pickCurrentLocation',
          label: message('pickCurrentLocation', 'Pick current location'),
          Icon: Replace,
          disabled: !readCamera(),
          onClick: () => {
            const camera = readCamera();
            if (camera) update(selected.id, {camera});
          }
        },
        {
          key: 'duplicate',
          label: message('duplicate', 'Duplicate'),
          Icon: Copy,
          onClick: () => {
            const id = generateHashId(6);
            const next = [...stops];
            next.splice(selectedIndex + 1, 0, {...selected, id, camera: {...selected.camera}});
            if (commit(next)) {
              focusRequest.current = id;
              setSelectedId(id);
            }
          }
        },
        {
          key: 'delete',
          label: message('delete', 'Delete'),
          Icon: Delete,
          onClick: () => {
            const next = stops.filter(stop => stop.id !== selected.id);
            if (commit(next)) {
              const id = next[Math.min(selectedIndex, next.length - 1)]?.id || null;
              focusRequest.current = id;
              setSelectedId(id);
            }
          }
        }
      ]
    : [];

  return (
    <CameraPanel className="interaction-camera-tour">
      <CameraPanelHeader
        id={panelId}
        title={message('animation', 'Camera animation')}
        enableLabel={message('enableAnimation', 'Enable camera animation')}
        open={open}
        enabled={enabled}
        onToggleOpen={() => setOpen(!open)}
        onToggleEnabled={
          uiStateActions
            ? () => {
                playback.pause();
                uiStateActions.setMapControlVisibility('cameraTour', !enabled);
              }
            : undefined
        }
        Icon={Play}
      />
      {open && (
        <PanelContent id={`${panelId}-content`}>
          {!supported ? (
            <p>{message('singleMap', 'Use a single 2D or 3D map to edit camera views.')}</p>
          ) : (
            <>
              <Hint>{message('animationHint', 'Animate the map between saved views.')}</Hint>
              <Actions>
                <AddStopAnchor>
                  <Button
                    type="button"
                    secondary
                    small
                    ref={addButton}
                    disabled={sources.every(source => source.disabled)}
                    aria-haspopup={bookmarks.length ? 'menu' : undefined}
                    aria-expanded={bookmarks.length ? sourceMenuOpen : undefined}
                    aria-controls={sourceMenuOpen ? `${panelId}-sources` : undefined}
                    onClick={() => {
                      if (bookmarks.length) setSourceMenuOpen(!sourceMenuOpen);
                      else add(readCamera());
                    }}
                    onKeyDown={event => {
                      if (bookmarks.length && event.key === 'ArrowDown') {
                        event.preventDefault();
                        setSourceMenuOpen(true);
                      }
                    }}
                  >
                    <Add height="12px" aria-hidden="true" />
                    {message('addStop', 'Add stop')}
                  </Button>
                  <Portaled
                    component={MenuAnchor}
                    isOpened={sourceMenuOpen && bookmarks.length > 0}
                    left={0}
                    top={0}
                    onClose={closeSourceMenu}
                  >
                    <StopSourceMenu
                      id={`${panelId}-sources`}
                      label={message('addStop', 'Add stop')}
                      sources={sources}
                      onClose={closeSourceMenu}
                      onSelect={source => {
                        closeSourceMenu();
                        if (source.bookmarkId !== undefined) {
                          const bookmark = bookmarks.find(item => item.id === source.bookmarkId);
                          if (bookmark) add(getCameraSnapshot(bookmark.camera), bookmark.name);
                        } else add(readCamera());
                      }}
                    />
                  </Portaled>
                </AddStopAnchor>
              </Actions>
              <DndContext
                id={panelId}
                sensors={sensors}
                accessibility={{screenReaderInstructions: {draggable: ''}}}
                modifiers={TRACK_MODIFIERS}
                collisionDetection={args => timelineCollision(args, stops, dragOriginX.current)}
                onDragStart={({activatorEvent}) => {
                  playback.pause();
                  dragStops.current = stops;
                  dragOriginX.current = (activatorEvent as PointerEvent).clientX;
                  if (selected) setSelectedId(selected.id);
                }}
                onDragCancel={() => {
                  dragStops.current = null;
                }}
                onDragEnd={({active, over}) => {
                  const unchanged = dragStops.current === stops;
                  dragStops.current = null;
                  if (!unchanged || !over || active.id === over.id) return;
                  const from = stops.findIndex(stop => stop.id === active.id);
                  const to = stops.findIndex(stop => stop.id === over.id);
                  if (from >= 0 && to >= 0) commit(arrayMove(stops, from, to));
                }}
              >
                <TrackViewport hidden={!stops.length}>
                  <StopTrack role="group" aria-label={message('stopTrack', 'Animation stops')}>
                    {stops.map((stop, index) => (
                      <DraggableStopMarker
                        key={stop.id}
                        stop={stop}
                        index={index}
                        position={percent(starts[index])}
                        selected={selected?.id === stop.id}
                        current={currentIndex === index}
                        panelId={panelId}
                        onSelect={() => select(index)}
                        onMoveFocus={key => {
                          const next =
                            key === 'Home'
                              ? 0
                              : key === 'End'
                              ? stops.length - 1
                              : Math.max(
                                  0,
                                  Math.min(stops.length - 1, index + (key === 'ArrowLeft' ? -1 : 1))
                                );
                          select(next);
                          markerRefs.current.get(stops[next].id)?.focus();
                        }}
                        markerRef={node => {
                          if (node) markerRefs.current.set(stop.id, node);
                          else markerRefs.current.delete(stop.id);
                        }}
                      />
                    ))}
                    {stops.flatMap((stop, index) =>
                      (['holdDurationMs', 'travelDurationMs'] as const).map(field => {
                        if (field === 'travelDurationMs' && index === stops.length - 1) return null;
                        const travel = field === 'travelDurationMs';
                        const label = `${message('stop', 'Stop')} ${index + 1}: ${stop.name} — ${
                          travel
                            ? message('travelSegment', 'Travel')
                            : message('holdSegment', 'Hold')
                        }: ${seconds(stop[field])}`;
                        return (
                          <TimeSegment
                            key={`${stop.id}-${field}`}
                            type="button"
                            tabIndex={stop[field] > 0 ? 0 : -1}
                            $travel={travel}
                            $selected={selected?.id === stop.id}
                            data-timing-stop-id={stop.id}
                            data-timing-field={field}
                            aria-label={label}
                            title={label}
                            aria-controls={`${panelId}-${field}`}
                            style={{
                              left: `${percent(
                                starts[index] + (travel ? stop.holdDurationMs : 0)
                              )}%`,
                              width: `${percent(stop[field])}%`
                            }}
                            onClick={() => focusTiming(stop, field)}
                          >
                            {seconds(stop[field])}
                          </TimeSegment>
                        );
                      })
                    )}
                  </StopTrack>
                </TrackViewport>
              </DndContext>
              {selected && (
                <>
                  <StopEditor
                    id={`${panelId}-selected-stop`}
                    role="group"
                    aria-labelledby={`${panelId}-${selected.id}`}
                  >
                    <StopHeading>
                      <StopName
                        aria-label={message('stopName', 'Stop name')}
                        title={selected.name}
                        value={selected.name}
                        onChange={event => update(selected.id, {name: event.target.value})}
                      />
                      <StopActions>
                        {stopActions.map(({key, label, Icon, disabled, onClick}) => (
                          <StopActionButton
                            key={key}
                            type="button"
                            aria-label={label}
                            title={label}
                            disabled={disabled}
                            onClick={onClick}
                          >
                            <PanelHeaderAction
                              id={`${panelId}-${key}`}
                              tooltip={`camera.${key}`}
                              flush
                              disabled={disabled}
                              IconComponent={Icon}
                            />
                          </StopActionButton>
                        ))}
                      </StopActions>
                    </StopHeading>
                    <Timing>
                      {(['holdDurationMs', 'travelDurationMs'] as const).map(key =>
                        key === 'travelDurationMs' && selectedIndex === stops.length - 1 ? (
                          <EndOfTour key={key}>
                            {message('travel', 'Travel to next (s)')}
                            <span>{message('endOfTour', 'End of tour')}</span>
                          </EndOfTour>
                        ) : (
                          <PanelLabel key={key}>
                            {key === 'holdDurationMs'
                              ? message('hold', 'Hold (s)')
                              : message('travel', 'Travel to next (s)')}
                            <Input
                              id={`${panelId}-${key}`}
                              ref={node => {
                                if (node) timingInputs.current[key] = node;
                                else delete timingInputs.current[key];
                              }}
                              type="number"
                              min={0}
                              step={0.1}
                              value={selected[key] / 1000}
                              onChange={event => {
                                const secondsValue = event.target.valueAsNumber;
                                if (
                                  Number.isFinite(secondsValue) &&
                                  secondsValue >= 0 &&
                                  secondsValue * 1000 <= Number.MAX_SAFE_INTEGER
                                )
                                  update(selected.id, {[key]: secondsValue * 1000});
                              }}
                            />
                          </PanelLabel>
                        )
                      )}
                    </Timing>
                  </StopEditor>
                  <Timeline>
                    <StopActionButton
                      type="button"
                      aria-label={
                        playback.playing ? message('pause', 'Pause') : message('play', 'Play')
                      }
                      title={playback.playing ? message('pause', 'Pause') : message('play', 'Play')}
                      disabled={!enabled || !playback.duration || !mapStateActions}
                      onClick={playback.playing ? playback.pause : playback.play}
                    >
                      {playback.playing ? <Pause height="16px" /> : <Play height="16px" />}
                    </StopActionButton>
                    <StopActionButton
                      type="button"
                      aria-label={message('restart', 'Restart')}
                      title={message('restart', 'Restart')}
                      disabled={!enabled || !mapStateActions}
                      onClick={() => playback.seek(0)}
                    >
                      <Reset height="14px" />
                    </StopActionButton>
                    <Scrubber
                      $progress={
                        playback.duration ? (playback.elapsed / playback.duration) * 100 : 0
                      }
                      type="range"
                      min={0}
                      max={playback.duration}
                      step="any"
                      value={playback.elapsed}
                      disabled={!enabled || !playback.duration || !mapStateActions}
                      aria-label={message('scrub', 'Camera tour time')}
                      aria-valuetext={seconds(playback.elapsed)}
                      onChange={event => playback.seek(Number(event.target.value))}
                    />
                    <TimeReadout $elapsedWidth={seconds(playback.duration).length + 3}>
                      <output aria-label={message('elapsed', 'Elapsed time')}>
                        {seconds(playback.elapsed)}
                      </output>{' '}
                      /{' '}
                      <output aria-label={message('duration', 'Tour duration')}>
                        {seconds(playback.duration)}
                      </output>
                    </TimeReadout>
                  </Timeline>
                </>
              )}
            </>
          )}
        </PanelContent>
      )}
    </CameraPanel>
  );
}
