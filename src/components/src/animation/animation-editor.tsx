// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useId, useMemo, useRef, useState} from 'react';
import styled, {useTheme} from 'styled-components';
import type {
  Annotation,
  AnnotationPropsPartial,
  CameraTour,
  CameraSnapshot,
  Effect,
  EffectParameterAnimation,
  EffectUpdateProps,
  LayerAnimatableProp,
  LayerPropertyTransition,
  RGBColor
} from '@kepler.gl/types';
import type {Layer} from '@kepler.gl/layers';
import {
  getCameraTourDuration,
  normalizeCameraTour,
  DEFAULT_LAYER_ANIMATABLE_PROPS,
  getLayerAnimationTracks,
  getLayerPropertyTransitions,
  isRgbColor,
  normalizeLayerPropertyTransitions,
  roundValToStep,
  rgbToHex
} from '@kepler.gl/utils';
import {getAnimatableEffectParameters} from '@kepler.gl/effects';
import {Button, Input, PanelLabel} from '../common/styled-components';
import {Add, ArrowDownSmall, Close, Pause, Play, Reset, Trash, ZoomOut} from '../common/icons';
import Switch from '../common/switch';
import Portaled from '../common/portaled';
import RangeSliderFactory from '../common/range-slider';
import useOnClickOutside from '../hooks/use-on-click-outside';
import {CameraTourActionButton} from '../side-panel/interaction-panel/camera-tour-playback-controls';
import EffectAnimationControl from '../effects/effect-animation-control';
import AnimationBlock from './animation-block';
import CameraAnimationTrack, {CameraSegment, getCameraSegments} from './camera-animation-track';
import CompactColorPicker, {StyledPanelDropdown} from '../effects/compact-color-picker';
import {getEffectAnimationTracks} from '../modals/effect-animation';

export type AnimationEditorPlayback = {
  elapsed: number;
  duration: number;
  running: boolean;
  run: () => void;
  pause: () => void;
  seek: (time: number, camera?: CameraSnapshot) => void;
  stop: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  loop: boolean;
  setLoop: (loop: boolean) => void;
};

export type AnimationEditorProps = {
  effects: Effect[];
  tour?: CameraTour | null;
  cameraEnabled?: boolean;
  layers?: readonly Layer[];
  annotations?: readonly Annotation[];
  playback: AnimationEditorPlayback;
  updateEffectConfig: (
    event: Event | null | undefined,
    id: string,
    props: Partial<EffectUpdateProps>
  ) => void;
  onLayerConfigChange?: (layer: Layer, config: Partial<Layer['config']>) => void;
  onAnnotationChange?: (id: string, props: AnnotationPropsPartial) => void;
  onCameraTourChange?: (tour: CameraTour) => void;
  onEditCamera?: (stopId?: string) => void;
};

type Selection =
  | {kind: 'camera'; stopId: string; field: CameraSegment['field']}
  | {kind: 'effect'; effectId: string; name: string; blockId: string}
  | {kind: 'layer'; layerId: string; propertyName: string; transitionId: string}
  | {kind: 'annotation'; annotationId: string; transitionId: string};

type AddTarget = {kind: 'layer' | 'annotation' | 'effect'; id: string};

const Editor = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  flex: 1;
  color: ${props => props.theme.textColor};
  background: ${props => props.theme.mapPanelBackgroundColor};
  font-size: 11px;
`;
const Toolbar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 32px;
  padding: 4px 8px;
  box-sizing: border-box;
  flex-shrink: 0;
  border-bottom: 1px solid ${props => props.theme.panelBorderColor};
  ${Input} {
    width: 48px;
    height: 24px;
    padding: 2px 4px;
    font-size: 11px;
  }
  ${PanelLabel} {
    margin: 0;
    font-size: 10px;
  }
`;
const ToolbarButton = styled(Button).attrs({link: true})`
  padding: 3px 6px;
  min-height: 24px;
  font-size: 11px;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  white-space: nowrap;
`;
const Divider = styled.span`
  height: 16px;
  width: 1px;
  margin: 0 4px;
  background: ${props => props.theme.panelBorderColor};
`;
const Readout = styled.output<{$elapsedWidth: number}>`
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
  margin: 0 4px;
  color: ${props => props.theme.subtextColor};
  span {
    display: inline-block;
    width: ${props => props.$elapsedWidth}ch;
    text-align: right;
  }
`;
const Spacer = styled.div`
  flex: 1;
`;
const Workspace = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;
const Timeline = styled.div`
  flex: 1;
  min-width: 0;
  overflow: auto;
  ${props => props.theme.sidePanelScrollBar};
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 136px minmax(120px, 1fr);
  min-height: 32px;
  border-bottom: 1px solid ${props => props.theme.panelBorderColor};
`;
const RulerRow = styled(Row)`
  position: sticky;
  top: 0;
  z-index: 3;
  min-height: 24px;
  height: 24px;
  background: ${props => props.theme.mapPanelBackgroundColor};
`;
const RowLabel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  min-width: 0;
  padding: 2px 8px;
  line-height: 12px;
  border-right: 1px solid ${props => props.theme.panelBorderColor};
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  small {
    color: ${props => props.theme.subtextColor};
    font-size: 10px;
    line-height: 11px;
  }
`;
const Track = styled.div<{$grid: number}>`
  position: relative;
  min-width: 0;
  // Keep end handles, their focus rings, and the playhead inside the timeline.
  margin-right: 12px;
  min-height: 32px;
  background-image: linear-gradient(
    to right,
    ${props => props.theme.panelBorderColor} 1px,
    transparent 1px
  );
  background-size: ${props => props.$grid}% 100%;
`;
const Ruler = styled(Track)`
  min-height: 24px;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  outline: none;
  &:focus-visible {
    box-shadow: inset 0 0 0 2px ${props => props.theme.activeColor};
  }
`;
const Tick = styled.span<{$position: number}>`
  position: absolute;
  left: ${props => props.$position}%;
  transform: translateX(-${props => props.$position}%);
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  top: 5px;
  padding-left: 5px;
  color: ${props => props.theme.subtextColor};
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
`;
const Cursor = styled.div<{$position: number}>`
  pointer-events: none;
  position: absolute;
  left: ${props => props.$position}%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: ${props => props.theme.textColorHl};
  z-index: 2;
`;
const Playhead = styled(Cursor)`
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -4px;
    width: 9px;
    height: 6px;
    background: ${props => props.theme.textColorHl};
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }
`;
const PopupAnchor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
`;
const SettingsPopup = styled(StyledPanelDropdown)`
  width: 288px;
  max-height: min(500px, calc(100vh - 80px));
  border: 1px solid ${props => props.theme.panelBorderColor};
  color: ${props => props.theme.textColor};
  font-size: ${props => props.theme.inputFontSize};
  text-transform: none;
`;
const InspectorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px;
  background: ${props => props.theme.panelBackgroundHover};
  border-bottom: 1px solid ${props => props.theme.panelBorderColor};
  font-weight: 500;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const InspectorHeaderActions = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 4px;
`;
const InspectorIconButton = styled(Button).attrs({link: true})`
  padding: 0;
  width: 20px;
  height: 20px;
  background: transparent;
  color: ${props => props.theme.panelHeaderIcon};
  border: none;
  &:hover,
  &:focus-visible {
    color: ${props => props.theme.panelHeaderIconHover};
  }
  & > svg {
    margin: 0;
  }
`;
const InspectorBody = styled.div`
  padding: 14px;
`;
const Fields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 8px;
  margin-bottom: 12px;
  ${Input} {
    width: 100%;
    height: 32px;
    padding: 3px 6px;
    font-size: ${props => props.theme.sliderInputFontSize};
    border-color: ${props => props.theme.panelBorderColor};
    text-align: center;
    text-overflow: clip;
  }
`;
const InspectorActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 8px;
`;
const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  ${PanelLabel} {
    margin: 0;
  }
`;
const Alert = styled.div`
  margin-top: 8px;
  font-size: 11px;
  color: ${props => props.theme.textColor};
`;
const Empty = styled.div`
  padding: 24px 12px;
  text-align: center;
  color: ${props => props.theme.subtextColor};
`;
const Menu = styled.div`
  position: absolute;
  top: 100%;
  right: 8px;
  z-index: 5;
  min-width: 220px;
  max-width: 320px;
  max-height: 260px;
  overflow: auto;
  padding: 6px;
  background: ${props => props.theme.panelBackground};
  border: 1px solid ${props => props.theme.panelBorderColor};
  border-radius: 4px;
  box-shadow: ${props => props.theme.panelBoxShadow};
  ${ToolbarButton} {
    width: 100%;
    text-align: left;
    justify-content: flex-start;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    &:hover {
      background: ${props => props.theme.panelBackgroundHover};
    }
  }
`;
const MenuHeading = styled.div`
  padding: 6px;
  color: ${props => props.theme.subtextColor};
  font-size: 10px;
`;

const title = (value: string) =>
  value.replace(/([a-z\d])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase());
const seconds = (value: number) => `${Math.round(value / 10) / 100} s`;
const formatTimeInput = (value: string) =>
  value.trim() ? String(roundValToStep(0, 0.01, Number(value))) : value;
const formatPropertyValue = (value: number | RGBColor, property: LayerAnimatableProp) =>
  Array.isArray(value)
    ? rgbToHex(value)
    : property.name === 'opacity'
    ? `${Math.round(value * 100)}%`
    : String(value);

function emptyTrackInterval(
  event: React.MouseEvent<HTMLDivElement>,
  duration: number,
  blocks: {startTimeMs: number; endTimeMs: number}[]
) {
  if (event.target !== event.currentTarget || event.button !== 0) return null;
  const rect = event.currentTarget.getBoundingClientRect();
  if (!(rect.width > 0) || !Number.isFinite(event.clientX)) return null;
  const startTimeMs = roundValToStep(0, 10, ((event.clientX - rect.left) / rect.width) * duration);
  if (
    startTimeMs < 0 ||
    startTimeMs >= duration ||
    blocks.some(
      block =>
        startTimeMs === block.startTimeMs ||
        (startTimeMs > block.startTimeMs && startTimeMs < block.endTimeMs)
    )
  )
    return null;
  const next = blocks.find(block => block.startTimeMs > startTimeMs);
  event.preventDefault();
  return {
    startTimeMs,
    endTimeMs: Math.min(startTimeMs + 1000, next?.startTimeMs ?? duration, duration)
  };
}

function nextBlockId(name: string, blocks: {id?: string}[]) {
  let suffix = 1;
  while (blocks.some(block => block.id === `${name}-${suffix}`)) suffix++;
  return `${name}-${suffix}`;
}

function PropertySettings({
  label,
  property,
  transition,
  transitions,
  onSave,
  onRemove,
  onClose
}: {
  label: string;
  property: LayerAnimatableProp;
  transition: LayerPropertyTransition;
  transitions: LayerPropertyTransition[];
  onSave: (transition: LayerPropertyTransition) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const id = useId();
  const opacity = property.name === 'opacity';
  const multiplier = opacity ? 100 : 1;
  const numericProperty = property.type === 'color' ? null : property;
  const [minValue, maxValue] = numericProperty?.range.map(value => value * multiplier) ?? [0, 0];
  const [draft, setDraft] = useState({
    start: String(transition.startTimeMs / 1000),
    end: String(transition.endTimeMs / 1000),
    startValue:
      typeof transition.startValue === 'number' ? String(transition.startValue * multiplier) : '',
    endValue:
      typeof transition.endValue === 'number' ? String(transition.endValue * multiplier) : ''
  });
  const [colors, setColors] = useState<{startValue: RGBColor; endValue: RGBColor} | null>(() =>
    Array.isArray(transition.startValue) && Array.isArray(transition.endValue)
      ? {startValue: [...transition.startValue], endValue: [...transition.endValue]}
      : null
  );
  const [linear, setLinear] = useState(transition.easing === 'linear');
  useEffect(() => {
    setDraft(previous => ({
      ...previous,
      start: String(transition.startTimeMs / 1000),
      end: String(transition.endTimeMs / 1000)
    }));
  }, [transition.startTimeMs, transition.endTimeMs]);
  const timing: Pick<LayerPropertyTransition, 'id' | 'startTimeMs' | 'endTimeMs' | 'easing'> = {
    id: transition.id,
    startTimeMs: draft.start.trim() ? Number(draft.start) * 1000 : NaN,
    endTimeMs: draft.end.trim() ? Number(draft.end) * 1000 : NaN,
    easing: linear ? 'linear' : 'easeInOut'
  };
  const candidate: LayerPropertyTransition =
    property.type === 'color' && colors
      ? {...timing, startValue: [...colors.startValue], endValue: [...colors.endValue]}
      : {
          ...timing,
          startValue: draft.startValue.trim() ? Number(draft.startValue) / multiplier : NaN,
          endValue: draft.endValue.trim() ? Number(draft.endValue) / multiplier : NaN
        };
  const validValues =
    getLayerPropertyTransitions(
      {propertyTransitions: {[property.name]: [candidate]}},
      property.name,
      property
    ).length === 1;
  const valid =
    validValues &&
    getLayerPropertyTransitions(
      {
        propertyTransitions: {
          [property.name]: transitions.map(item => (item.id === transition.id ? candidate : item))
        }
      },
      property.name,
      property
    ).length === transitions.length;
  return (
    <div role="group" aria-label={`${property.label} settings for ${label}`}>
      <InspectorHeader>
        <span title={`${label} · ${property.label}`}>
          {label} · {property.label}
        </span>
        <InspectorHeaderActions>
          <InspectorIconButton
            type="button"
            aria-label="Remove animation"
            title="Remove animation"
            onClick={onRemove}
          >
            <Trash height="16px" />
          </InspectorIconButton>
          <InspectorIconButton type="button" aria-label="Close block settings" onClick={onClose}>
            <Close height="14px" />
          </InspectorIconButton>
        </InspectorHeaderActions>
      </InspectorHeader>
      <InspectorBody>
        <Fields>
          {property.type === 'color' &&
            colors &&
            (['startValue', 'endValue'] as const).map(key => (
              <CompactColorPicker
                key={key}
                label={key === 'startValue' ? 'Start color' : 'End color'}
                color={colors[key]}
                onSetColor={value => setColors({...colors, [key]: [...value]})}
                Icon={ArrowDownSmall}
              />
            ))}
          {[
            ...(numericProperty
              ? [
                  {
                    key: 'startValue',
                    label: opacity ? 'Start opacity (%)' : `Start ${property.label.toLowerCase()}`,
                    min: minValue,
                    max: maxValue,
                    step: numericProperty.step * multiplier
                  },
                  {
                    key: 'endValue',
                    label: opacity ? 'End opacity (%)' : `End ${property.label.toLowerCase()}`,
                    min: minValue,
                    max: maxValue,
                    step: numericProperty.step * multiplier
                  }
                ]
              : []),
            {key: 'start', label: 'Start time (seconds)', min: 0, max: undefined, step: 0.01},
            {key: 'end', label: 'End time (seconds)', min: 0, max: undefined, step: 0.01}
          ].map(({key, label, min, max, step}) => (
            <div key={key}>
              <PanelLabel htmlFor={`${id}-${key}`}>{label}</PanelLabel>
              <Input
                secondary
                id={`${id}-${key}`}
                type="number"
                min={min}
                max={max}
                step={step}
                // Keep saved precision until this time field is edited.
                value={key === 'start' || key === 'end' ? formatTimeInput(draft[key]) : draft[key]}
                onChange={event =>
                  setDraft({
                    ...draft,
                    [key]:
                      key === 'start' || key === 'end'
                        ? formatTimeInput(event.target.value)
                        : event.target.value
                  })
                }
              />
            </div>
          ))}
        </Fields>
        <ToggleRow>
          <PanelLabel as="label" htmlFor={`${id}-linear`}>
            Linear easing
          </PanelLabel>
          <Switch
            id={`${id}-linear`}
            checked={linear}
            onChange={event => setLinear(event.target.checked)}
          />
        </ToggleRow>
        {!valid && (
          <Alert role="alert">
            {validValues
              ? `${property.label} blocks on this item cannot overlap.`
              : property.type === 'color'
              ? 'Choose valid colors and non-negative times, with End at or after Start.'
              : `Use ${minValue}–${maxValue}${
                  opacity ? '%' : ''
                } values and non-negative times, with End at or after Start.`}
          </Alert>
        )}
        <InspectorActions>
          <Button
            type="button"
            secondary
            disabled={!valid}
            onClick={() => {
              if (valid) onSave(candidate);
            }}
          >
            Save
          </Button>
        </InspectorActions>
      </InspectorBody>
    </div>
  );
}

function CameraSettings({
  segment,
  maxDurationMs,
  onSave,
  onClose,
  onEditCamera,
  onSwitch
}: {
  segment: CameraSegment;
  maxDurationMs: number;
  onSave?: (duration: number) => void;
  onClose: () => void;
  onEditCamera?: () => void;
  onSwitch?: () => void;
}) {
  const id = useId();
  const savedDuration = segment.stop[segment.field];
  const [value, setValue] = useState(String(savedDuration / 1000));
  useEffect(() => setValue(String(savedDuration / 1000)), [savedDuration]);
  const duration = Number(value) * 1000;
  const valid =
    value.trim() !== '' && Number.isFinite(duration) && duration >= 0 && duration <= maxDurationMs;
  return (
    <>
      <InspectorHeader>
        <span title={segment.label}>{segment.label}</span>
        <InspectorIconButton type="button" aria-label="Close camera settings" onClick={onClose}>
          <Close height="14px" />
        </InspectorIconButton>
      </InspectorHeader>
      <InspectorBody>
        <Fields>
          <div>
            <PanelLabel htmlFor={id}>Duration (seconds)</PanelLabel>
            <Input
              secondary
              id={id}
              type="number"
              min={0}
              step={0.01}
              disabled={!onSave}
              value={formatTimeInput(value)}
              onChange={event => setValue(formatTimeInput(event.target.value))}
            />
          </div>
          <div>
            <PanelLabel>Start → End</PanelLabel>
            <output aria-label="Camera interval">
              {seconds(segment.startTimeMs)} →{' '}
              {valid ? seconds(segment.startTimeMs + duration) : '—'}
            </output>
          </div>
        </Fields>
        {!valid && (
          <Alert role="alert">Enter a non-negative duration within the route limit.</Alert>
        )}
        {onSwitch && (
          <Button type="button" link onClick={onSwitch}>
            {segment.field === 'holdDurationMs' ? 'Edit move duration' : 'Edit hold duration'}
          </Button>
        )}
        {onEditCamera && (
          <Button type="button" link onClick={onEditCamera}>
            Edit camera stop
          </Button>
        )}
        <InspectorActions>
          <Button type="button" link onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            secondary
            disabled={!valid || !onSave}
            onClick={() => onSave?.(duration)}
          >
            Save
          </Button>
        </InspectorActions>
      </InspectorBody>
    </>
  );
}

AnimationEditorFactory.deps = [RangeSliderFactory];
export default function AnimationEditorFactory(RangeSlider: ReturnType<typeof RangeSliderFactory>) {
  return function AnimationEditor({
    effects,
    tour,
    cameraEnabled = true,
    layers = [],
    annotations = [],
    playback,
    updateEffectConfig,
    onLayerConfigChange,
    onAnnotationChange,
    onCameraTourChange,
    onEditCamera
  }: AnimationEditorProps) {
    const theme = useTheme();
    const id = useId();
    const editor = useRef<HTMLElement>(null);
    const addButton = useRef<HTMLButtonElement>(null);
    const scrubPointer = useRef<number | null>(null);
    const suppressRulerClick = useRef(false);
    const [adding, setAdding] = useState(false);
    const [addTarget, setAddTarget] = useState<AddTarget | null>(null);
    const [selected, setSelected] = useState<Selection | null>(null);
    const [popup, setPopup] = useState<{left: number; top: number} | null>(null);
    const [confirmRemoval, setConfirmRemoval] = useState(false);
    const addMenu = useOnClickOutside<HTMLDivElement>(event => {
      // The trigger handles its own toggle, including clicks on its icon.
      if (addButton.current?.contains(event.target)) return;
      setAdding(false);
      setAddTarget(null);
    }, !adding);
    useEffect(() => {
      if (adding) {
        const firstItem = addMenu.current?.querySelector<HTMLElement>('[role="menuitem"]');
        (firstItem ?? addMenu.current)?.focus();
      }
    }, [adding, addTarget]);
    const cameraTour = useMemo(() => normalizeCameraTour(tour), [tour]);
    const cameraSegments = cameraTour ? getCameraSegments(cameraTour) : [];
    const cameraDuration = getCameraTourDuration(cameraTour);
    const tracks = getEffectAnimationTracks(effects);
    const rows = tracks.flatMap(track =>
      [...new Set(track.parameters.map(parameter => parameter.name))].map(name => ({
        effect: track.effect,
        parameter: track.parameters.find(parameter => parameter.name === name)!,
        parameters: track.parameters.filter(parameter => parameter.name === name)
      }))
    );
    const layerTracks = layers
      .flatMap(layer => getLayerAnimationTracks(layer).map(track => ({layer, ...track})))
      .filter(track => track.transitions.length);
    const annotationTracks = annotations.map((annotation, index) => ({
      annotation,
      label: annotation.label?.trim() || `Annotation ${index + 1}`,
      transitions: getLayerPropertyTransitions(annotation, 'opacity')
    }));
    const configuredDuration = Math.max(
      playback.duration,
      cameraDuration,
      ...rows.flatMap(row => row.parameters.map(parameter => parameter.endTimeMs)),
      ...layerTracks.flatMap(track => track.transitions.map(transition => transition.endTimeMs)),
      ...annotationTracks.flatMap(track =>
        track.transitions.map(transition => transition.endTimeMs)
      )
    );
    const [duration, setDuration] = useState(configuredDuration || 10000);
    useEffect(() => {
      setDuration(previous => Math.max(previous, configuredDuration));
    }, [configuredDuration]);
    const unit = 10 ** Math.floor(Math.log10(Math.max(1, duration / 6)));
    const step = ([1, 2, 5, 10].find(value => value * unit >= duration / 6) ?? 10) * unit;
    const ticks = Array.from({length: Math.ceil(duration / step)}, (_, index) => index * step);
    const percent = (time: number) => Math.max(0, Math.min(100, (time / duration) * 100));
    const seekOnRuler = (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (!(rect.width > 0) || !Number.isFinite(event.clientX)) return false;
      playback.seek(
        Math.max(
          0,
          Math.min(playback.duration, ((event.clientX - rect.left) / rect.width) * duration)
        )
      );
      return true;
    };
    const endScrub = (event: React.PointerEvent<HTMLDivElement>) => {
      if (scrubPointer.current !== event.pointerId) return;
      scrubPointer.current = null;
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    };
    const selectedCameraSegment =
      selected?.kind === 'camera'
        ? cameraSegments.find(
            segment => segment.stop.id === selected.stopId && segment.field === selected.field
          )
        : undefined;
    const saveCameraDuration = (segment: CameraSegment, nextDuration: number) => {
      if (
        !cameraTour ||
        !onCameraTourChange ||
        cameraTour.stops.find(stop => stop.id === segment.stop.id)?.[segment.field] === nextDuration
      )
        return;
      const next = normalizeCameraTour({
        stops: cameraTour.stops.map(stop =>
          stop.id === segment.stop.id ? {...stop, [segment.field]: nextDuration} : stop
        )
      });
      if (next && next.stops.length === cameraTour.stops.length) {
        playback.pause();
        onCameraTourChange(next);
      }
    };
    const selectedEffect =
      selected?.kind === 'effect'
        ? effects.find(effect => effect.id === selected.effectId)
        : undefined;
    const selectedLayerTrack =
      selected?.kind === 'layer'
        ? layerTracks.find(
            track =>
              track.layer.id === selected.layerId && track.property.name === selected.propertyName
          )
        : undefined;
    const selectedAnnotationTrack =
      selected?.kind === 'annotation'
        ? annotationTracks.find(track => track.annotation.id === selected.annotationId)
        : undefined;
    const selectedTransitions =
      selectedLayerTrack?.transitions ?? selectedAnnotationTrack?.transitions;
    const selectedTransition =
      selected?.kind === 'layer' || selected?.kind === 'annotation'
        ? selectedTransitions?.find(transition => transition.id === selected.transitionId)
        : undefined;
    const select = (selection: Selection) => {
      setAdding(false);
      setAddTarget(null);
      setSelected(selection);
      setPopup(null);
      setConfirmRemoval(false);
    };
    const openSettings = (selection: Selection, anchor: HTMLElement, left?: number) => {
      const rect = anchor.getBoundingClientRect();
      const origin = editor.current?.getBoundingClientRect();
      playback.pause();
      select(selection);
      setPopup({
        left: (left ?? rect.left) - (origin?.left ?? 0),
        top: rect.bottom - (origin?.top ?? 0) + 4
      });
    };
    const requestRemoval = (selection: Selection, anchor: HTMLElement) => {
      openSettings(selection, anchor);
      setConfirmRemoval(true);
    };
    const saveLayerTransitions = (
      layer: Layer,
      property: LayerAnimatableProp,
      transitions: LayerPropertyTransition[]
    ) => {
      const normalized = normalizeLayerPropertyTransitions({[property.name]: transitions});
      if (normalized) {
        playback.pause();
        onLayerConfigChange?.(layer, {
          propertyTransitions: {...layer.config.propertyTransitions, ...normalized}
        });
      }
    };
    const saveAnnotationTransitions = (
      annotation: Annotation,
      transitions: LayerPropertyTransition[]
    ) => {
      const normalized = normalizeLayerPropertyTransitions({opacity: transitions});
      if (normalized) {
        playback.pause();
        onAnnotationChange?.(annotation.id, {
          propertyTransitions: {...annotation.propertyTransitions, ...normalized}
        });
      }
    };
    const saveSelectedTransitions = (transitions: LayerPropertyTransition[]) => {
      if (selectedLayerTrack)
        saveLayerTransitions(selectedLayerTrack.layer, selectedLayerTrack.property, transitions);
      else if (selectedAnnotationTrack)
        saveAnnotationTransitions(selectedAnnotationTrack.annotation, transitions);
    };
    const removeSelected = () => {
      if (selectedEffect && selected?.kind === 'effect') {
        const animation = {...selectedEffect.animation};
        const remaining = (animation[selected.name] ?? []).filter(
          block => block.id !== selected.blockId
        );
        if (remaining.length) animation[selected.name] = remaining;
        else delete animation[selected.name];
        updateEffectConfig(null, selectedEffect.id, {
          animation
        });
      } else if (selectedTransitions && selectedTransition) {
        saveSelectedTransitions(
          selectedTransitions.filter(item => item.id !== selectedTransition.id)
        );
      }
      setSelected(null);
      setPopup(null);
      setConfirmRemoval(false);
    };
    const effectChoices = effects.flatMap(effect =>
      getAnimatableEffectParameters(effect)
        .filter(
          parameter =>
            !Object.prototype.hasOwnProperty.call(effect.animation ?? {}, parameter.name) &&
            !rows.some(row => row.effect.id === effect.id && row.parameter.name === parameter.name)
        )
        .map(parameter => ({effect, parameter}))
    );
    const addLayer =
      addTarget?.kind === 'layer' ? layers.find(layer => layer.id === addTarget.id) : undefined;
    const addAnnotation =
      addTarget?.kind === 'annotation'
        ? annotationTracks.find(track => track.annotation.id === addTarget.id)
        : undefined;
    const addEffect =
      addTarget?.kind === 'effect' ? effects.find(effect => effect.id === addTarget.id) : undefined;
    const propertyBlockAt = (
      event: React.MouseEvent<HTMLDivElement>,
      property: LayerAnimatableProp,
      transitions: LayerPropertyTransition[]
    ): LayerPropertyTransition | null => {
      const timing = emptyTrackInterval(event, duration, transitions);
      if (!timing) return null;
      const previous = transitions.filter(block => block.endTimeMs <= timing.startTimeMs).at(-1);
      const value = previous?.endValue ?? transitions[0].startValue;
      const common = {
        ...timing,
        id: nextBlockId(property.name, transitions),
        easing: 'linear' as const
      };
      return Array.isArray(value)
        ? {...common, startValue: [...value], endValue: [...value]}
        : {...common, startValue: value, endValue: value};
    };
    const addEffectAt = (
      event: React.MouseEvent<HTMLDivElement>,
      effect: Effect,
      parameters: (typeof rows)[number]['parameters']
    ) => {
      const name = parameters[0].name;
      const blocks = parameters.map(parameter => ({
        id: parameter.id,
        startTimeMs: parameter.startTimeMs,
        endTimeMs: parameter.endTimeMs,
        startValue: Array.isArray(parameter.start) ? [...parameter.start] : parameter.start,
        endValue: Array.isArray(parameter.end) ? [...parameter.end] : parameter.end,
        easing: parameter.easing
      }));
      const timing = emptyTrackInterval(event, duration, blocks);
      if (!timing) return;
      const previous = blocks.filter(block => block.endTimeMs <= timing.startTimeMs).at(-1);
      const value = previous?.endValue ?? blocks[0].startValue;
      const block: EffectParameterAnimation = {
        ...timing,
        id: nextBlockId(name, blocks),
        startValue: Array.isArray(value) ? [...value] : value,
        endValue: Array.isArray(value) ? [...value] : value,
        easing: 'linear'
      };
      playback.pause();
      updateEffectConfig(null, effect.id, {
        animation: {
          ...effect.animation,
          [name]: [...blocks, block].sort((a, b) => a.startTimeMs - b.startTimeMs)
        }
      });
      openSettings(
        {kind: 'effect', effectId: effect.id, name, blockId: block.id},
        event.currentTarget,
        event.clientX
      );
    };
    const addProperty = (property: LayerAnimatableProp, anchor: HTMLElement) => {
      if (!addLayer && !addAnnotation) return;
      const transitions = addLayer
        ? getLayerPropertyTransitions(addLayer.config, property.name, property)
        : addAnnotation!.transitions;
      const last = transitions[transitions.length - 1];
      const startTimeMs = Math.max(playback.elapsed, last?.endTimeMs ?? 0);
      let suffix = 1;
      while (transitions.some(item => item.id === `${property.name}-${suffix}`)) suffix++;
      const timing: Pick<LayerPropertyTransition, 'id' | 'startTimeMs' | 'endTimeMs' | 'easing'> = {
        id: `${property.name}-${suffix}`,
        startTimeMs,
        endTimeMs: startTimeMs + 2000,
        easing: 'easeInOut'
      };
      let transition: LayerPropertyTransition;
      if (property.type === 'color') {
        const current = Array.isArray(last?.endValue)
          ? last.endValue
          : property.name === 'color'
          ? addLayer?.config.color
          : addLayer?.config.visConfig?.[property.name] ?? addLayer?.config.color;
        if (!Array.isArray(current) || !isRgbColor(current)) return;
        transition = {
          ...timing,
          startValue: [current[0], current[1], current[2]],
          endValue: [current[0], current[1], current[2]]
        };
      } else {
        const current = addLayer?.config.visConfig?.[property.name];
        const previousValue = typeof last?.endValue === 'number' ? last.endValue : undefined;
        const initialValue =
          typeof current === 'number' && Number.isFinite(current)
            ? Math.max(property.range[0], Math.min(property.range[1], current))
            : property.range[0];
        transition = {
          ...timing,
          startValue: previousValue ?? (property.name === 'opacity' ? 0 : initialValue),
          endValue:
            property.name === 'opacity'
              ? previousValue === 1
                ? 0
                : 1
              : previousValue ?? initialValue
        };
      }
      if (addLayer) {
        saveLayerTransitions(addLayer, property, [...transitions, transition]);
        openSettings(
          {
            kind: 'layer',
            layerId: addLayer.id,
            propertyName: property.name,
            transitionId: transition.id
          },
          anchor
        );
      } else if (addAnnotation) {
        saveAnnotationTransitions(addAnnotation.annotation, [...transitions, transition]);
        openSettings(
          {
            kind: 'annotation',
            annotationId: addAnnotation.annotation.id,
            transitionId: transition.id
          },
          anchor
        );
      }
    };
    return (
      <Editor ref={editor} aria-label="Animation editor" className="animation-editor">
        <Toolbar>
          <CameraTourActionButton
            type="button"
            aria-label={playback.running ? 'Pause' : 'Play'}
            disabled={!playback.duration}
            onClick={playback.running ? playback.pause : playback.run}
          >
            {playback.running ? <Pause height="16px" /> : <Play height="16px" />}
          </CameraTourActionButton>
          <CameraTourActionButton
            type="button"
            aria-label="Restart"
            onClick={() => playback.seek(0)}
          >
            <Reset height="14px" />
          </CameraTourActionButton>
          <ToolbarButton type="button" onClick={playback.stop}>
            Stop
          </ToolbarButton>
          <Readout
            aria-label="Animation time"
            $elapsedWidth={seconds(playback.duration).length + 3}
          >
            <span>{seconds(playback.elapsed)}</span> / {seconds(playback.duration)}
          </Readout>
          <Divider />
          <PanelLabel htmlFor={`${id}-speed`}>Speed</PanelLabel>
          <Input
            id={`${id}-speed`}
            aria-label="Speed"
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            value={playback.speed}
            onChange={event => {
              const value = Number(event.target.value);
              if (value > 0 && value <= 10) playback.setSpeed(value);
            }}
          />
          <PanelLabel as="label" htmlFor={`${id}-loop`}>
            Loop
          </PanelLabel>
          <Switch
            id={`${id}-loop`}
            checked={playback.loop}
            onChange={event => playback.setLoop(event.target.checked)}
          />
          <Spacer />
          <ToolbarButton type="button" onClick={() => setDuration(configuredDuration || 10000)}>
            Fit
          </ToolbarButton>
          <CameraTourActionButton
            type="button"
            aria-label="Zoom out"
            onClick={() => setDuration(value => Math.min(Number.MAX_SAFE_INTEGER, value * 2))}
          >
            <ZoomOut height="16px" />
          </CameraTourActionButton>
          <ToolbarButton
            ref={addButton}
            type="button"
            aria-expanded={adding}
            aria-haspopup="menu"
            onClick={() => {
              setAdding(!adding);
              setAddTarget(null);
            }}
          >
            <Add height="12px" /> Add action
          </ToolbarButton>
          {adding && (
            <Menu
              ref={addMenu}
              role="menu"
              tabIndex={-1}
              aria-label="Add animation action"
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  event.preventDefault();
                  event.stopPropagation();
                  if (addTarget) setAddTarget(null);
                  else {
                    setAdding(false);
                    addButton.current?.focus();
                  }
                }
              }}
            >
              {addTarget ? (
                <>
                  <ToolbarButton role="menuitem" type="button" onClick={() => setAddTarget(null)}>
                    Back
                  </ToolbarButton>
                  <MenuHeading>
                    {addLayer?.config.label ??
                      addAnnotation?.label ??
                      (addEffect && title(addEffect.type))}
                  </MenuHeading>
                  {addLayer &&
                    (addLayer.animatableProps ?? DEFAULT_LAYER_ANIMATABLE_PROPS).map(property => (
                      <ToolbarButton
                        key={property.name}
                        role="menuitem"
                        type="button"
                        onClick={event => addProperty(property, event.currentTarget)}
                      >
                        {property.label}
                      </ToolbarButton>
                    ))}
                  {addAnnotation && (
                    <ToolbarButton
                      role="menuitem"
                      type="button"
                      onClick={event =>
                        addProperty(DEFAULT_LAYER_ANIMATABLE_PROPS[0], event.currentTarget)
                      }
                    >
                      Opacity
                    </ToolbarButton>
                  )}
                  {addEffect &&
                    effectChoices
                      .filter(choice => choice.effect.id === addEffect.id)
                      .map(({effect, parameter}) => (
                        <ToolbarButton
                          key={parameter.name}
                          role="menuitem"
                          type="button"
                          onClick={event => {
                            const value =
                              effect.parameters[parameter.name] ?? parameter.defaultValue;
                            const blockId = `${parameter.name}-1`;
                            playback.pause();
                            updateEffectConfig(null, effect.id, {
                              animation: {
                                ...effect.animation,
                                [parameter.name]: [
                                  {
                                    id: blockId,
                                    startValue: value,
                                    endValue: value,
                                    easing: 'easeInOut',
                                    startTimeMs: 0,
                                    endTimeMs: 10000
                                  }
                                ]
                              }
                            });
                            openSettings(
                              {kind: 'effect', effectId: effect.id, name: parameter.name, blockId},
                              event.currentTarget
                            );
                          }}
                        >
                          {title(
                            typeof parameter.label === 'string' ? parameter.label : parameter.name
                          )}
                        </ToolbarButton>
                      ))}
                </>
              ) : (
                <>
                  {onLayerConfigChange && layers.length > 0 && <MenuHeading>Layers</MenuHeading>}
                  {onLayerConfigChange &&
                    layers.map(layer => (
                      <ToolbarButton
                        key={layer.id}
                        role="menuitem"
                        type="button"
                        onClick={() => setAddTarget({kind: 'layer', id: layer.id})}
                      >
                        {layer.config.label}
                      </ToolbarButton>
                    ))}
                  {onAnnotationChange && annotations.length > 0 && (
                    <MenuHeading>Annotations</MenuHeading>
                  )}
                  {onAnnotationChange &&
                    annotationTracks.map(({annotation, label}) => (
                      <ToolbarButton
                        key={`annotation-${annotation.id}`}
                        role="menuitem"
                        type="button"
                        onClick={() => setAddTarget({kind: 'annotation', id: annotation.id})}
                      >
                        {label}
                      </ToolbarButton>
                    ))}
                  {effectChoices.length > 0 && <MenuHeading>Effects</MenuHeading>}
                  {effects
                    .filter(effect => effectChoices.some(choice => choice.effect.id === effect.id))
                    .map(effect => (
                      <ToolbarButton
                        key={effect.id}
                        role="menuitem"
                        type="button"
                        onClick={() => setAddTarget({kind: 'effect', id: effect.id})}
                      >
                        {title(effect.type)}
                      </ToolbarButton>
                    ))}
                </>
              )}
            </Menu>
          )}
        </Toolbar>
        <Workspace>
          <Timeline>
            <RulerRow>
              <RowLabel>
                <small>Time · seconds</small>
              </RowLabel>
              <Ruler
                $grid={(step / duration) * 100}
                role="slider"
                aria-label="Animation playhead"
                tabIndex={0}
                aria-valuemin={0}
                aria-valuemax={playback.duration}
                aria-valuenow={playback.elapsed}
                aria-valuetext={seconds(playback.elapsed)}
                onPointerDown={event => {
                  if (
                    scrubPointer.current !== null ||
                    event.button !== 0 ||
                    event.isPrimary === false
                  )
                    return;
                  suppressRulerClick.current = false;
                  if (!seekOnRuler(event)) return;
                  event.preventDefault();
                  event.currentTarget.focus();
                  scrubPointer.current = event.pointerId;
                  suppressRulerClick.current = true;
                  try {
                    event.currentTarget.setPointerCapture?.(event.pointerId);
                  } catch {
                    // Seeking may synchronously unmount the editor.
                  }
                }}
                onPointerMove={event => {
                  if (scrubPointer.current !== event.pointerId) return;
                  event.preventDefault();
                  seekOnRuler(event);
                }}
                onPointerUp={event => {
                  if (scrubPointer.current !== event.pointerId) return;
                  seekOnRuler(event);
                  endScrub(event);
                }}
                onPointerCancel={endScrub}
                onLostPointerCapture={endScrub}
                onClick={event => {
                  if (suppressRulerClick.current) {
                    suppressRulerClick.current = false;
                    return;
                  }
                  seekOnRuler(event);
                }}
                onKeyDown={event => {
                  const amount = event.shiftKey ? 1000 : 100;
                  const next =
                    event.key === 'ArrowLeft'
                      ? playback.elapsed - amount
                      : event.key === 'ArrowRight'
                      ? playback.elapsed + amount
                      : event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                      ? playback.duration
                      : null;
                  if (next !== null) {
                    event.preventDefault();
                    playback.seek(Math.max(0, Math.min(playback.duration, next)));
                  }
                }}
              >
                {ticks.map(time => (
                  <Tick key={time} $position={percent(time)}>
                    {Math.round(time / 10) / 100}
                  </Tick>
                ))}
                <Playhead $position={percent(playback.elapsed)} />
              </Ruler>
            </RulerRow>
            {cameraTour && (
              <Row role="group" aria-label="Camera animation">
                <RowLabel>
                  <span>Camera</span>
                  <small>{cameraEnabled ? `${cameraTour.stops.length} stops` : 'Disabled'}</small>
                </RowLabel>
                <Track $grid={(step / duration) * 100}>
                  <CameraAnimationTrack
                    tour={cameraTour}
                    durationMs={duration}
                    enabled={cameraEnabled}
                    selected={selected?.kind === 'camera' ? selected : undefined}
                    onSelect={segment =>
                      select({kind: 'camera', stopId: segment.stop.id, field: segment.field})
                    }
                    onSeek={segment => playback.seek(segment.startTimeMs, segment.stop.camera)}
                    onOpen={(segment, anchor) =>
                      openSettings(
                        {kind: 'camera', stopId: segment.stop.id, field: segment.field},
                        anchor
                      )
                    }
                    onDragStart={playback.pause}
                    onChange={onCameraTourChange ? saveCameraDuration : undefined}
                  />
                  <Cursor $position={percent(playback.elapsed)} />
                </Track>
              </Row>
            )}
            {layerTracks.map(({layer, property, transitions}) => (
              <Row
                key={`${layer.id}-${property.name}`}
                role="group"
                aria-label={`Layer ${property.label.toLowerCase()}: ${layer.config.label}`}
              >
                <RowLabel title={layer.config.label}>
                  <span>{layer.config.label}</span>
                  <small>
                    {property.label}
                    {layer.config.isVisible ? '' : ' · Hidden'}
                  </small>
                </RowLabel>
                <Track
                  $grid={(step / duration) * 100}
                  onDoubleClick={event => {
                    if (!onLayerConfigChange) return;
                    const transition = propertyBlockAt(event, property, transitions);
                    if (!transition) return;
                    saveLayerTransitions(layer, property, [...transitions, transition]);
                    openSettings(
                      {
                        kind: 'layer',
                        layerId: layer.id,
                        propertyName: property.name,
                        transitionId: transition.id
                      },
                      event.currentTarget,
                      event.clientX
                    );
                  }}
                >
                  {transitions.map((transition, index) => (
                    <AnimationBlock
                      key={transition.id}
                      label={`${formatPropertyValue(
                        transition.startValue,
                        property
                      )} → ${formatPropertyValue(transition.endValue, property)}`}
                      ariaLabel={`${property.label} ${index + 1} · ${layer.config.label}`}
                      kind="layer"
                      startTimeMs={transition.startTimeMs}
                      endTimeMs={transition.endTimeMs}
                      durationMs={duration}
                      minTimeMs={transitions[index - 1]?.endTimeMs ?? 0}
                      maxTimeMs={transitions[index + 1]?.startTimeMs ?? duration}
                      selected={
                        selected?.kind === 'layer' &&
                        selected.layerId === layer.id &&
                        selected.propertyName === property.name &&
                        selected.transitionId === transition.id
                      }
                      onSelect={() =>
                        select({
                          kind: 'layer',
                          layerId: layer.id,
                          propertyName: property.name,
                          transitionId: transition.id
                        })
                      }
                      onOpen={anchor =>
                        openSettings(
                          {
                            kind: 'layer',
                            layerId: layer.id,
                            propertyName: property.name,
                            transitionId: transition.id
                          },
                          anchor
                        )
                      }
                      onRequestRemove={
                        onLayerConfigChange
                          ? anchor =>
                              requestRemoval(
                                {
                                  kind: 'layer',
                                  layerId: layer.id,
                                  propertyName: property.name,
                                  transitionId: transition.id
                                },
                                anchor
                              )
                          : undefined
                      }
                      onDragStart={playback.pause}
                      onChange={(startTimeMs, endTimeMs) =>
                        saveLayerTransitions(
                          layer,
                          property,
                          transitions.map(item =>
                            item.id === transition.id ? {...item, startTimeMs, endTimeMs} : item
                          )
                        )
                      }
                    />
                  ))}
                  <Cursor $position={percent(playback.elapsed)} />
                </Track>
              </Row>
            ))}
            {annotationTracks
              .filter(track => track.transitions.length)
              .map(({annotation, label, transitions}) => (
                <Row
                  key={`annotation-${annotation.id}`}
                  role="group"
                  aria-label={`Annotation opacity: ${label}`}
                >
                  <RowLabel title={label}>
                    <span>{label}</span>
                    <small>
                      {annotation.isVisible ? 'Annotation opacity' : 'Hidden annotation'}
                    </small>
                  </RowLabel>
                  <Track
                    $grid={(step / duration) * 100}
                    onDoubleClick={event => {
                      if (!onAnnotationChange) return;
                      const transition = propertyBlockAt(
                        event,
                        DEFAULT_LAYER_ANIMATABLE_PROPS[0],
                        transitions
                      );
                      if (!transition) return;
                      saveAnnotationTransitions(annotation, [...transitions, transition]);
                      openSettings(
                        {
                          kind: 'annotation',
                          annotationId: annotation.id,
                          transitionId: transition.id
                        },
                        event.currentTarget,
                        event.clientX
                      );
                    }}
                  >
                    {transitions.map((transition, index) => (
                      <AnimationBlock
                        key={transition.id}
                        label={`${formatPropertyValue(
                          transition.startValue,
                          DEFAULT_LAYER_ANIMATABLE_PROPS[0]
                        )} → ${formatPropertyValue(
                          transition.endValue,
                          DEFAULT_LAYER_ANIMATABLE_PROPS[0]
                        )}`}
                        ariaLabel={`Opacity ${index + 1} · ${label}`}
                        kind="layer"
                        startTimeMs={transition.startTimeMs}
                        endTimeMs={transition.endTimeMs}
                        durationMs={duration}
                        minTimeMs={transitions[index - 1]?.endTimeMs ?? 0}
                        maxTimeMs={transitions[index + 1]?.startTimeMs ?? duration}
                        selected={
                          selected?.kind === 'annotation' &&
                          selected.annotationId === annotation.id &&
                          selected.transitionId === transition.id
                        }
                        onSelect={() =>
                          select({
                            kind: 'annotation',
                            annotationId: annotation.id,
                            transitionId: transition.id
                          })
                        }
                        onOpen={anchor =>
                          openSettings(
                            {
                              kind: 'annotation',
                              annotationId: annotation.id,
                              transitionId: transition.id
                            },
                            anchor
                          )
                        }
                        onRequestRemove={
                          onAnnotationChange
                            ? anchor =>
                                requestRemoval(
                                  {
                                    kind: 'annotation',
                                    annotationId: annotation.id,
                                    transitionId: transition.id
                                  },
                                  anchor
                                )
                            : undefined
                        }
                        onDragStart={playback.pause}
                        onChange={(startTimeMs, endTimeMs) =>
                          saveAnnotationTransitions(
                            annotation,
                            transitions.map(item =>
                              item.id === transition.id ? {...item, startTimeMs, endTimeMs} : item
                            )
                          )
                        }
                      />
                    ))}
                    <Cursor $position={percent(playback.elapsed)} />
                  </Track>
                </Row>
              ))}
            {rows.map(({effect, parameter: first, parameters}) => {
              const description = getAnimatableEffectParameters(effect).find(
                item => item.name === first.name
              );
              const label = title(
                typeof description?.label === 'string' ? description.label : first.name
              );
              return (
                <Row
                  key={`${effect.id}-${first.name}`}
                  role="group"
                  aria-label={`${title(effect.type)}: ${label}`}
                >
                  <RowLabel title={title(effect.type)}>
                    <span>{title(effect.type)}</span>
                    <small>{label}</small>
                  </RowLabel>
                  <Track
                    $grid={(step / duration) * 100}
                    onDoubleClick={event => addEffectAt(event, effect, parameters)}
                  >
                    {parameters.map((parameter, index) => {
                      const selection: Selection = {
                        kind: 'effect',
                        effectId: effect.id,
                        name: parameter.name,
                        blockId: parameter.id
                      };
                      return (
                        <AnimationBlock
                          key={parameter.id}
                          label={label}
                          ariaLabel={parameters.length > 1 ? `${label} ${index + 1}` : label}
                          kind="effect"
                          startTimeMs={parameter.startTimeMs}
                          endTimeMs={parameter.endTimeMs}
                          durationMs={duration}
                          minTimeMs={parameters[index - 1]?.endTimeMs ?? 0}
                          maxTimeMs={parameters[index + 1]?.startTimeMs ?? duration}
                          selected={
                            selected?.kind === 'effect' &&
                            selected.effectId === effect.id &&
                            selected.name === parameter.name &&
                            selected.blockId === parameter.id
                          }
                          onSelect={() => select(selection)}
                          onOpen={anchor => openSettings(selection, anchor)}
                          onRequestRemove={anchor => requestRemoval(selection, anchor)}
                          onDragStart={playback.pause}
                          onChange={(startTimeMs, endTimeMs) => {
                            const saved = effect.animation?.[parameter.name];
                            const updated: EffectParameterAnimation = {
                              id: parameter.id,
                              startValue: parameter.start,
                              endValue: parameter.end,
                              easing: parameter.easing,
                              startTimeMs,
                              endTimeMs
                            };
                            updateEffectConfig(null, effect.id, {
                              animation: {
                                ...effect.animation,
                                [parameter.name]: (saved ?? []).map(block =>
                                  block.id === parameter.id ? updated : block
                                )
                              }
                            });
                          }}
                        />
                      );
                    })}
                    <Cursor $position={percent(playback.elapsed)} />
                  </Track>
                </Row>
              );
            })}
            {!rows.length &&
              !layerTracks.length &&
              !annotationTracks.some(track => track.transitions.length) &&
              !cameraTour && <Empty>Add an action to begin.</Empty>}
          </Timeline>
        </Workspace>
        <Portaled
          component={PopupAnchor}
          // Open at the selected block instead of tweening from the previous popup position.
          theme={{...theme, transitionFast: 'none'}}
          isOpened={Boolean(
            popup && (selectedEffect || selectedTransition || selectedCameraSegment)
          )}
          onClose={() => {
            setPopup(null);
            setConfirmRemoval(false);
          }}
          top={popup?.top}
          left={popup?.left}
          modalProps={{contentLabel: confirmRemoval ? 'Remove animation action' : 'Block settings'}}
        >
          <SettingsPopup className="animation-editor animation-editor-settings">
            {confirmRemoval ? (
              <InspectorBody>
                <div>Remove this animation block?</div>
                <PanelLabel>
                  {selectedEffect && selected?.kind === 'effect'
                    ? `${title(selectedEffect.type)} · ${title(selected.name)}`
                    : `${
                        selectedLayerTrack?.layer.config.label ?? selectedAnnotationTrack?.label
                      } · ${selectedLayerTrack?.property.label ?? 'Opacity'}`}
                </PanelLabel>
                <InspectorActions>
                  <Button
                    type="button"
                    link
                    onClick={() => {
                      setPopup(null);
                      setConfirmRemoval(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="button" negative onClick={removeSelected}>
                    Remove
                  </Button>
                </InspectorActions>
              </InspectorBody>
            ) : selectedCameraSegment ? (
              <CameraSettings
                key={`${selectedCameraSegment.stop.id}-${selectedCameraSegment.field}`}
                segment={selectedCameraSegment}
                maxDurationMs={
                  Number.MAX_SAFE_INTEGER -
                  (cameraDuration -
                    (selectedCameraSegment.endTimeMs - selectedCameraSegment.startTimeMs))
                }
                onClose={() => setPopup(null)}
                onSave={
                  onCameraTourChange
                    ? value => {
                        saveCameraDuration(selectedCameraSegment, value);
                        setPopup(null);
                      }
                    : undefined
                }
                onEditCamera={
                  onEditCamera
                    ? () => {
                        onEditCamera(selectedCameraSegment.stop.id);
                        setPopup(null);
                      }
                    : undefined
                }
                onSwitch={
                  cameraSegments.some(
                    segment =>
                      segment.stop.id === selectedCameraSegment.stop.id &&
                      segment.field !== selectedCameraSegment.field
                  )
                    ? () =>
                        setSelected({
                          kind: 'camera',
                          stopId: selectedCameraSegment.stop.id,
                          field:
                            selectedCameraSegment.field === 'holdDurationMs'
                              ? 'travelDurationMs'
                              : 'holdDurationMs'
                        })
                    : undefined
                }
              />
            ) : selectedEffect && selected?.kind === 'effect' ? (
              <EffectAnimationControl
                key={`${selectedEffect.id}-${selected.name}-${selected.blockId}`}
                effect={selectedEffect}
                name={selected.name}
                blockId={selected.blockId}
                RangeSlider={RangeSlider}
                updateEffectConfig={updateEffectConfig}
                onClose={() => setPopup(null)}
              />
            ) : (
              selectedTransition &&
              selectedTransitions &&
              ((selectedLayerTrack && onLayerConfigChange) ||
                (selectedAnnotationTrack && onAnnotationChange)) && (
                <PropertySettings
                  key={`${selected?.kind}-${
                    selectedLayerTrack?.layer.id ?? selectedAnnotationTrack?.annotation.id
                  }-${selectedLayerTrack?.property.name ?? 'opacity'}-${selectedTransition.id}`}
                  label={selectedLayerTrack?.layer.config.label ?? selectedAnnotationTrack!.label}
                  property={selectedLayerTrack?.property ?? DEFAULT_LAYER_ANIMATABLE_PROPS[0]}
                  transition={selectedTransition}
                  transitions={selectedTransitions}
                  onClose={() => setPopup(null)}
                  onSave={transition => {
                    saveSelectedTransitions(
                      selectedTransitions.map(item =>
                        item.id === transition.id ? transition : item
                      )
                    );
                    setPopup(null);
                  }}
                  onRemove={removeSelected}
                />
              )
            )}
          </SettingsPopup>
        </Portaled>
      </Editor>
    );
  };
}
