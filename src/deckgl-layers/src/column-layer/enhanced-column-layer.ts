// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ColumnLayer, ColumnLayerProps} from '@deck.gl/layers';
import {UNIT} from '@deck.gl/core';

import {editShader} from '../';

function addInstanceCoverage(vs: string) {
  const addDecl = editShader(
    vs,
    'hexagon cell vs add instance 1',
    'in vec3 instancePickingColors;',
    `in vec3 instancePickingColors;
     in float instanceCoverage;`
  );

  return editShader(
    addDecl,
    'hexagon cell vs add instance 2',
    'float dotRadius = column.radius * column.coverage * shouldRender;',
    'float dotRadius = column.radius * column.coverage * instanceCoverage * shouldRender;'
  );
}

type EnhancedColumnLayerProps = ColumnLayerProps<any> & {
  strokeOpacity: number;
};

class EnhancedColumnLayer extends ColumnLayer<any, EnhancedColumnLayerProps> {
  getShaders() {
    const shaders = super.getShaders();

    return {
      ...shaders,
      vs: addInstanceCoverage(shaders.vs)
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
    const wireframeModel = this.state.wireframeModel;
    const {fillVertexCount, edgeDistance} = this.state;

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
        column: {...columnProps, isStroke: true}
      });
      wireframeModel.draw(this.context.renderPass);
    }
    if (filled && fillModel) {
      fillModel.setVertexCount(fillVertexCount);
      fillModel.shaderInputs.setProps({
        column: {...columnProps, isStroke: false}
      });
      fillModel.draw(this.context.renderPass);
    }
    if (!extruded && stroked && fillModel) {
      fillModel.setVertexCount((fillVertexCount * 2) / 3);
      fillModel.shaderInputs.setProps({
        column: {...columnProps, isStroke: true},
        layer: {opacity: strokeOpacity ?? this.props.opacity}
      });
      fillModel.draw(this.context.renderPass);
      // Restore original vertex count and opacity so subsequent passes are unaffected
      fillModel.setVertexCount(fillVertexCount);
      fillModel.shaderInputs.setProps({
        layer: {opacity: this.props.opacity}
      });
    }
  }
}

EnhancedColumnLayer.layerName = 'EnhancedColumnLayer';

export default EnhancedColumnLayer;
