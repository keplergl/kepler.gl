// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ColumnLayer, ColumnLayerProps} from '@deck.gl/layers';
import {UNIT} from '@deck.gl/core';

import {editShader} from '../';

// deck.gl 9 / luma 9 sets custom uniforms via UBO-backed shader modules (Model has
// no setUniforms). This module exposes the globe-mode flag to the shader.
const globeModeUniforms = {
  name: 'globeMode',
  vs: `layout(std140) uniform globeModeUniforms {
  float globeMode;
} globeModeProps;
`,
  uniformTypes: {
    globeMode: 'f32'
  }
} as const;

function addInstanceCoverage(vs: string) {
  const addDecl = editShader(
    vs,
    'hexagon cell vs add instance 1',
    'in float instanceElevations;',
    `in float instanceElevations;
     in float instanceCoverage;`
  );

  return editShader(
    addDecl,
    'hexagon cell vs add instance 2',
    'float dotRadius = column.radius * column.coverage * shouldRender;',
    'float dotRadius = column.radius * column.coverage * instanceCoverage * shouldRender;'
  );
}

function addGlobeScaling(vs: string) {
  return editShader(
    vs,
    'hexagon cell vs globe scale mod',
    'vec2 offset = (rotationMatrix * positions.xy * strokeOffsetRatio + column.offset) * dotRadius;',
    `float radiusGlobeMod = globeModeProps.globeMode > 0.5 ? sin((90.0 - abs(geometry.worldPosition.y)) * PI / 180.0) * PI : 1.0;
      vec2 offset = (rotationMatrix * positions.xy * strokeOffsetRatio + column.offset) * dotRadius * radiusGlobeMod;`
  );
}

type EnhancedColumnLayerProps = ColumnLayerProps<any> & {
  strokeOpacity: number;
};

class EnhancedColumnLayer extends ColumnLayer<any, EnhancedColumnLayerProps> {
  getShaders() {
    const shaders = super.getShaders();

    const vs = addGlobeScaling(addInstanceCoverage(shaders.vs));

    return {
      ...shaders,
      vs,
      modules: [...(shaders.modules || []), globeModeUniforms]
    };
  }

  initializeState() {
    super.initializeState();

    this.getAttributeManager()?.addInstanced({
      instanceCoverage: {size: 1, accessor: 'getCoverage'}
    });
  }

  draw({uniforms: _uniforms}) {
    const {
      lineWidthUnits,
      lineWidthScale,
      lineWidthMinPixels,
      lineWidthMaxPixels,
      radiusUnits,
      elevationScale,
      extruded,
      filled,
      stroked,
      strokeOpacity,
      wireframe,
      offset,
      coverage,
      radius,
      angle
    } = this.props;
    const fillModel = this.state.fillModel;
    const strokeModel = this.state.strokeModel;
    const wireframeModel = this.state.wireframeModel;
    const {edgeDistance} = this.state;

    const globeMode = (this.context.viewport as any).resolution ? 1.0 : 0.0;

    const columnProps = {
      radius,
      angle: (angle / 180) * Math.PI,
      offset,
      extruded,
      stroked,
      coverage,
      elevationScale,
      edgeDistance,
      radiusUnits: UNIT[radiusUnits],
      widthUnits: UNIT[lineWidthUnits],
      widthScale: lineWidthScale,
      widthMinPixels: lineWidthMinPixels,
      widthMaxPixels: lineWidthMaxPixels
    };

    if (extruded && wireframe && wireframeModel) {
      wireframeModel.shaderInputs.setProps({
        column: {...columnProps, isStroke: true},
        globeMode: {globeMode}
      });
      wireframeModel.draw(this.context.renderPass);
    }
    if (filled && fillModel) {
      fillModel.shaderInputs.setProps({
        column: {...columnProps, isStroke: false},
        globeMode: {globeMode}
      });
      fillModel.draw(this.context.renderPass);
    }
    if (!extruded && stroked && strokeModel) {
      strokeModel.shaderInputs.setProps({
        column: {...columnProps, isStroke: true},
        layer: {opacity: strokeOpacity ?? this.props.opacity},
        globeMode: {globeMode}
      });
      strokeModel.draw(this.context.renderPass);
    }
  }
}

EnhancedColumnLayer.layerName = 'EnhancedColumnLayer';

export default EnhancedColumnLayer;
