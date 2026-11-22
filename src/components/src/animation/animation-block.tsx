// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useRef, useState} from 'react';
import type {KeyboardEvent, PointerEvent as ReactPointerEvent} from 'react';
import styled from 'styled-components';
import {Button} from '../common/styled-components';
import {Close} from '../common/icons';

type Range = [number, number];
type Part = 'body' | 'start' | 'end';

export type AnimationBlockProps = {
  label: string;
  ariaLabel?: string;
  startTimeMs: number;
  endTimeMs: number;
  durationMs: number;
  selected?: boolean;
  disabled?: boolean;
  kind?: 'effect' | 'layer' | 'camera';
  onSelect: () => void;
  onOpen?: (anchor: HTMLElement) => void;
  onRequestRemove?: (anchor: HTMLElement) => void;
  onChange: (startTimeMs: number, endTimeMs: number) => void;
  onDragStart?: () => void;
  minimumDurationMs?: number;
  minTimeMs?: number;
  maxTimeMs?: number;
  stepMs?: number;
};

const Block = styled.div<{
  $left: number;
  $width: number;
  $selected: boolean;
  $dragging: boolean;
  $kind: NonNullable<AnimationBlockProps['kind']>;
}>`
  position: absolute;
  left: min(${props => props.$left}%, calc(100% - 6px));
  top: 4px;
  height: 24px;
  width: ${props => props.$width}%;
  min-width: 6px;
  border-radius: 3px;
  background: ${props =>
    props.$selected ? props.theme.panelContentBackground : props.theme.panelBackgroundHover};
  color: ${props => (props.$selected ? props.theme.textColorHl : props.theme.textColor)};
  box-shadow: inset 0 0 0 1px
    ${props => (props.$selected ? props.theme.activeColor : props.theme.panelBorderColor)};
  border-top: 2px solid
    ${props =>
      props.$kind === 'effect'
        ? props.theme.activeColor
        : props.$kind === 'layer'
        ? props.theme.sliderHandleColor
        : props.theme.subtextColor};
  user-select: none;
  touch-action: none;
  z-index: ${props => (props.$selected || props.$dragging ? 3 : 1)};
  &:hover,
  &:focus-within {
    z-index: 4;
    box-shadow: inset 0 0 0 1px ${props => props.theme.activeColor};
  }
`;
const Body = styled.button<{$disabled: boolean; $dragging: boolean}>`
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 0;
  padding: 0;
  padding-inline: clamp(0px, calc(50% - 3px), 9px);
  border-radius: inherit;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 11px;
  line-height: 20px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: ${props => (props.$disabled ? 'pointer' : props.$dragging ? 'grabbing' : 'grab')};
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: 2px;
  }
`;
const Edge = styled.button<{
  $side: 'start' | 'end';
  $selected: boolean;
  $disabled: boolean;
}>`
  position: absolute;
  top: -2px;
  bottom: 0;
  ${props => (props.$side === 'start' ? 'left' : 'right')}: clamp(-9px, calc(50% - 12px), -3px);
  width: 9px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 2px;
  background: transparent;
  color: ${props => props.theme.textColorHl};
  opacity: ${props => (props.$selected ? 1 : 0)};
  cursor: ${props => (props.$disabled ? 'pointer' : 'ew-resize')};
  touch-action: none;
  &::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 7px;
    bottom: 7px;
    width: 2px;
    border-radius: 1px;
    background: currentColor;
  }
  ${Block}:hover &,
  ${Block}:focus-within & {
    opacity: 1;
  }
  &:focus-visible {
    opacity: 1;
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: 1px;
  }
`;

const RemoveAction = styled.div<{$dragging: boolean}>`
  position: absolute;
  right: 0;
  bottom: 100%;
  // The padding bridges the gap so moving from the block keeps this control visible.
  padding-bottom: 3px;
  opacity: 0;
  pointer-events: none;
  ${Block}:hover & {
    opacity: ${props => (props.$dragging ? 0 : 1)};
    pointer-events: ${props => (props.$dragging ? 'none' : 'auto')};
  }
`;
const RemoveButton = styled(Button).attrs({link: true})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 1px solid ${props => props.theme.panelBorderColor};
  border-radius: 3px;
  background: ${props => props.theme.panelBackground};
  color: ${props => props.theme.textColor};
  svg {
    margin: 0;
  }
`;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const seconds = (time: number) => `${Math.round(time / 10) / 100} s`;

/** One time interval. Pointer edits stay local until the gesture is committed. */
export default function AnimationBlock({
  label,
  ariaLabel = label,
  startTimeMs,
  endTimeMs,
  durationMs,
  selected = false,
  disabled = false,
  kind = 'effect',
  onSelect,
  onOpen,
  onRequestRemove,
  onChange,
  onDragStart,
  minimumDurationMs = 0,
  minTimeMs = 0,
  maxTimeMs = durationMs,
  stepMs = 100
}: AnimationBlockProps) {
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLButtonElement>(null);
  const [draft, setDraft] = useState<{
    range: Range;
    durationMs: number;
    minTimeMs: number;
    maxTimeMs: number;
  } | null>(null);
  const cleanup = useRef<(() => void) | null>(null);
  const cancel = useRef<(() => void) | null>(null);
  const suppressClick = useRef(false);
  const suppressOpen = useRef(false);
  const callbacks = useRef({onSelect, onOpen, onChange, onDragStart});
  callbacks.current = {onSelect, onOpen, onChange, onDragStart};

  useEffect(() => () => cleanup.current?.(), []);
  useEffect(() => {
    if (disabled) cancel.current?.();
  }, [disabled]);

  const valid =
    [startTimeMs, endTimeMs, durationMs, minTimeMs, maxTimeMs].every(Number.isFinite) &&
    durationMs > 0 &&
    minTimeMs >= 0 &&
    maxTimeMs <= durationMs &&
    startTimeMs >= minTimeMs &&
    endTimeMs >= startTimeMs &&
    endTimeMs <= maxTimeMs;
  const step = Number.isFinite(stepMs) && stepMs > 0 ? stepMs : 100;
  const minimum = Number.isFinite(minimumDurationMs) ? Math.max(0, minimumDurationMs) : 0;
  const range: Range = draft?.range ?? [startTimeMs, endTimeMs];
  const displayDuration = draft?.durationMs ?? durationMs;
  const displayMin = draft?.minTimeMs ?? minTimeMs;
  const displayMax = draft?.maxTimeMs ?? maxTimeMs;

  const shift = (
    part: Part,
    original: Range,
    delta: number,
    lower: number,
    upper: number,
    min: number
  ): Range => {
    const [start, end] = original;
    if (part === 'start') return [clamp(start + delta, lower, Math.max(lower, end - min)), end];
    if (part === 'end') return [start, clamp(end + delta, Math.min(upper, start + min), upper)];
    const next = clamp(start + delta, lower, upper - (end - start));
    return [next, next + end - start];
  };

  const select = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (suppressClick.current) {
      suppressClick.current = false;
      event.preventDefault();
      return;
    }
    callbacks.current.onSelect();
  };

  const open = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!cleanup.current && !suppressOpen.current && body.current) {
      callbacks.current.onOpen?.(body.current);
    }
  };

  const begin = (part: Part, event: ReactPointerEvent<HTMLButtonElement>) => {
    if (cleanup.current) return;
    suppressClick.current = false;
    suppressOpen.current = false;
    if (disabled || !valid || event.button !== 0 || event.isPrimary === false) {
      return;
    }
    const rect = root.current?.parentElement?.getBoundingClientRect();
    if (!rect || !(rect.width > 0) || !Number.isFinite(event.clientX)) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.focus();
    const target = event.currentTarget;
    const pointerId = event.pointerId;
    const origin = event.clientX;
    const original: Range = [startTimeMs, endTimeMs];
    const total = durationMs;
    const width = rect.width;
    const minimumLength = minimum;
    const lower = minTimeMs;
    const upper = maxTimeMs;
    const increment = step;
    let next = original;
    let moved = false;
    try {
      target.setPointerCapture?.(pointerId);
    } catch {
      // Capture may be unavailable after a synchronous parent unmount.
    }
    const move = (pointer: PointerEvent) => {
      if (pointer.pointerId !== pointerId) return;
      const pixels = pointer.clientX - origin;
      if (!Number.isFinite(pixels)) return;
      if (!moved && Math.abs(pixels) < 3) return;
      pointer.preventDefault();
      if (!moved) {
        moved = true;
        callbacks.current.onDragStart?.();
      }
      const delta = Math.round(((pixels / width) * total) / increment) * increment;
      next = shift(part, original, delta, lower, upper, minimumLength);
      setDraft({range: next, durationMs: total, minTimeMs: lower, maxTimeMs: upper});
    };
    const remove = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', abortPointer);
      window.removeEventListener('keydown', key);
      cleanup.current = null;
      cancel.current = null;
      if (target.hasPointerCapture?.(pointerId)) target.releasePointerCapture?.(pointerId);
    };
    const abort = () => {
      suppressClick.current = true;
      suppressOpen.current = true;
      remove();
      setDraft(null);
    };
    const abortPointer = (pointer: PointerEvent) => {
      if (pointer.pointerId === pointerId) abort();
    };
    const key = (keyboard: globalThis.KeyboardEvent) => {
      if (keyboard.key === 'Escape') {
        keyboard.preventDefault();
        keyboard.stopPropagation();
        abort();
      }
    };
    const end = (pointer: PointerEvent) => {
      if (pointer.pointerId !== pointerId) return;
      move(pointer);
      suppressClick.current = moved;
      suppressOpen.current = moved;
      remove();
      setDraft(null);
      if (moved && (next[0] !== original[0] || next[1] !== original[1])) {
        callbacks.current.onChange(...next);
      }
    };
    cleanup.current = remove;
    cancel.current = abort;
    window.addEventListener('pointermove', move, {passive: false});
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', abortPointer);
    window.addEventListener('keydown', key);
  };

  const keyDown = (part: Part, event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      if (cleanup.current) return;
      if (callbacks.current.onOpen && body.current) callbacks.current.onOpen(body.current);
      else callbacks.current.onSelect();
      return;
    }
    if (disabled || !valid || cleanup.current) return;
    const direction =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
        ? -1
        : 0;
    if (!direction) return;
    event.preventDefault();
    event.stopPropagation();
    const next = shift(
      part,
      [startTimeMs, endTimeMs],
      direction * step * (event.shiftKey ? 10 : 1),
      minTimeMs,
      maxTimeMs,
      minimum
    );
    if (next[0] !== startTimeMs || next[1] !== endTimeMs) {
      callbacks.current.onDragStart?.();
      callbacks.current.onChange(...next);
    }
  };

  return (
    <Block
      ref={root}
      $left={draft || valid ? (range[0] / displayDuration) * 100 : 0}
      $width={draft || valid ? ((range[1] - range[0]) / displayDuration) * 100 : 0}
      $selected={selected}
      $dragging={draft !== null}
      $kind={kind}
      title={`${label}: ${seconds(range[0])} – ${seconds(range[1])}${
        onOpen ? ' · Double-click to edit' : ''
      }`}
      onDoubleClick={open}
    >
      <Body
        ref={body}
        type="button"
        aria-label={ariaLabel}
        aria-pressed={selected}
        aria-haspopup={onOpen ? 'dialog' : undefined}
        $disabled={disabled}
        $dragging={draft !== null}
        onPointerDown={event => begin('body', event)}
        onClick={select}
        onKeyDown={event => keyDown('body', event)}
      >
        {label}
      </Body>
      {(['start', 'end'] as const).map((part, index) => (
        <Edge
          key={part}
          type="button"
          role="slider"
          aria-label={`${part === 'start' ? 'Start' : 'End'} time for ${ariaLabel}`}
          aria-valuemin={part === 'start' ? displayMin : Math.min(displayMax, range[0] + minimum)}
          aria-valuemax={part === 'start' ? Math.max(displayMin, range[1] - minimum) : displayMax}
          aria-valuenow={range[index]}
          aria-valuetext={seconds(range[index])}
          aria-disabled={disabled || !valid}
          $side={part}
          $selected={selected || draft !== null}
          $disabled={disabled}
          onPointerDown={event => begin(part, event)}
          onClick={select}
          onKeyDown={event => keyDown(part, event)}
        />
      ))}
      {onRequestRemove && (
        <RemoveAction $dragging={draft !== null}>
          <RemoveButton
            type="button"
            aria-label={`Remove ${ariaLabel}`}
            aria-haspopup="dialog"
            title="Remove action"
            disabled={disabled || draft !== null}
            onPointerDown={event => {
              event.stopPropagation();
              if (!cleanup.current) {
                suppressClick.current = false;
                suppressOpen.current = false;
              }
            }}
            onKeyDown={event => {
              if (!cleanup.current && (event.key === 'Enter' || event.key === ' ')) {
                suppressClick.current = false;
                suppressOpen.current = false;
              }
            }}
            onClick={event => {
              event.stopPropagation();
              if (disabled || cleanup.current || suppressClick.current) return;
              onRequestRemove(event.currentTarget);
            }}
            onDoubleClick={event => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <Close height="10px" />
          </RemoveButton>
        </RemoveAction>
      )}
    </Block>
  );
}
