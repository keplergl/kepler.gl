// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {ClientRect} from '@dnd-kit/core';
import type {Transform} from '@dnd-kit/utilities';

const SNAP_DISTANCE = 8;
const WIDGET_GAP = 8;

/** Adjust only the moving widget; no registry, docking state, or global listeners. */
export function snapToFloatingWidgets(
  element: HTMLElement,
  rect: ClientRect,
  transform: Transform,
  leftSidebarOffset: number
): Transform {
  const root = element.closest('.kepler-gl');
  if (!root) return transform;

  const bounds = root.getBoundingClientRect();
  const left = rect.left + transform.x;
  const right = rect.right + transform.x;
  const top = rect.top + transform.y;
  const bottom = rect.bottom + transform.y;
  let snapX: number | undefined;
  let snapY: number | undefined;

  for (const target of root.querySelectorAll<HTMLElement>('.draggable-legend')) {
    if (target === element || target.closest('.kepler-gl') !== root) continue;
    const targetRect = target.getBoundingClientRect();
    if (
      targetRect.width <= 0 ||
      targetRect.height <= 0 ||
      getComputedStyle(target).visibility !== 'visible'
    ) {
      continue;
    }

    // Only nearby widgets attract each other, not distant panels on the same axis.
    if (
      top <= targetRect.bottom + WIDGET_GAP + SNAP_DISTANCE &&
      bottom >= targetRect.top - WIDGET_GAP - SNAP_DISTANCE
    ) {
      for (const delta of [
        targetRect.left - left,
        targetRect.right - right,
        targetRect.right + WIDGET_GAP - left,
        targetRect.left - WIDGET_GAP - right
      ]) {
        if (
          Math.abs(delta) <= SNAP_DISTANCE &&
          (snapX === undefined || Math.abs(delta) < Math.abs(snapX)) &&
          // Match the existing position hook's margins so the drop does not jump.
          left + delta >= bounds.left + leftSidebarOffset + 10 &&
          right + delta <= bounds.right - 10
        ) {
          snapX = delta;
        }
      }
    }
    if (
      left <= targetRect.right + WIDGET_GAP + SNAP_DISTANCE &&
      right >= targetRect.left - WIDGET_GAP - SNAP_DISTANCE
    ) {
      for (const delta of [
        targetRect.top - top,
        targetRect.bottom - bottom,
        targetRect.bottom + WIDGET_GAP - top,
        targetRect.top - WIDGET_GAP - bottom
      ]) {
        if (
          Math.abs(delta) <= SNAP_DISTANCE &&
          (snapY === undefined || Math.abs(delta) < Math.abs(snapY)) &&
          top + delta >= bounds.top + 10 &&
          bottom + delta <= bounds.bottom - 30
        ) {
          snapY = delta;
        }
      }
    }
  }

  // Always use the raw drag transform so moving beyond the tolerance releases the snap.
  return {...transform, x: transform.x + (snapX ?? 0), y: transform.y + (snapY ?? 0)};
}
