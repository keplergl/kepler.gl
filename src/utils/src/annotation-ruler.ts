// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {AnnotationLabelBackground, RulerStyle} from '@kepler.gl/types';

export const DEFAULT_RULER_STYLE: Readonly<RulerStyle> = {
  unit: 'auto',
  precision: 1,
  prefix: '',
  suffix: '',
  placement: 'above',
  offset: 0,
  dimensionLine: false,
  startLabel: '',
  endLabel: ''
};

export function normalizeRulerStyle(value: unknown): RulerStyle | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const input = value as Partial<RulerStyle>;
  const style = {...DEFAULT_RULER_STYLE};
  if (input.unit === 'auto' || input.unit === 'm' || input.unit === 'km') style.unit = input.unit;
  if (Number.isInteger(input.precision) && input.precision! >= 0 && input.precision! <= 6)
    style.precision = input.precision!;
  if (input.placement === 'above' || input.placement === 'below') style.placement = input.placement;
  if (Number.isFinite(input.offset) && input.offset! >= 0 && input.offset! <= 1000)
    style.offset = input.offset!;
  if (typeof input.dimensionLine === 'boolean') style.dimensionLine = input.dimensionLine;
  for (const key of ['prefix', 'suffix', 'startLabel', 'endLabel'] as const) {
    if (typeof input[key] === 'string') style[key] = input[key]!.slice(0, 128);
  }
  return style;
}

export function normalizeAnnotationLabelBackground(
  value: unknown
): AnnotationLabelBackground | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const {color, opacity, padding} = value as AnnotationLabelBackground;
  if (
    typeof color !== 'string' ||
    !/^#[0-9a-f]{6}$/i.test(color) ||
    !Number.isFinite(opacity) ||
    opacity < 0 ||
    opacity > 1 ||
    !Number.isFinite(padding) ||
    padding < 0 ||
    padding > 100
  )
    return undefined;
  return {color, opacity, padding};
}
