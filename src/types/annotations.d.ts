// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {
  AnnotationKind,
  AnnotationTextSide,
  AnnotationTextVerticalPosition
} from '@kepler.gl/constants';
import {LayerPropertyTransition} from './layers';

export {AnnotationKind} from '@kepler.gl/constants';
export {isAnnotationKind, isAnnotationWithArm} from '@kepler.gl/constants';

export type ViewportAnnotationAnchor =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

export type ViewportAnnotationPlacement = {
  anchor: ViewportAnnotationAnchor;
  /** Horizontal and vertical inset in composition CSS pixels. */
  margin: [number, number];
};

export type AnnotationReadout = (
  | {type: 'time'; /** UTC Moment format; defaults to YYYY-MM-DD. */ format?: string}
  | {
      type: 'count';
      /** Count rows passing the dataset's current filters, including GPU filters. */ dataId: string;
    }
) & {
  /** Show the dynamic value above the caption. Omitted means below. */
  position?: 'first';
};

export type BaseAnnotation = {
  id: string;
  kind: AnnotationKind;
  isVisible: boolean;
  propertyTransitions?: Record<string, LayerPropertyTransition[]>;
  autoSize: boolean;
  autoSizeY: boolean;
  /** [lng, lat] or [lng, lat, altitudeMeters]. Missing altitude is treated as 0. */
  anchorPoint: [number, number] | [number, number, number];
  label: string;
  /** Present only on TEXT captions. Omitted means geographic placement. */
  viewport?: ViewportAnnotationPlacement;
  /** A dynamic value for viewport captions. Missing values render an em dash. */
  readout?: AnnotationReadout;
  editorState?: Record<string, any>;
  mapIndex?: number;
  lineColor: string;
  lineWidth: number;
  textWidth: number;
  textHeight: number;
  textVerticalAlign?: 'top' | 'middle' | 'bottom';
  textSide?: AnnotationTextSide;
  textVerticalPosition?: AnnotationTextVerticalPosition;
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

export type RulerAnnotation = BaseAnnotation & {
  kind: AnnotationKind.RULER;
  /** Second [lng, lat] or [lng, lat, altitudeMeters] endpoint. */
  endPoint: [number, number] | [number, number, number];
  /** Whether the user-authored rich text is rendered at the ruler midpoint. */
  showCustomText: boolean;
  /** Whether the computed geodesic length is rendered at the ruler midpoint. */
  showDistance: boolean;
};

export type Annotation =
  | TextAnnotation
  | PointAnnotation
  | ArrowAnnotation
  | CircleAnnotation
  | RulerAnnotation;

export type AnnotationPropsPartial = Partial<Annotation>;
