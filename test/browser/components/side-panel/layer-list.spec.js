// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import cloneDeep from 'lodash.clonedeep';

import {fireEvent, screen} from '@testing-library/react';
import {dataTestIds} from '@kepler.gl/constants';
import {appInjector, LayerListFactory} from '@kepler.gl/components';
import {VisStateActions, UIStateActions, addDataToMap, keplerGlInit} from '@kepler.gl/actions';
import {processCsvData} from '@kepler.gl/processors';
import {keplerGlReducerCore as keplerGlReducer} from '@kepler.gl/reducers';

import {renderWithTheme} from '../../../helpers/component-jest-utils';
import testLayerData from '../../../fixtures/test-layer-data';
import {dataId as csvDataId} from '../../../fixtures/test-csv-data';

// TODO: need to be deleted and imported from raw-states
const InitialState = keplerGlReducer(undefined, keplerGlInit({}));

function applyActions(reducer, initialState, actions) {
  const actionQ = Array.isArray(actions) ? actions : [actions];

  return actionQ.reduce(
    (updatedState, {action, payload}) => reducer(updatedState, action(...payload)),
    initialState
  );
}

function mockStateWithMultipleH3Layers() {
  const initialState = cloneDeep(InitialState);
  const prepareState = applyActions(keplerGlReducer, initialState, [
    {
      action: addDataToMap,
      payload: [
        {
          datasets: {
            info: {id: csvDataId},
            data: processCsvData(testLayerData)
          },
          config: {
            version: 'v1',
            config: {
              visState: {
                layers: [
                  {
                    id: 'h3-layer-1',
                    type: 'hexagonId',
                    config: {
                      dataId: csvDataId,
                      label: 'H3 Hexagon 1',
                      color: [255, 153, 31],
                      columns: {hex_id: 'hex_id'},
                      isVisible: true
                    }
                  },
                  {
                    id: 'h3-layer-2',
                    type: 'hexagonId',
                    config: {
                      dataId: csvDataId,
                      label: 'H3 Hexagon 2',
                      color: [255, 153, 31],
                      columns: {hex_id: 'hex_id'},
                      isVisible: true
                    }
                  }
                ]
              }
            }
          }
        }
      ]
    }
  ]);
  return prepareState;
}

const LayerList = appInjector.get(LayerListFactory);

const StateWMultiH3Layers = mockStateWithMultipleH3Layers();

const defaultProps = {
  datasets: StateWMultiH3Layers.visState.datasets,
  layerClasses: StateWMultiH3Layers.visState.layerClasses,
  layerOrder: StateWMultiH3Layers.visState.layerOrder,
  layers: StateWMultiH3Layers.visState.layers,
  uiStateActions: UIStateActions,
  visStateActions: VisStateActions
};

// jest.mock('@kepler.gl/actions');

describe('Components -> SidePanel -> LayerPanel -> LayerList', () => {
  it('render sortable list', () => {
    renderWithTheme(<LayerList {...defaultProps} isSortable />);

    expect(screen.getAllByTestId(dataTestIds.sortableLayerItem)).toHaveLength(
      defaultProps.layers.length
    );
    screen
      .getAllByTestId(dataTestIds.layerTitleEditor)
      .forEach((item, index) => expect(item.value).toBe(defaultProps.layers[index].config.label));
    expect(screen.getAllByTestId(dataTestIds.layerPanel)).toHaveLength(defaultProps.layers.length);
  });

  it('render non-sortable list', () => {
    renderWithTheme(<LayerList {...defaultProps} isSortable={false} />);

    // no sortable items
    expect(screen.queryByTestId(dataTestIds.sortableLayerItem)).not.toBeInTheDocument();

    // only static ones
    expect(screen.getAllByTestId(dataTestIds.staticLayerItem)).toHaveLength(
      defaultProps.layers.length
    );
    screen
      .getAllByTestId(dataTestIds.layerTitleEditor)
      .forEach((item, index) => expect(item.value).toBe(defaultProps.layers[index].config.label));
    expect(screen.getAllByTestId(dataTestIds.layerPanel)).toHaveLength(defaultProps.layers.length);
  });

  it('pass null entries as layers', () => {
    const layers = defaultProps.layers;
    layers[0] = null;
    const removeLayer = jest.fn();
    renderWithTheme(
      <LayerList
        {...defaultProps}
        isSortable={false}
        layers={layers}
        visStateActions={{
          ...defaultProps.visStateActions,
          removeLayer
        }}
      />
    );

    expect(screen.getAllByTestId(dataTestIds.layerPanel)).toHaveLength(
      defaultProps.layers.length - 1
    );
    expect(screen.getByTestId(dataTestIds.removeLayerAction)).toBeInTheDocument();
    const removeLayerButton = screen.getByTestId(dataTestIds.removeLayerAction);
    fireEvent.click(removeLayerButton);

    expect(removeLayer).toBeCalled();
  });
});
