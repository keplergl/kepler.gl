// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';

import {ZOOM_OPACITY_RANGE} from '@kepler.gl/reducers';
import {ZoomOpacityStops} from '@kepler.gl/types';

const HANDLE_SIZE = 6;
const PAD_TOP = 8;
const CURVE_HEIGHT = 18;
const LABEL_HEIGHT = 9;
const PLOT_HEIGHT = PAD_TOP + CURVE_HEIGHT + HANDLE_SIZE / 2 + 1 + LABEL_HEIGHT;
const PAD_X = 10;

const HANDLES: {key: keyof ZoomOpacityStops; labelId: string}[] = [
  {key: 'appear', labelId: 'interactions.fadeOnZoomAppear'},
  {key: 'full', labelId: 'interactions.fadeOnZoomFullStart'},
  {key: 'fade', labelId: 'interactions.fadeOnZoomFullEnd'},
  {key: 'gone', labelId: 'interactions.fadeOnZoomDisappear'}
];

const SliderRoot = styled.div`
  margin-top: 4px;
  user-select: none;
`;

const Plot = styled.div`
  height: ${PLOT_HEIGHT}px;
  position: relative;
  touch-action: none;
`;

const Envelope = styled.svg`
  color: ${props => props.theme.textColor};
  display: block;
  height: 100%;
  overflow: visible;
  width: 100%;
`;

const AxisLabel = styled.span<{$edge: 'left' | 'right'}>`
  color: ${props => props.theme.subtextColor};
  font-size: 9px;
  left: ${props => (props.$edge === 'left' ? 0 : 'auto')};
  line-height: ${LABEL_HEIGHT}px;
  pointer-events: none;
  position: absolute;
  right: ${props => (props.$edge === 'right' ? 0 : 'auto')};
  top: ${PAD_TOP + CURVE_HEIGHT + HANDLE_SIZE / 2 + 1}px;
`;

const Handle = styled.button<{$active: boolean; $x: number; $y: number}>`
  background: ${props => props.theme.sliderHandleColor};
  border: 1px solid
    ${props =>
      props.$active ? props.theme.selectBorderColor : props.theme.sliderInactiveBorderColor};
  border-radius: 50%;
  box-shadow: ${props => props.theme.sliderHandleShadow};
  cursor: grab;
  height: ${HANDLE_SIZE}px;
  left: ${props => props.$x}px;
  margin: 0;
  padding: 0;
  position: absolute;
  top: ${props => props.$y}px;
  transform: translate(-50%, -50%);
  width: ${HANDLE_SIZE}px;
  z-index: ${props => (props.$active ? 3 : 1)};

  &:hover,
  &:focus {
    background: ${props => props.theme.sliderHandleHoverColor};
    outline: none;
    z-index: 3;
  }
`;

const ValueTip = styled.div<{$below: boolean; $x: number; $y: number}>`
  background: ${props => props.theme.tooltipBg};
  border-radius: 2px;
  color: ${props => props.theme.tooltipColor};
  font-size: 10px;
  left: ${props => props.$x}px;
  line-height: 1;
  padding: 3px 4px;
  pointer-events: none;
  position: absolute;
  top: ${props =>
    props.$below ? props.$y + HANDLE_SIZE / 2 + 4 : props.$y - HANDLE_SIZE / 2 - 4}px;
  transform: translate(-50%, ${props => (props.$below ? '0' : '-100%')});
  white-space: nowrap;
  z-index: 4;
`;

const ZoomMarker = styled.div<{$x: number}>`
  background: ${props => props.theme.primaryBtnActBgd};
  bottom: ${PLOT_HEIGHT - opacityToY(0)}px;
  left: ${props => props.$x}px;
  pointer-events: none;
  position: absolute;
  top: 2px;
  transform: translateX(-50%);
  width: 1px;
  z-index: 2;
`;

type ZoomOpacitySliderProps = {
  idPrefix: string;
  stops: ZoomOpacityStops;
  zoom?: number;
  onChange: (key: keyof ZoomOpacityStops, value: number) => void;
};

function zoomToX(zoom: number, width: number): number {
  const [minZoom, maxZoom] = ZOOM_OPACITY_RANGE;
  const inner = Math.max(width - PAD_X * 2, 1);
  return PAD_X + ((zoom - minZoom) / (maxZoom - minZoom)) * inner;
}

function opacityToY(opacity: number): number {
  return PAD_TOP + (1 - opacity) * CURVE_HEIGHT;
}

function clientXToZoom(clientX: number, rect: DOMRect): number {
  const [minZoom, maxZoom] = ZOOM_OPACITY_RANGE;
  const inner = Math.max(rect.width - PAD_X * 2, 1);
  const ratio = (clientX - rect.left - PAD_X) / inner;
  return minZoom + Math.min(1, Math.max(0, ratio)) * (maxZoom - minZoom);
}

function envelopePath(stops: ZoomOpacityStops, width: number): string {
  const yZero = opacityToY(0);
  const yFull = opacityToY(1);
  const xAppear = zoomToX(stops.appear, width);
  const xFull = zoomToX(stops.full, width);
  const xFade = zoomToX(stops.fade, width);
  const xGone = zoomToX(stops.gone, width);
  return [
    `M ${PAD_X} ${yZero}`,
    `L ${xAppear} ${yZero}`,
    `L ${xFull} ${yFull}`,
    `L ${xFade} ${yFull}`,
    `L ${xGone} ${yZero}`,
    `L ${width - PAD_X} ${yZero}`
  ].join(' ');
}

export default function ZoomOpacitySlider({
  idPrefix,
  stops,
  zoom,
  onChange
}: ZoomOpacitySliderProps) {
  const intl = useIntl();
  const plotRef = useRef<HTMLDivElement>(null);
  const activeKeyRef = useRef<keyof ZoomOpacityStops | null>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<keyof ZoomOpacityStops | null>(null);
  const [minZoom, maxZoom] = ZOOM_OPACITY_RANGE;

  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) {
      return undefined;
    }
    const measure = () => setWidth(plot.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);

  const moveActive = useCallback(
    (key: keyof ZoomOpacityStops, clientX: number) => {
      const plot = plotRef.current;
      if (!plot) {
        return;
      }
      onChange(key, clientXToZoom(clientX, plot.getBoundingClientRect()));
    },
    [onChange]
  );

  const endDrag = useCallback(() => {
    activeKeyRef.current = null;
    setActive(null);
  }, []);

  const onPointerDown = (key: keyof ZoomOpacityStops) => (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is unavailable for some synthetic events.
    }
    activeKeyRef.current = key;
    setActive(key);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (activeKeyRef.current !== key) {
        return;
      }
      moveActive(key, moveEvent.clientX);
    };
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      endDrag();
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    moveActive(key, event.clientX);
  };

  const onKeyDown = (key: keyof ZoomOpacityStops) => (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 1 : 0.1;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      onChange(key, stops[key] - step);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      onChange(key, stops[key] + step);
    }
  };

  const yZero = opacityToY(0);
  const path = width > 0 ? envelopePath(stops, width) : '';

  return (
    <SliderRoot className="interaction-zoom-opacity__slider">
      <Plot ref={plotRef}>
        <Envelope aria-hidden="true">
          {width > 0 ? (
            <>
              <line
                x1={PAD_X}
                x2={width - PAD_X}
                y1={yZero}
                y2={yZero}
                stroke="currentColor"
                strokeOpacity={0.25}
              />
              <path d={`${path} Z`} fill="currentColor" fillOpacity={0.18} />
              <path d={path} fill="none" stroke="currentColor" strokeWidth={1.5} />
            </>
          ) : null}
        </Envelope>
        {width > 0
          ? HANDLES.map(handle => {
              const value = stops[handle.key];
              const x = zoomToX(value, width);
              const y = opacityToY(handle.key === 'full' || handle.key === 'fade' ? 1 : 0);
              const label = intl.formatMessage({id: handle.labelId});
              return (
                <React.Fragment key={handle.key}>
                  <Handle
                    type="button"
                    className={`interaction-zoom-opacity__handle interaction-zoom-opacity__handle--${handle.key}`}
                    id={`${idPrefix}-${handle.key}`}
                    $active={active === handle.key}
                    $x={x}
                    $y={y}
                    role="slider"
                    aria-label={label}
                    aria-valuemin={minZoom}
                    aria-valuemax={maxZoom}
                    aria-valuenow={value}
                    aria-valuetext={String(value)}
                    onPointerDown={onPointerDown(handle.key)}
                    onKeyDown={onKeyDown(handle.key)}
                  />
                  {active === handle.key ? (
                    <ValueTip $below={y < PLOT_HEIGHT / 2} $x={x} $y={y}>
                      {label} {value}
                    </ValueTip>
                  ) : null}
                </React.Fragment>
              );
            })
          : null}
        {width > 0 && Number.isFinite(zoom) ? (
          <ZoomMarker
            className="interaction-zoom-opacity__zoom-marker"
            $x={zoomToX(Math.min(maxZoom, Math.max(minZoom, zoom as number)), width)}
          />
        ) : null}
        <AxisLabel $edge="left">{minZoom}</AxisLabel>
        <AxisLabel $edge="right">{maxZoom}</AxisLabel>
      </Plot>
    </SliderRoot>
  );
}
