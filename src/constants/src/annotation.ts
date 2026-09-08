// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export enum AnnotationKind {
  TEXT = 'TEXT',
  ARROW = 'ARROW',
  POINT = 'POINT',
  CIRCLE = 'CIRCLE'
}

export function isAnnotationKind(kind: string): kind is AnnotationKind {
  return Object.values(AnnotationKind).includes(kind as AnnotationKind);
}

export function isAnnotationWithArm<T extends object>(
  anno: T
): anno is T & {armLength: number; angle: number} {
  return isFinite((anno as any).armLength);
}

export const INITIAL_ANNOTATION_KIND = AnnotationKind.POINT;
export const INITIAL_ANNOTATION_ANGLE = -45;
export const INITIAL_ANNOTATION_ARM_LENGTH = 50;
export const INITIAL_ANNOTATION_TEXT_WIDTH = 0;
export const INITIAL_ANNOTATION_TEXT_HEIGHT = 0;
export const INITIAL_ANNOTATION_LINE_WIDTH = 2;
export const INITIAL_ANNOTATION_LINE_COLOR = '#FFFFFF';

export type AnnotationTextSide = 'left' | 'right';
export type AnnotationTextVerticalPosition = 'above' | 'below';

export const INITIAL_ANNOTATION_TEXT_SIDE: AnnotationTextSide = 'right';
export const INITIAL_ANNOTATION_TEXT_VERTICAL_POSITION: AnnotationTextVerticalPosition = 'above';

export const ANNOTATION_KINDS = [
  {id: AnnotationKind.TEXT, label: 'Text'},
  {id: AnnotationKind.POINT, label: 'Point'},
  {id: AnnotationKind.ARROW, label: 'Arrow'},
  {id: AnnotationKind.CIRCLE, label: 'Circle'}
];

export const ANNOTATION_LINE_WIDTH_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const ANNOTATION_TEXT_SIDES: Array<{id: AnnotationTextSide; label: string}> = [
  {id: 'right', label: 'Right'},
  {id: 'left', label: 'Left'}
];

export const ANNOTATION_TEXT_VERTICAL_POSITIONS: Array<{
  id: AnnotationTextVerticalPosition;
  label: string;
}> = [
  {id: 'above', label: 'Above'},
  {id: 'below', label: 'Below'}
];

/** Canonical arm angle for a text-side + vertical-position pair (screen y-down). */
export const ANNOTATION_ANGLE_BY_PLACEMENT: Record<
  `${AnnotationTextSide}-${AnnotationTextVerticalPosition}`,
  number
> = {
  'right-above': INITIAL_ANNOTATION_ANGLE,
  'left-above': -135,
  'right-below': 45,
  'left-below': 135
};

export function isLeftOriented(angle: number): boolean {
  return angle > 90 || angle < -90;
}

export function isBelowOriented(angle: number): boolean {
  return angle > 0 && angle < 180;
}

export function textPlacementFromAngle(angle: number): {
  side: AnnotationTextSide;
  vertical: AnnotationTextVerticalPosition;
} {
  return {
    side: isLeftOriented(angle) ? 'left' : 'right',
    vertical: isBelowOriented(angle) ? 'below' : 'above'
  };
}
