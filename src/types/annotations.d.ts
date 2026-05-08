// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AnnotationKind} from '@kepler.gl/constants';

export {AnnotationKind} from '@kepler.gl/constants';
export {isAnnotationKind, isAnnotationWithArm} from '@kepler.gl/constants';

export type BaseAnnotation = {
  id: string;
  kind: AnnotationKind;
  isVisible: boolean;
  autoSize: boolean;
  autoSizeY: boolean;
  anchorPoint: [number, number];
  label: string;
  mapIndex?: number;
  lineColor: string;
  lineWidth: number;
  textWidth: number;
  textHeight: number;
  textVerticalAlign?: 'top' | 'middle' | 'bottom';
};

export type AnnotationWithArm = BaseAnnotation & {
  armLength: number;
  angle: number;
};

export type TextAnnotation = BaseAnnotation & {
  kind: AnnotationKind.TEXT;
};

export type PointAnnotation = AnnotationWithArm & {
  kind: AnnotationKind.POINT;
};

export type ArrowAnnotation = AnnotationWithArm & {
  kind: AnnotationKind.ARROW;
};

export type CircleAnnotation = AnnotationWithArm & {
  kind: AnnotationKind.CIRCLE;
  radiusInMeters: number;
};

export type Annotation = TextAnnotation | PointAnnotation | ArrowAnnotation | CircleAnnotation;

export type AnnotationPropsPartial = Partial<Annotation>;
