// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AnnotationKind} from '@kepler.gl/constants';
import type {
  AnnotationPropsPartial,
  AnnotationReadout,
  ViewportAnnotationPlacement
} from '@kepler.gl/types';

const anchors = new Set([
  'top-left',
  'top',
  'top-right',
  'left',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right'
]);

export function normalizeAnnotationViewport(
  value: unknown
): ViewportAnnotationPlacement | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const {anchor, margin} = value as ViewportAnnotationPlacement;
  if (
    !anchors.has(anchor) ||
    !Array.isArray(margin) ||
    margin.length !== 2 ||
    !margin.every(item => Number.isFinite(item) && item >= 0)
  )
    return undefined;
  return {anchor, margin: [margin[0], margin[1]]};
}

export function normalizeAnnotationReadout(value: unknown): AnnotationReadout | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const readout = value as AnnotationReadout;
  if (
    readout.type === 'time' &&
    (readout.format === undefined ||
      (typeof readout.format === 'string' &&
        readout.format.length > 0 &&
        readout.format.length <= 128))
  ) {
    return {type: 'time', ...(readout.format !== undefined ? {format: readout.format} : {})};
  }
  if (readout.type === 'count' && typeof readout.dataId === 'string' && readout.dataId.trim()) {
    return {type: 'count', dataId: readout.dataId};
  }
  return undefined;
}

/** Own caption metadata and discard it when changing back to a geographic annotation. */
export function normalizeAnnotationCaption(
  config: AnnotationPropsPartial
): Pick<AnnotationPropsPartial, 'viewport' | 'readout'> {
  const viewport =
    config.kind === AnnotationKind.TEXT ? normalizeAnnotationViewport(config.viewport) : undefined;
  if (!viewport) return {};
  const readout = normalizeAnnotationReadout(config.readout);
  return {viewport, ...(readout ? {readout} : {})};
}
