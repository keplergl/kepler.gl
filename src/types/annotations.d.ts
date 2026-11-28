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

export type AnnotationReadout =
  | {type: 'time'; /** UTC Moment format; defaults to YYYY-MM-DD. */ format?: string}
  | {
      type: 'count';
      /** Count rows passing the dataset's current filters, including GPU filters. */ dataId: string;
    };

export type AnnotationLabelBackground = {
  color: string;
  opacity: number;
  /** Padding on each side, in composition CSS pixels. */
  padding: number;
};

/** Omitted settings preserve the legacy ruler appearance. */
export type RulerStyle = {
  unit: 'auto' | 'm' | 'km';
  precision: number;
  prefix: string;
  suffix: string;
  placement: 'above' | 'below';
  /** Distance from the projected measurement, in composition CSS pixels. */
  offset: number;
  dimensionLine: boolean;
  startLabel: string;
  endLabel: string;
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
  labelBackground?: AnnotationLabelBackground;
  /** Present only on TEXT captions. Omitted means geographic placement. */
  viewport?: ViewportAnnotationPlacement;
  /** Rendered below the caption label. Missing values render an em dash. */
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
  elevation?: AnnotationElevation;
};

export type ElevationUnit = 'm' | 'km' | 'ft';

/** A map height or a captured measurement independent of rendering altitude. */
export type AnnotationElevation = {
  /** Omitted preserves captured-measurement behavior in existing saved callouts. */
  source?: 'map' | 'measurement';
  /** Null means no valid measurement has been captured. */
  value: number | null;
  unit: ElevationUnit;
  /** Named vertical datum, e.g. MSL; unknown cannot be used for a difference. */
  datum: string;
  /** Selecting a field captures its value when the anchor is next dragged onto a feature. */
  field?: {dataId: string; name: string};
  reference: {
    value: number;
    unit: ElevationUnit;
    datum: string;
    /** Rendering height in metres. Omitted means the reference value converted to metres. */
    displayZ?: number;
  } | null;
  display: 'altitude' | 'relative' | 'both';
  outputUnit: ElevationUnit;
  precision: number;
  guide: 'none' | 'solid' | 'dashed';
  marker: 'none' | 'dot' | 'ring';
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
  rulerStyle?: RulerStyle;
};

export type Annotation =
  | TextAnnotation
  | PointAnnotation
  | ArrowAnnotation
  | CircleAnnotation
  | RulerAnnotation;

export type AnnotationPropsPartial = Partial<Annotation>;
