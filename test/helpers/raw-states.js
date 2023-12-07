// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import cloneDeep from 'lodash.clonedeep';

import {keplerGlReducer} from '@kepler.gl/reducers';
import {addDataToMap} from '@kepler.gl/actions';
import {processCsvData} from '@kepler.gl/processors';

import {dataId as csvDataId} from '../fixtures/test-csv-data';
import testLayerData from '../fixtures/test-layer-data';

export function applyActions(reducer, initialState, actions) {
  const actionQ = Array.isArray(actions) ? actions : [actions];

  return actionQ.reduce(
    (updatedState, {action, payload}) => reducer(updatedState, action(...payload)),
    initialState
  );
}

export const InitialState = keplerGlReducer(undefined, {});

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

export const StateWMultiH3Layers = mockStateWithMultipleH3Layers();
