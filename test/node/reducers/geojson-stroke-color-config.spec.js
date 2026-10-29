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
import {setInitialLayerConfig} from '../../../src/reducers/src/vis-state-updaters';

import {geojsonData} from '../../fixtures/geojson';

const reducer = visStateReducer;

describe('default fill color initialization and saved configs', () => {
  let dataset;
  const layerTypes = ['a5', 's2', 'geohash', 'hexagonId', 'point', 'icon'];
  const columnsByType = {
    a5: {token: 'a5'},
    s2: {token: 's2'},
    geohash: {token: 'geohash'},
    hexagonId: {hex_id: 'h3'},
    point: {lat: 'lat', lng: 'lng'},
    icon: {lat: 'lat', lng: 'lng', icon: 'icon'}
  };

  beforeAll(async () => {
    dataset = new KeplerTable({info: {id: 'default-fill'}});
    await dataset.importData({
      data: {
        fields: [
          {name: 'lat', type: 'real'},
          {name: 'lng', type: 'real'},
          {name: 'a5', type: 'string'},
          {name: 's2', type: 'string'},
          {name: 'geohash', type: 'string'},
          {name: 'h3', type: 'h3'},
          {name: 'icon', type: 'string'},
          {name: 'score', type: 'real'},
          {name: 'count', type: 'integer'}
        ],
        rows: [0, 1].map(index => [
          37.7 + index / 100,
          -122.4 + index / 100,
          '9ca4cf8000000000',
          '8085809',
          '9q8yyk',
          '8928308280fffff',
          'marker',
          index + 0.25,
          index + 10
        ])
      }
    });
  });

  test.each(layerTypes)('initializes fill color for a manually added %s layer', type => {
    const layer = new INITIAL_VIS_STATE.layerClasses[type]({dataId: dataset.id});
    const initialized = setInitialLayerConfig(
      layer,
      {[dataset.id]: dataset},
      INITIAL_VIS_STATE.layerClasses
    );
    expect(initialized.config.colorField?.name).toBe('score');
    expect(initialized.config.colorDomain).toEqual([0.25, 1.25]);
  });

  describe.each(layerTypes)('%s saved colors', type => {
    test.each([
      ['explicit integer', {name: 'count', type: 'integer'}],
      ['explicit null', null],
      ['omitted field', undefined]
    ])('preserves %s', (_name, colorField) => {
      const layer = validateLayerWithData(
        dataset,
        {
          id: `saved-${type}`,
          type,
          config: {
            dataId: dataset.id,
            columns: columnsByType[type],
            color: [12, 34, 56],
            visConfig: {filled: true}
          },
          visualChannels: {
            ...(colorField !== undefined ? {colorField} : {}),
            colorScale: 'quantize'
          }
        },
        INITIAL_VIS_STATE.layerClasses
      );

      expect(layer).not.toBeNull();
      expect(layer.config.colorField?.name ?? null).toBe(colorField?.name ?? null);
      expect(layer.config.color).toEqual([12, 34, 56]);
      if (colorField) {
        layer.updateLayerDomain({[dataset.id]: dataset});
        expect(layer.config.colorScale).toBe('quantize');
        expect(layer.config.colorDomain).toEqual([10, 11]);
      }
    });
  });

  test.each(['grid', 'hexagon', 'cluster', 'heatmap'])(
    'preserves the %s count or density default',
    type => {
      const layer = new INITIAL_VIS_STATE.layerClasses[type]({dataId: dataset.id});
      const initialized = setInitialLayerConfig(
        layer,
        {[dataset.id]: dataset},
        INITIAL_VIS_STATE.layerClasses
      );
      expect(initialized.config.colorField).toBeNull();
      const channel = type === 'heatmap' ? 'weight' : 'color';
      expect(initialized.visualChannels[channel].defaultMeasure).toBe(
        type === 'heatmap' ? 'property.density' : 'property.pointCount'
      );
      if (type === 'heatmap') {
        expect(initialized.config.weightField).toBeNull();
      }
    }
  );
});

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
  let datasetWithRealColor;

  beforeAll(async () => {
    ({fields, rows} = processGeojson(cloneDeep(geojsonData)));
    dataset = new KeplerTable({info: {id: 'traffic-data'}});
    await dataset.importData({data: {fields, rows}});

    const geojsonWithRealColor = cloneDeep(geojsonData);
    geojsonWithRealColor.features.forEach((feature, index) => {
      feature.properties.score = index + 0.5;
    });
    const realColorData = processGeojson(geojsonWithRealColor);
    datasetWithRealColor = new KeplerTable({info: {id: 'real-color-data'}});
    await datasetWithRealColor.importData({data: realColorData});
  });

  test('validateLayerWithData preserves an explicit saved fill field', () => {
    const savedConfig = {
      id: 'saved-fill-field',
      type: 'geojson',
      config: {
        dataId: 'real-color-data',
        label: 'Saved Fill Field',
        columns: {geojson: '_geojson'},
        isVisible: true,
        visConfig: {stroked: true, filled: true}
      },
      visualChannels: {
        colorField: {name: 'score', type: 'real'},
        colorScale: 'quantile'
      }
    };

    const layer = validateLayerWithData(
      datasetWithRealColor,
      savedConfig,
      INITIAL_VIS_STATE.layerClasses
    );
    expect(layer.config.colorField?.name).toBe('score');
    layer.updateLayerDomain({'real-color-data': datasetWithRealColor});
    expect(layer.config.colorDomain).toEqual([0.5, 1.5, 2.5, 3.5, 4.5]);
  });

  test('validateLayerWithData preserves an explicit null fill field', () => {
    const savedConfig = {
      id: 'saved-null-fill-field',
      type: 'geojson',
      config: {
        dataId: 'real-color-data',
        label: 'Saved Null Fill Field',
        columns: {geojson: '_geojson'},
        isVisible: true,
        visConfig: {stroked: true, filled: true}
      },
      visualChannels: {
        colorField: null,
        colorScale: 'quantile'
      }
    };

    const layer = validateLayerWithData(
      datasetWithRealColor,
      savedConfig,
      INITIAL_VIS_STATE.layerClasses
    );
    expect(layer.config.colorField).toBeNull();
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
