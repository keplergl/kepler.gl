// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Programmatic GeoJSON stroke color (addDataToMap visualChannels +
// layerVisualChannelConfigChange with {name, type}) must bind the dataset
// field so strokeColorDomain is calculated from data, not left at [0, 1].

import {drainTasksForTesting, succeedTaskWithValues} from '@kepler.gl/tasks';
import {KeplerTable} from '@kepler.gl/table';
import {VisStateActions} from '@kepler.gl/actions';
import {visStateReducer, INITIAL_VIS_STATE, validateLayerWithData} from '@kepler.gl/reducers';
import {processGeojson} from '@kepler.gl/processors';
import cloneDeep from 'es-toolkit/compat/cloneDeep';

import {geojsonData} from '../../fixtures/geojson';

const reducer = visStateReducer;

const mockCreateNewDataEntry = ({info, color, opts, data}) => {
  const table = new KeplerTable({info, color, ...opts});
  table.importData({data});
  return table;
};

const applyCreateTableTasks = (tasks, state) =>
  tasks.reduce((acc, task) => {
    if (!task.label.includes('CREATE_TABLE_TASK')) return acc;
    const tables = task.payload.map(payload => mockCreateNewDataEntry(payload));
    return reducer(acc, succeedTaskWithValues(task, tables));
  }, state);

function applyAction(state, action) {
  let newState = reducer(state, action);
  const tasks = drainTasksForTesting();
  newState = applyCreateTableTasks(tasks, newState);
  return newState;
}

describe('geojson strokeColor programmatic config', () => {
  let fields;
  let rows;
  let dataset;

  beforeAll(async () => {
    ({fields, rows} = processGeojson(cloneDeep(geojsonData)));
    dataset = new KeplerTable({info: {id: 'traffic-data'}});
    await dataset.importData({data: {fields, rows}});
  });

  test('validateLayerWithData binds strokeColorField nested inside config', () => {
    const nestedConfig = {
      id: 'traffic-layer-nested',
      type: 'geojson',
      config: {
        dataId: 'traffic-data',
        label: 'Traffic Layer',
        columns: {geojson: '_geojson'},
        isVisible: true,
        visConfig: {stroked: true, filled: false},
        visualChannels: {
          strokeColorField: {name: 'TRIPS', type: 'integer'},
          strokeColorScale: 'quantize'
        }
      }
    };

    const layer = validateLayerWithData(dataset, nestedConfig, INITIAL_VIS_STATE.layerClasses);
    expect(layer).toBeTruthy();
    expect(layer.config.strokeColorField?.name).toBe('TRIPS');
    expect(layer.config.strokeColorScale).toBe('quantize');
    layer.updateLayerDomain({'traffic-data': dataset});
    expect(layer.config.strokeColorDomain).toEqual([4, 20]);
  });

  test('validateLayerWithData binds sibling visualChannels without schema parse', () => {
    const siblingConfig = {
      id: 'traffic-layer-sibling',
      type: 'geojson',
      config: {
        dataId: 'traffic-data',
        label: 'Traffic Layer',
        columns: {geojson: '_geojson'},
        isVisible: true,
        visConfig: {stroked: true, filled: false}
      },
      visualChannels: {
        strokeColorField: {name: 'TRIPS', type: 'integer'},
        strokeColorScale: 'quantize'
      }
    };

    const layer = validateLayerWithData(dataset, siblingConfig, INITIAL_VIS_STATE.layerClasses);
    expect(layer.config.strokeColorField?.name).toBe('TRIPS');
    layer.updateLayerDomain({'traffic-data': dataset});
    expect(layer.config.strokeColorDomain).toEqual([4, 20]);
  });

  test('layerVisualChannelConfigChange resolves {name, type} to dataset field', () => {
    const initialState = applyAction(
      {...INITIAL_VIS_STATE},
      VisStateActions.updateVisData([
        {
          info: {id: 'traffic-data', label: 'Traffic Data'},
          data: {fields, rows}
        }
      ])
    );

    const geojsonLayer = initialState.layers.find(l => l.type === 'geojson');
    expect(geojsonLayer).toBeTruthy();

    const nextState = reducer(
      initialState,
      VisStateActions.layerVisualChannelConfigChange(
        geojsonLayer,
        {
          strokeColorField: {name: 'TRIPS', type: 'integer'},
          strokeColorScale: 'quantize'
        },
        'strokeColor'
      )
    );

    const updated = nextState.layers.find(l => l.id === geojsonLayer.id);
    expect(updated.config.strokeColorField?.name).toBe('TRIPS');
    expect(typeof updated.config.strokeColorField?.valueAccessor).toBe('function');
    expect(updated.config.strokeColorScale).toBe('quantize');
    expect(updated.config.strokeColorDomain).toEqual([4, 20]);
  });

  test('layerVisualChannelConfigChange resolves processGeojson fields', () => {
    const processorField = fields.find(f => f.name === 'TRIPS');
    expect(processorField).toBeTruthy();

    const initialState = applyAction(
      {...INITIAL_VIS_STATE},
      VisStateActions.updateVisData([
        {
          info: {id: 'traffic-data', label: 'Traffic Data'},
          data: {fields, rows}
        }
      ])
    );
    const geojsonLayer = initialState.layers.find(l => l.type === 'geojson');

    const nextState = reducer(
      initialState,
      VisStateActions.layerVisualChannelConfigChange(
        geojsonLayer,
        {strokeColorField: {...processorField}, strokeColorScale: 'quantize'},
        'strokeColor'
      )
    );

    expect(nextState.layers.find(l => l.id === geojsonLayer.id).config.strokeColorDomain).toEqual([
      4, 20
    ]);
  });
});
