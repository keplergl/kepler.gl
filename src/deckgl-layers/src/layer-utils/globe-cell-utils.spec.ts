// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {makeGlobeCellLayerClass} from './globe-cell-utils';

function makeFakeCellLayerClass() {
  return class FakeCellLayer {
    state: {
      fillModel?: {shaderInputs: {setProps: jest.Mock}};
      colorTexture?: {id: string};
    } = {};
    context = {viewport: {}};

    getShaders() {
      return {
        vs: 'void main(void) { gl_Position = project_common_position_to_clipspace(geometry.position); }',
        modules: []
      };
    }

    // deck.gl ColumnLayer recreates fillModel on extensionsChanged and does not
    // copy over the colorRange texture binding. GridCellLayer / HexagonCellLayer
    // only bind that texture when the colorRange *prop* changes.
    updateState() {
      this.state.fillModel = {shaderInputs: {setProps: jest.fn()}};
    }

    draw(_opts?: unknown) {
      // no-op stub so GlobeCellLayer.draw can call super.draw()
    }
  };
}

describe('globe-cell-utils colorRange rebind', () => {
  test('rebinds colorRange onto a rebuilt fillModel (grid)', () => {
    const GlobeGridCell = makeGlobeCellLayerClass(makeFakeCellLayerClass(), 'grid');
    const layer = new GlobeGridCell();
    layer.state.colorTexture = {id: 'color-range-tex'};

    layer.updateState({
      changeFlags: {extensionsChanged: true},
      props: {colorRange: ['#fff']},
      oldProps: {colorRange: ['#fff']}
    });

    expect(layer.state.fillModel?.shaderInputs.setProps).toHaveBeenCalledWith({
      grid: {colorRange: layer.state.colorTexture}
    });
  });

  test('rebinds colorRange onto a rebuilt fillModel (hexagon)', () => {
    const GlobeHexCell = makeGlobeCellLayerClass(makeFakeCellLayerClass(), 'hexagon');
    const layer = new GlobeHexCell();
    layer.state.colorTexture = {id: 'color-range-tex'};

    layer.updateState({
      changeFlags: {extensionsChanged: true},
      props: {colorRange: ['#fff']},
      oldProps: {colorRange: ['#fff']}
    });

    expect(layer.state.fillModel?.shaderInputs.setProps).toHaveBeenCalledWith({
      hexagon: {colorRange: layer.state.colorTexture}
    });
  });

  test('draw also rebinds colorRange so the first frame after rebuild is valid', () => {
    const GlobeGridCell = makeGlobeCellLayerClass(makeFakeCellLayerClass(), 'grid');
    const layer = new GlobeGridCell();
    const setProps = jest.fn();
    layer.state.colorTexture = {id: 'color-range-tex'};
    layer.state.fillModel = {shaderInputs: {setProps}};

    layer.draw({});

    expect(setProps).toHaveBeenCalledWith({
      grid: {colorRange: layer.state.colorTexture}
    });
  });
});
