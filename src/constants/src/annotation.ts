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

export const ANNOTATION_KINDS = [
  {id: AnnotationKind.TEXT, label: 'Text'},
  {id: AnnotationKind.POINT, label: 'Point'},
  {id: AnnotationKind.ARROW, label: 'Arrow'},
  {id: AnnotationKind.CIRCLE, label: 'Circle'}
];

export const ANNOTATION_LINE_WIDTH_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
