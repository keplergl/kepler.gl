// @ts-nocheck
// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ColumnLayer, ColumnLayerProps} from '@deck.gl/layers';

import {editShader} from '../';

function addInstanceCoverage(vs) {
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
  strokeOpacity: any;
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
}

EnhancedColumnLayer.layerName = 'EnhancedColumnLayer';

export default EnhancedColumnLayer;
