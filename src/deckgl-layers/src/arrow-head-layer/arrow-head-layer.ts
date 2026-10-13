// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import type {ScatterplotLayerProps} from '@deck.gl/layers';
import {ScatterplotLayer} from '@deck.gl/layers';

import type {ScatterplotIconLayerProps} from '../svg-icon-layer/scatterplot-icon-layer';
import ScatterplotIconLayer, {iconFragmentShader} from '../svg-icon-layer/scatterplot-icon-layer';

type ArrowHeadLayerProps = ScatterplotIconLayerProps & {
  getAngle?: ScatterplotLayerProps['getRadius'];
  getSourcePosition?: ScatterplotLayerProps<any>['getPosition'];
  getTargetPosition?: ScatterplotLayerProps<any>['getPosition'];
  getFilterValue?: (d: any) => number[];
  filterRange?: unknown;
  brushingEnabled?: boolean;
  brushingRadius?: number;
  brushingTarget?: string;
  getBrushingTarget?: (d: any) => number[];
  hidden?: boolean;
};

export const ARROW_HEAD_SHAPES = ['chevron', 'triangle', 'stealth'] as const;
export type ArrowHeadShape = (typeof ARROW_HEAD_SHAPES)[number];

// Tip at the origin, body toward -y. Angle 0 points up; positive angles turn clockwise.
const TRIANGLE = [0, 0, 0, -0.45, -1, 0, 0.45, -1, 0];
const CHEVRON = [0, 0, 0, -0.55, -1, 0, 0, -0.55, 0, 0, 0, 0, 0, -0.55, 0, 0.55, -1, 0];
const STEALTH = [0, 0, 0, -0.22, -1, 0, 0, -0.7, 0, 0, 0, 0, 0, -0.7, 0, 0.22, -1, 0];

const GEOMETRIES: Record<ArrowHeadShape, number[]> = {
  triangle: TRIANGLE,
  chevron: CHEVRON,
  stealth: STEALTH
};

export function getArrowHeadGeometry(shape: string): number[] {
  if (shape === 'chevron' || shape === 'stealth') {
    return GEOMETRIES[shape];
  }
  return TRIANGLE;
}

type ShaderInject = Record<string, string>;

/**
 * deck.gl emits hook functions (DECKGL_FILTER_SIZE) before the main shader
 * source. An `in` added to that source is still undeclared inside the hook.
 * Declare the angle on `vs:#decl`, which is injected before the hooks.
 */
export function withArrowHeadVertexInject(inject: ShaderInject = {}): ShaderInject {
  const decl = inject['vs:#decl'] || '';
  const filterSize = inject['vs:DECKGL_FILTER_SIZE'] || '';
  const filterPosition = inject['vs:DECKGL_FILTER_GL_POSITION'] || '';

  return {
    ...inject,
    'vs:#decl': `${decl}in float instanceAngles;
in vec3 instanceSourcePositions;
in vec3 instanceTargetPositions;\n`,
    'vs:DECKGL_FILTER_GL_POSITION': `
      geometry.worldPosition = instanceSourcePositions;
      geometry.worldPositionAlt = instanceTargetPositions;
      ${filterPosition}
    `,
    'vs:DECKGL_FILTER_SIZE': `${filterSize}
      float arrowAngle = radians(instanceAngles);
      float arrowCos = cos(arrowAngle);
      float arrowSin = sin(arrowAngle);
      size.xy = mat2(arrowCos, -arrowSin, arrowSin, arrowCos) * size.xy;
    `
  };
}

/**
 * Screen-aligned arrowhead. ScatterplotIconLayer draws a mesh in pixel space;
 * instanceAngles rotates that mesh around the tip.
 */
export default class ArrowHeadLayer extends ScatterplotIconLayer {
  static layerName = 'ArrowHeadLayer';

  constructor(props: ArrowHeadLayerProps) {
    super(props);
  }

  initializeState() {
    // Add the angle before the scatterplot model is built so the buffer layout
    // includes it on the first compile.
    this.getAttributeManager()!.addInstanced({
      instanceAngles: {
        size: 1,
        transition: true,
        accessor: 'getAngle',
        defaultValue: 0
      },
      instanceSourcePositions: {
        size: 3,
        type: 'float64',
        fp64: this.use64bitPositions(),
        transition: true,
        accessor: 'getSourcePosition'
      },
      instanceTargetPositions: {
        size: 3,
        type: 'float64',
        fp64: this.use64bitPositions(),
        transition: true,
        accessor: 'getTargetPosition'
      }
    });
    super.initializeState();
  }

  getShaders() {
    // Skip ScatterplotIconLayer: its shader inject replaces extension hooks
    // (data filter, brushing) and scales the mesh for the globe.
    const shaders = ScatterplotLayer.prototype.getShaders.call(this);

    return {
      ...shaders,
      fs: iconFragmentShader,
      inject: withArrowHeadVertexInject(shaders.inject || {})
    };
  }

  draw(opts) {
    ScatterplotLayer.prototype.draw.call(this, opts);
  }
}
