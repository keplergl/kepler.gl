// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {act} from 'react-dom/test-utils';
import test from 'tape-catch';
import global from 'global';
import sinon from 'sinon';
import flatten from 'es-toolkit/compat/flattenDeep';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import CloneDeep from 'es-toolkit/compat/cloneDeep';
import {VisStateActions} from '@kepler.gl/actions';
import {visStateReducer} from '@kepler.gl/reducers';

import {TOOLTIP_FORMATS} from '@kepler.gl/constants';
import {
  FieldTokenFactory,
  Icons,
  DataTableModalFactory,
  DatasetTabs,
  DatasetModalTab,
  DataTableFactory,
  OptionDropdown,
  appInjector,
  DropdownList,
  InputLight,
  DataTableConfigFactory,
  NumberFormatConfig
} from '@kepler.gl/components';
import {testFields, testAllData} from 'test/fixtures/test-csv-data';
import {geoStyleFields, geoStyleRows} from 'test/fixtures/geojson';
import {StateWFiles, testCsvDataId, testGeoJsonDataId} from 'test/helpers/mock-state';
import {STYLED_COMPONENTS_DUPLICATED_ENTRIES} from '../../../helpers/utils';

import {createDataContainer, getFieldFormatLabels, initApplicationConfig} from '@kepler.gl/utils';

const {VertThreeDots} = Icons;
const DataTableModal = appInjector.get(DataTableModalFactory);
const DataTable = appInjector.get(DataTableFactory);
const FieldToken = appInjector.get(FieldTokenFactory);

function mountDataTableModal(node) {
  return mountWithTheme(<IntlWrapper>{node}</IntlWrapper>);
}

const expectedCellSizeCache = {
  'gps_data.utc_timestamp': {row: 145, header: 150},
  'gps_data.lat': {row: 96, header: 108},
  'gps_data.lng': {row: 96, header: 110},
  'gps_data.types': {row: 125, header: 123},
  epoch: {row: 121, header: 90},
  has_result: {row: 75, header: 99},
  uid: {row: 75, header: 90},
  time: {row: 180, header: 90},
  begintrip_ts_utc: {row: 182, header: 129},
  begintrip_ts_local: {row: 182, header: 137},
  date: {row: 95, header: 90}
};

const expectedExpandedCellSize = {
  cellSizeCache: {
    'gps_data.utc_timestamp': 160,
    'gps_data.lat': 108,
    'gps_data.lng': 110,
    'gps_data.types': 125,
    epoch: 121,
    has_result: 99,
    uid: 90,
    time: 180,
    begintrip_ts_utc: 182,
    begintrip_ts_local: 182,
    date: 143
  },
  ghost: null
};

// This is to Mock Canvas.measureText response which we will not be testing
const testMeasure = [573, 17, 87, 566, 87, 447, 17, 87];
const texts = [
  [
    '{"type":"Polygon","coordinates":[[[-74.158491,40.835947],[-74.157914,40.83902],[-74.148473,40.834522]]]}',
    7.5,
    'C_Medium_High'
  ],
  [
    '{"type":"Polygon","coordinates":[[[-74.31687,40.656696],[-74.319449,40.658154],[-74.31687,40.656696]]]}',
    null,
    'C_Medium_High'
  ],
  [
    '{"type":"Polygon","coordinates":[[[-74.387589,40.632238],[-74.387589,40.632238]]]}',
    7.6,
    'C_Medium_High'
  ]
];
const testColumns = ['_geojson', 'income level of people over 65', 'engagement'];
const testColumnMeasure = [46, 159, 65];
function mockCanvas(globalWindow) {
  globalWindow.HTMLCanvasElement.prototype.getContext = function mockGetContext() {
    return {
      measureText: text => {
        const index = flatten(texts).indexOf(text);
        if (index >= 0) {
          return {width: testMeasure[index]};
        }
        const cIdx = testColumns.indexOf(text);
        if (cIdx >= 0) {
          return {width: testColumnMeasure[cIdx]};
        }
        return {width: 0};
      }
    };
  };
}

let oldGetContext;
function prepareMockCanvas() {
  oldGetContext = global.window.HTMLCanvasElement.prototype.getContext;
  mockCanvas(global.window);
}

function restoreMockCanvas() {
  global.window.HTMLCanvasElement.prototype.getContext = oldGetContext;
}

// eslint-disable-next-line max-statements
test('Components -> DataTableConfig', t => {
  const expectedColumns = ['gps_data.utc_timestamp'];

  const expectedColMeta = {
    'gps_data.utc_timestamp': {
      name: 'gps_data.utc_timestamp',
      type: 'timestamp',
      format: 'YYYY-M-D H:m:s'
    }
  };

  const columns = expectedColumns;
  const colMeta = expectedColMeta;
  const setColumnDisplayFormat = sinon.spy();
  const onClose = sinon.spy();

  const DataTableConfig = DataTableConfigFactory();
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <DataTableConfig
          columns={columns}
          colMeta={colMeta}
          setColumnDisplayFormat={setColumnDisplayFormat}
          onClose={onClose}
        />
      </IntlWrapper>
    );
  }, 'Show not fail without props');

  const numberFormatConfigInput = wrapper.find(NumberFormatConfig);
  t.equal(numberFormatConfigInput.length, 5, 'should render 5 NumberFormatConfig');

  numberFormatConfigInput.at(0).find(InputLight).simulate('click');

  const formatDropdown = wrapper.find(DropdownList);
  t.equal(formatDropdown.length, 1, 'should render 1 format dropdown');

  const integerDisplayOptions = formatDropdown.at(0).props().options;

  t.deepEqual(
    integerDisplayOptions,
    getFieldFormatLabels('integer'),
    'should render integer type formats'
  );

  numberFormatConfigInput.at(1).find(InputLight).simulate('click');

  const floatDisplayOptions = wrapper.find(DropdownList).at(1).props().options;

  t.deepEqual(floatDisplayOptions, getFieldFormatLabels('real'), 'should render real type formats');

  numberFormatConfigInput.at(2).find(InputLight).simulate('click');

  const timeDisplayOptions = wrapper.find(DropdownList).at(2).props().options;

  t.deepEqual(
    timeDisplayOptions,
    getFieldFormatLabels('timestamp'),
    'should render time type formats'
  );

  numberFormatConfigInput.at(3).find(InputLight).simulate('click');

  const dateDisplayOptions = wrapper.find(DropdownList).at(3).props().options;

  t.deepEqual(dateDisplayOptions, getFieldFormatLabels('date'), 'should render date type formats');

  t.end();
});

/* eslint-disable max-statements */
test('Components -> DataTableModal.render: csv 1', t => {
  t.doesNotThrow(() => {
    mountWithTheme(<DataTableModal />);
  }, 'Show not fail without data');

  const wrapper = mountDataTableModal(
    <DataTableModal datasets={StateWFiles.visState.datasets} dataId={testCsvDataId} />
  );

  t.equal(wrapper.find(DataTableModal).length, 1, 'should render DataTableModal data');
  t.equal(wrapper.find(DatasetTabs).length, 1, 'should render DatasetTabs');
  t.equal(wrapper.find(DatasetModalTab).length, 2, 'should render 1 DatasetModalTab');
  t.equal(wrapper.find(DataTable).length, 1, 'should render 1 DataTable');

  const props = wrapper.find(DataTable).at(0).props();
  const expectedColumns = [
    'gps_data.utc_timestamp',
    'gps_data.lat',
    'gps_data.lng',
    'gps_data.types',
    'epoch',
    'has_result',
    'uid',
    'time',
    'begintrip_ts_utc',
    'begintrip_ts_local',
    'date'
  ];

  const expectedColMeta = {
    'gps_data.utc_timestamp': {
      name: 'gps_data.utc_timestamp',
      colIdx: 0,
      type: 'timestamp',
      format: 'YYYY-M-D H:m:s'
    },
    'gps_data.lat': {name: 'gps_data.lat', colIdx: 1, type: 'real'},
    'gps_data.lng': {name: 'gps_data.lng', colIdx: 2, type: 'real'},
    'gps_data.types': {name: 'gps_data.types', colIdx: 3, type: 'string'},
    epoch: {name: 'epoch', colIdx: 4, type: 'timestamp', format: 'X'},
    has_result: {name: 'has_result', colIdx: 5, type: 'boolean'},
    uid: {name: 'uid', colIdx: 6, type: 'integer'},
    time: {name: 'time', colIdx: 7, type: 'timestamp', format: 'YYYY-M-DTHH:mm:ss.SSSS'},
    begintrip_ts_utc: {
      name: 'begintrip_ts_utc',
      colIdx: 8,
      type: 'timestamp',
      format: 'YYYY-M-D HH:mm:ssZZ'
    },
    begintrip_ts_local: {
      name: 'begintrip_ts_local',
      colIdx: 9,
      type: 'timestamp',
      format: 'YYYY-M-D HH:mm:ssZZ'
    },
    date: {name: 'date', colIdx: 10, type: 'date', format: 'YYYY-M-D'}
  };

  t.deepEqual(props.columns, expectedColumns, 'DataTable should have the correct props.columns');
  t.deepEqual(props.colMeta, expectedColMeta, 'DataTable should have the correct props.colMeta');
  t.equal(props.hasStats, true, 'DataTable should enable column stats by default');

  const datasetId = Object.keys(StateWFiles.visState.datasets)[0];

  t.equal(
    props.dataContainer,
    StateWFiles.visState.datasets[datasetId].dataContainer,
    'DataTable should have the correct props.dataContainer'
  );
  // we can't test it without mocking the canvas response
  t.deepEqual(
    Object.keys(props.cellSizeCache),
    Object.keys(expectedColMeta),
    'DataTable props.cellSizeCache should have all column keys'
  );

  t.end();
});

test('Components -> DataTableModal.render: disableColumnStats', t => {
  initApplicationConfig({enableColumnStats: false});
  try {
    const wrapper = mountDataTableModal(
      <DataTableModal datasets={StateWFiles.visState.datasets} dataId={testCsvDataId} />
    );
    const props = wrapper.find(DataTable).at(0).props();
    t.equal(props.hasStats, false, 'DataTable should disable column stats when config flag is off');
  } finally {
    initApplicationConfig({enableColumnStats: true});
  }
  t.end();
});

test('Components -> DataTableModal -> click tab', t => {
  const showDatasetTable = sinon.spy();

  const wrapper = mountDataTableModal(
    <DataTableModal
      datasets={StateWFiles.visState.datasets}
      dataId={testCsvDataId}
      showDatasetTable={showDatasetTable}
    />
  );

  t.equal(wrapper.find(DatasetModalTab).length, 2, 'should render 2 DatasetModalTab');
  t.equal(
    wrapper.find(DatasetModalTab).at(0).prop('$active'),
    true,
    'prop 0 active should be true'
  );
  t.equal(
    wrapper.find(DatasetModalTab).at(0).find('.dataset-name').text(),
    'hello.csv',
    'dataset name should be correct'
  );
  t.equal(
    wrapper.find(DatasetModalTab).at(1).prop('$active'),
    false,
    'prop 1 active should be false'
  );
  t.equal(
    wrapper.find(DatasetModalTab).at(1).find('.dataset-name').text(),
    'zip.geojson',
    'dataset name should be correct'
  );

  wrapper.find(DatasetModalTab).at(1).simulate('click');
  t.ok(showDatasetTable.calledWith(testGeoJsonDataId));

  t.end();
});

test('Components -> DataTableModal -> toggle filtered data', t => {
  const fields = [{name: 'name', type: 'string', displayName: 'name', fieldIdx: 0}];
  const rows = [['a'], ['b'], ['c'], ['d']];
  const dataContainer = createDataContainer(rows, {fields});
  const otherContainer = createDataContainer([['x'], ['y']], {fields});
  const sortOrder = [3, 1, 0, 2];

  const smoothie = {
    id: 'smoothie',
    label: 'smoothie',
    color: [113, 113, 113],
    dataContainer,
    fields,
    allIndexes: [0, 1, 2, 3],
    sortOrder
  };
  const other = {
    id: 'other',
    label: 'other',
    color: [10, 10, 10],
    dataContainer: otherContainer,
    fields,
    allIndexes: [0, 1],
    sortOrder: null
  };

  const applyCalls = [];

  const FilteredHarness = () => {
    const [datasets, setDatasets] = useState({smoothie, other});
    const [dataId, setDataId] = useState('smoothie');
    const applyCPUFilter = id => {
      applyCalls.push(id);
      setDatasets(current => ({
        ...current,
        [id]: {
          ...current[id],
          filteredIdxCPU:
            id === 'smoothie' ? (current[id].filterRecord?.version === 2 ? [2] : [0, 1]) : [0]
        }
      }));
    };

    return (
      <div>
        <button
          className="change-filter"
          onClick={() =>
            setDatasets(current => ({
              ...current,
              smoothie: {...current.smoothie, filterRecord: {version: 2}}
            }))
          }
        />
        <DataTableModal
          datasets={datasets}
          dataId={dataId}
          showDatasetTable={setDataId}
          applyCPUFilter={applyCPUFilter}
        />
      </div>
    );
  };

  const wrapper = mountDataTableModal(<FilteredHarness />);

  t.deepEqual(applyCalls, [], 'should not filter until filtered data is selected');
  t.equal(
    wrapper.find('.data-view-label').first().text(),
    'Show',
    'should label the data view control'
  );
  t.equal(wrapper.find('.data-view-all').first().text(), 'All Data', 'should offer all data');
  t.equal(
    wrapper.find('.data-view-filtered').first().text(),
    'Filtered Data',
    'should offer filtered data'
  );
  t.equal(
    wrapper.find('.data-view-all').first().prop('selected'),
    true,
    'all data starts selected'
  );
  t.equal(wrapper.find('.data-view-row-count').first().text(), '4 rows', 'shows every row');
  t.equal(
    wrapper.find(DataTable).first().prop('dataContainer'),
    dataContainer,
    'table reads the full dataset'
  );
  t.deepEqual(wrapper.find(DataTable).first().prop('sortOrder'), sortOrder, 'keeps the table sort');

  wrapper.find('.data-view-filtered').first().simulate('click');

  t.deepEqual(applyCalls, ['smoothie'], 'requests a CPU filter for the active dataset');
  t.equal(
    wrapper.find('.data-view-filtered').first().prop('selected'),
    true,
    'filtered data is selected'
  );
  t.equal(
    wrapper.find('.data-view-row-count').first().text(),
    '2 rows',
    'shows the filtered row count'
  );

  const filteredContainer = wrapper.find(DataTable).first().prop('dataContainer');
  t.equal(filteredContainer.numRows(), 2, 'table has one row per filtered index');
  t.equal(filteredContainer.valueAt(0, 0), 'b', 'first filtered row follows the active sort');
  t.equal(filteredContainer.valueAt(1, 0), 'a', 'second filtered row follows the active sort');
  t.equal(
    wrapper.find(DataTable).first().prop('sortOrder'),
    null,
    'filtered rows are ordered by the indexed container'
  );

  wrapper.find('.change-filter').simulate('click');
  t.deepEqual(applyCalls, ['smoothie', 'smoothie'], 'refreshes the CPU filter when filters change');
  t.equal(
    wrapper.find(DataTable).first().prop('dataContainer').valueAt(0, 0),
    'c',
    'shows rows from the updated filter'
  );

  wrapper.find('.data-view-all').first().simulate('click');
  t.deepEqual(applyCalls, ['smoothie', 'smoothie'], 'all data does not request another filter');
  t.equal(
    wrapper.find('.data-view-row-count').first().text(),
    '4 rows',
    'restores the full row count'
  );
  t.equal(
    wrapper.find(DataTable).first().prop('dataContainer'),
    dataContainer,
    'restores the full dataset'
  );

  wrapper.find('.data-view-filtered').first().simulate('click');
  wrapper.find(DatasetModalTab).at(1).simulate('click');

  t.deepEqual(
    applyCalls,
    ['smoothie', 'smoothie', 'smoothie', 'other'],
    'filters the dataset opened from the tabs'
  );
  t.equal(
    wrapper.find('.data-view-row-count').first().text(),
    '1 row',
    'counts the newly filtered dataset'
  );
  t.equal(
    wrapper.find(DataTable).first().prop('dataContainer').valueAt(0, 0),
    'x',
    'shows the filtered row from the selected dataset'
  );

  t.end();
});

test('Components -> DataTableModal -> filter when the active dataset changes', t => {
  const fields = [{name: 'name', type: 'string', displayName: 'name', fieldIdx: 0}];
  const smoothieContainer = createDataContainer([['a'], ['b'], ['c']], {fields});
  const otherContainer = createDataContainer([['x'], ['y']], {fields});
  const applyCalls = [];

  const ExternalSwitchHarness = () => {
    const [dataId, setDataId] = useState('smoothie');
    const [datasets, setDatasets] = useState({
      smoothie: {
        id: 'smoothie',
        label: 'smoothie',
        color: [113, 113, 113],
        dataContainer: smoothieContainer,
        fields
      },
      other: {
        id: 'other',
        label: 'other',
        color: [10, 10, 10],
        dataContainer: otherContainer,
        fields
      }
    });

    return (
      <div>
        <button className="switch-dataset" onClick={() => setDataId('other')} />
        <DataTableModal
          datasets={datasets}
          dataId={dataId}
          showDatasetTable={() => {}}
          applyCPUFilter={id => {
            applyCalls.push(id);
            setDatasets(current => ({
              ...current,
              [id]: {
                ...current[id],
                filteredIdxCPU: [1]
              }
            }));
          }}
        />
      </div>
    );
  };

  const wrapper = mountDataTableModal(<ExternalSwitchHarness />);
  wrapper.find('.data-view-filtered').first().simulate('click');
  wrapper.find('.switch-dataset').simulate('click');

  t.deepEqual(
    applyCalls,
    ['smoothie', 'other'],
    'applies the CPU filter when the active dataset changes'
  );
  t.equal(wrapper.find('.data-view-row-count').first().text(), '1 row', 'counts the new dataset');
  t.equal(
    wrapper.find(DataTable).first().prop('dataContainer').valueAt(0, 0),
    'y',
    'shows the filtered row from the newly active dataset'
  );

  t.end();
});

test('Components -> DataTableModal -> filtered column stats', async t => {
  const allValueStats = {
    type: 'numeric',
    mean: 100,
    std: 0,
    percentNulls: 0,
    bins: [],
    quantiles: []
  };
  const allScoreStats = {
    type: 'numeric',
    mean: 999,
    std: 0,
    percentNulls: 0,
    bins: [],
    quantiles: []
  };
  const fields = [
    {
      name: 'value',
      displayName: 'value',
      type: 'integer',
      fieldIdx: 0,
      filterProps: {columnStats: allValueStats}
    },
    {
      name: 'score',
      displayName: 'score',
      type: 'integer',
      fieldIdx: 1,
      filterProps: {columnStats: allScoreStats, mappedValue: [2, 4, 9]}
    }
  ];
  const dataContainer = createDataContainer(
    [
      [1, 2],
      [null, 4],
      [100, 9]
    ],
    {fields}
  );
  const loadColumnStats = sinon.spy();
  const filteredIndexes = [0, 1];

  const StatsHarness = () => {
    const [datasets, setDatasets] = useState({
      smoothie: {
        id: 'smoothie',
        label: 'smoothie',
        color: [1, 1, 1],
        dataContainer,
        fields
      }
    });

    return (
      <DataTableModal
        datasets={datasets}
        dataId="smoothie"
        applyCPUFilter={() => {
          setDatasets(current => ({
            smoothie: {...current.smoothie, filteredIdxCPU: filteredIndexes}
          }));
        }}
        loadColumnStats={loadColumnStats}
      />
    );
  };

  const wrapper = mountDataTableModal(<StatsHarness />);
  const allMeta = wrapper.find(DataTable).first().prop('colMeta');
  t.equal(allMeta.value.columnStats, allValueStats, 'all data keeps the stored column stats');
  t.equal(allMeta.score.columnStats, allScoreStats, 'all data keeps mapped column stats');

  wrapper.find('.data-view-filtered').first().simulate('click');
  const pendingMeta = wrapper.find(DataTable).first().prop('colMeta');
  t.equal(pendingMeta.value.columnStats, undefined, 'filtered view drops all-data column stats');
  t.equal(pendingMeta.value.isLoadingStats, false, 'filtered stats load when the header asks');

  await act(async () => {
    wrapper.find(DataTable).first().prop('loadColumnStats')('smoothie', ['value', 'score']);
    await new Promise(resolve => setTimeout(resolve, 0));
  });
  wrapper.update();

  const filteredMeta = wrapper.find(DataTable).first().prop('colMeta');
  t.equal(filteredMeta.value.columnStats.mean, 1, 'numeric stats use filtered rows');
  t.equal(
    filteredMeta.value.columnStats.percentNulls,
    0.5,
    'nulls are counted in the filtered rows'
  );
  t.equal(filteredMeta.score.columnStats.mean, 3, 'stats use mapped values for filtered rows');
  t.equal(filteredMeta.value.isLoadingStats, false, 'filtered stats finish loading');
  t.equal(loadColumnStats.called, false, 'filtered stats do not replace the stored all-data stats');
  t.equal(fields[0].filterProps.columnStats, allValueStats, 'stored value stats stay on the field');
  t.equal(fields[1].filterProps.columnStats, allScoreStats, 'stored score stats stay on the field');

  wrapper.find('.data-view-all').first().simulate('click');
  const restoredMeta = wrapper.find(DataTable).first().prop('colMeta');
  t.equal(restoredMeta.value.columnStats, allValueStats, 'all data shows the stored stats again');
  t.equal(
    restoredMeta.score.columnStats,
    allScoreStats,
    'all data shows the stored mapped stats again'
  );

  wrapper.find(DataTable).first().prop('loadColumnStats')('smoothie', 'value');
  t.ok(
    loadColumnStats.calledWith('smoothie', 'value'),
    'all data still loads stats through the dataset action'
  );

  t.end();
});

test('Components -> DataTableModal -> filtered data before indexes are ready', t => {
  const fields = [{name: 'name', type: 'string', displayName: 'name', fieldIdx: 0}];
  const dataContainer = createDataContainer([['a'], ['b']], {fields});
  const applyCPUFilter = sinon.spy();

  const wrapper = mountDataTableModal(
    <DataTableModal
      datasets={{
        smoothie: {
          id: 'smoothie',
          label: 'smoothie',
          color: [1, 1, 1],
          dataContainer,
          fields
        }
      }}
      dataId="smoothie"
      applyCPUFilter={applyCPUFilter}
    />
  );

  wrapper.find('.data-view-filtered').first().simulate('click');

  t.ok(applyCPUFilter.calledOnce, 'requests a CPU filter');
  t.ok(applyCPUFilter.calledWith('smoothie'), 'filters the active dataset');
  t.equal(
    wrapper.find('.data-view-row-count').first().text(),
    '-',
    'row count waits until filtered indexes exist'
  );
  t.equal(
    wrapper.find(DataTable).first().prop('dataContainer').numRows(),
    0,
    'does not list unfiltered rows while the filter is pending'
  );

  t.end();
});

test('Components -> DataTableModal -> filtered data with no matching rows', t => {
  const fields = [{name: 'name', type: 'string', displayName: 'name', fieldIdx: 0}];
  const dataContainer = createDataContainer([['a'], ['b']], {fields});

  const EmptyFilterHarness = () => {
    const [datasets, setDatasets] = useState({
      smoothie: {
        id: 'smoothie',
        label: 'smoothie',
        color: [1, 1, 1],
        dataContainer,
        fields
      }
    });

    return (
      <DataTableModal
        datasets={datasets}
        dataId="smoothie"
        applyCPUFilter={() => {
          setDatasets(current => ({
            smoothie: {...current.smoothie, filteredIdxCPU: []}
          }));
        }}
      />
    );
  };

  const wrapper = mountDataTableModal(<EmptyFilterHarness />);
  wrapper.find('.data-view-filtered').first().simulate('click');

  t.equal(wrapper.find('.data-view-row-count').first().text(), '0 rows', 'shows a zero row count');
  t.equal(
    wrapper.find(DataTable).first().prop('dataContainer').numRows(),
    0,
    'table is empty when every row is filtered out'
  );

  t.end();
});

test('Components -> DataTableModal -> render DataTable: csv 1', t => {
  const wrapper = mountDataTableModal(
    <DataTableModal datasets={StateWFiles.visState.datasets} dataId={testCsvDataId} />
  );
  t.equal(wrapper.find(DataTable).length, 1, 'should render 1 DataTable');

  const props = wrapper.find(DataTable).at(0).props();

  // mock cellSizeCache, width and height
  const enriched = {
    ...props,
    cellSizeCache: expectedCellSizeCache,
    fixedWidth: 1500,
    fixedHeight: 800,
    theme: {}
  };

  const wrapper2 = mountWithTheme(<DataTable {...enriched} />);
  const componentInstance = wrapper2.find('DataTable').instance();
  const result = componentInstance.getCellSizeCache();

  t.deepEqual(result, expectedExpandedCellSize, 'should calculate correct cell expansion');

  // manually setting the state and update the component
  act(() => {
    componentInstance.setState(result);
  });

  wrapper2.update();

  t.equal(
    wrapper2.find('.header-cell').length,
    testFields.length * STYLED_COMPONENTS_DUPLICATED_ENTRIES,
    `should render ${testFields.length} headers`
  );

  t.equal(
    wrapper2.find('.cell').length,
    testFields.length * testAllData.length,
    `should render ${testFields.length * testAllData.length} cells`
  );

  const expectedRows = {
    0: [
      '2016-09-17 00:09:55\t',
      '29.9900937\t',
      '31.2590542\t',
      'driver_analytics_0\t',
      '1472688000000\t',
      'false\t',
      '1\t',
      '2016-09-23T00:00:00.000Z\t',
      '2016-10-01 09:41:39+00:00\t',
      '2016-10-01 09:41:39+00:00\t',
      '2016-09-23\n'
    ],
    1: [
      '2016-09-17 00:10:56\t',
      '29.9927699\t',
      '31.2461142\t',
      'driver_analytics\t',
      '1472688000000\t',
      'false\t',
      '2\t',
      '2016-09-23T00:00:00.000Z\t',
      '2016-10-01 09:46:37+00:00\t',
      '2016-10-01 16:46:37+00:00\t',
      '2016-09-23\n'
    ],
    2: [
      '2016-09-17 00:11:56\t',
      '29.9907261\t',
      '31.2312742\t',
      'driver_analytics\t',
      '1472688000000\t',
      'false\t',
      '3\t',
      '2016-09-23T00:00:00.000Z\t',
      '\t',
      '\t',
      '2016-09-23\n'
    ],
    13: [
      '2016-09-17 00:22:20\t',
      '30.034391\t',
      '31.2193991\t',
      'driver_analytics\t',
      '1472754400000\t',
      '\t',
      '\t',
      '2016-09-23T06:00:00.000Z\t',
      '\t',
      '\t',
      '\n'
    ]
  };

  Object.entries(expectedRows).forEach(keyAndRow => {
    const [index, expectedRow] = keyAndRow;
    const cells = wrapper2.find(`.row-${index}`);

    t.equal(cells.length, testFields.length, 'should render 11 cells');

    for (let c = 0; c < cells.length; c++) {
      const cellText = cells.at(c).text();
      t.equal(cellText, expectedRow[c], `should render cell ${expectedRow[c]} correctly`);
    }
  });

  t.end();
});

test('Components -> DataTableModal -> render DataTable: sort, pin and display format', t => {
  const initialState = CloneDeep(StateWFiles.visState);

  // set display format
  const formats = {
    'gps_data.lat': TOOLTIP_FORMATS.DECIMAL_DECIMAL_FIXED_2.format
  };
  const nextState = visStateReducer(
    initialState,
    VisStateActions.setColumnDisplayFormat(testCsvDataId, formats)
  );

  // sort column
  const nextState1 = visStateReducer(
    nextState,
    VisStateActions.sortTableColumn(testCsvDataId, 'gps_data.lat')
  );

  // pin column
  const nextState2 = visStateReducer(
    nextState1,
    VisStateActions.pinTableColumn(testCsvDataId, 'has_result')
  );

  const wrapper = mountDataTableModal(
    <DataTableModal datasets={nextState2.datasets} dataId={testCsvDataId} />
  );

  const props = wrapper.find(DataTable).at(0).props();

  // mock cellSizeCache, width and height
  const enriched = {
    ...props,
    cellSizeCache: expectedCellSizeCache,
    fixedWidth: 1300,
    fixedHeight: 800,
    theme: {}
  };

  const wrapper2 = mountWithTheme(<DataTable {...enriched} />);
  const componentInstance = wrapper2.find('DataTable').instance();
  const result = componentInstance.getCellSizeCache();
  // manually setting the state and update the component
  act(() => {
    componentInstance.setState(result);
  });

  wrapper2.update();

  const expectedHeaders = [
    'has_result',
    'gps_data.utc_timestamp',
    'gps_data.lat',
    'gps_data.lng',
    'gps_data.types',
    'epoch',
    'uid',
    'time',
    'begintrip_ts_utc',
    'begintrip_ts_local',
    'date'
  ];

  t.equal(
    wrapper2.find('.header-cell').length,
    testFields.length * STYLED_COMPONENTS_DUPLICATED_ENTRIES, // number of duplicates create by styled-components
    `should render ${testFields.length} headers`
  );

  t.ok(
    wrapper2.find('.header-cell').at(0).hasClass('pinned-header-cell'),
    'should assign pinned-header-cell class'
  );

  t.ok(
    wrapper2.find('.header-cell').at(0).hasClass('first-cell'),
    'should assign first-cell class'
  );

  new Array(testFields.length).fill(0).forEach((d, i) => {
    t.equal(
      wrapper2
        .find('.header-cell')
        .at(i * STYLED_COMPONENTS_DUPLICATED_ENTRIES)
        .find('.col-name__name')
        .text(),
      expectedHeaders[i],
      'should render corrected pinned columns'
    );
  });

  t.end();
});

test('Components -> DatableModal -> sort/pin/copy and display format should be called with the right params', t => {
  const initialState = CloneDeep(StateWFiles.visState);
  const copyTableColumn = sinon.spy();
  const pinTableColumn = sinon.spy();
  const sortTableColumn = sinon.spy();
  const setColumnDisplayFormat = sinon.spy();
  const column = 'gps_data.lat';

  const wrapper = mountDataTableModal(
    <DataTableModal
      datasets={initialState.datasets}
      dataId={testCsvDataId}
      copyTableColumn={copyTableColumn}
      pinTableColumn={pinTableColumn}
      sortTableColumn={sortTableColumn}
      setColumnDisplayFormat={setColumnDisplayFormat}
    />
  );

  const {
    sortTableColumn: testSortColumn,
    pinTableColumn: testPinColumn,
    copyTableColumn: testCopyColumn,
    setColumnDisplayFormat: testSetColumnDisplayFormat
  } = wrapper.find('DataTable').props();

  testSortColumn(column);
  testPinColumn(column);
  testCopyColumn(column);
  testSetColumnDisplayFormat({[column]: TOOLTIP_FORMATS.DECIMAL_DECIMAL_FIXED_2.format});

  t.equal(
    sortTableColumn.calledWith(testCsvDataId, column),
    true,
    'should call sortTableColumn with dataId and column gps_data.lat'
  );

  t.equal(
    pinTableColumn.calledWith(testCsvDataId, column),
    true,
    'should call pinTableColumn with dataId and column gps_data.lat'
  );

  t.equal(
    copyTableColumn.calledWith(testCsvDataId, column),
    true,
    'should call copyTableColumn with dataId and column gps_data.lat'
  );

  t.equal(
    setColumnDisplayFormat.calledWith(testCsvDataId, {
      [column]: TOOLTIP_FORMATS.DECIMAL_DECIMAL_FIXED_2.format
    }),
    true,
    'should call setColumnDisplayFormat with dataId, column gps_data.lat, and format'
  );

  t.end();
});

test('Components -> cellSize -> renderedSize', t => {
  prepareMockCanvas();
  initApplicationConfig({enableColumnStats: true});
  try {
    const fields = [
      {name: testColumns[0], type: 'geojson'},
      {name: testColumns[1], type: 'real'},
      {name: testColumns[2], type: 'string'}
    ];
    const dataContainer = createDataContainer(texts, {fields});

    const wrapper = mountDataTableModal(
      <DataTableModal
        datasets={{
          smoothie: {
            id: 'smoothie',
            dataContainer,
            fields: [
              {name: testColumns[0], type: 'geojson', displayName: testColumns[0]},
              {name: testColumns[1], type: 'real', displayName: testColumns[1]},
              {name: testColumns[2], type: 'string', displayName: testColumns[2]}
            ],
            color: [113, 113, 113]
          }
        }}
        dataId="smoothie"
      />
    );

    const props = wrapper.find(DataTable).at(0).props();

    const expected = {
      _geojson: {row: 180, header: 180},
      'income level of people over 65': {row: 180, header: 223},
      engagement: {row: 180, header: 180}
    };

    t.deepEqual(
      props.cellSizeCache,
      expected,
      'DataTable should have the correct props.cellSizeCache'
    );
  } finally {
    restoreMockCanvas();
    initApplicationConfig({enableColumnStats: true});
  }
  t.end();
});

test('Components -> DataTableModal.render: csv 2', t => {
  const dataContainer = createDataContainer(geoStyleRows, {fields: geoStyleFields});

  // manually set display format on the 5th field: radius (.2~e)
  const fieldsWithDisplayFormat = geoStyleFields;
  fieldsWithDisplayFormat[5].displayFormat = TOOLTIP_FORMATS.DECIMAL_SCIENTIFIC_FIXED_2.format;

  const wrapper = mountDataTableModal(
    <DataTableModal
      datasets={{
        smoothie: {
          id: 'smoothie',
          dataContainer,
          fields: fieldsWithDisplayFormat,
          color: [113, 113, 113],
          data: geoStyleRows
        }
      }}
      dataId="smoothie"
    />
  );
  const props = wrapper.find(DataTable).at(0).props();
  const cellSizeCache = {
    _geojson: {row: 400, header: 91},
    fillColor: {row: 75, header: 90},
    lineColor: {row: 75, header: 94},
    lineWidth: {row: 75, header: 98},
    elevation: {row: 75, header: 94},
    radius: {row: 75, header: 90}
  };
  const enriched = {
    ...props,
    cellSizeCache,
    fixedWidth: 1200,
    fixedHeight: 800,
    theme: {}
  };

  const expectedExpandedCellSizeGeo = {
    cellSizeCache: {
      _geojson: 410,
      fillColor: 90,
      lineColor: 94,
      lineWidth: 98,
      elevation: 94,
      radius: 90
    },
    ghost: 324
  };
  const wrapper2 = mountWithTheme(<DataTable {...enriched} />);
  const componentInstance = wrapper2.find('DataTable').instance();

  const result = componentInstance.getCellSizeCache();
  t.deepEqual(result, expectedExpandedCellSizeGeo, 'should calculate correct cell expansion');

  act(() => {
    componentInstance.setState(result);
  });
  wrapper2.update();

  t.equal(
    wrapper2.find('.header-cell').length,
    7 * STYLED_COMPONENTS_DUPLICATED_ENTRIES,
    `should render 7 header cells`
  );

  // test header cell
  const expectedHeaders = [
    geoStyleFields[0].name,
    geoStyleFields[1].name,
    geoStyleFields[2].name,
    geoStyleFields[3].name,
    geoStyleFields[4].name,
    geoStyleFields[5].name,
    ''
  ];

  expectedHeaders.forEach((name, index) => {
    const header = wrapper2.find(`.header-cell.column-${index}`);
    t.equal(header.length, STYLED_COMPONENTS_DUPLICATED_ENTRIES, 'should render 1 header');

    if (index < 6) {
      const cellText = header.find('.col-name__name').text();
      t.equal(cellText, expectedHeaders[index], 'should render correct column name');
      const cellType = header.find(FieldToken);
      t.equal(cellType.prop('type'), geoStyleFields[index].type, 'should render correct cell type');
      t.equal(header.find(VertThreeDots).length, 1, 'should render more button');
      t.equal(header.find(OptionDropdown).length, 1, 'should render OptionDropdown');
    } else {
      // if ghost cell
      t.equal(header.at(1).text(), '', 'cell should be empty');
    }
  });

  t.equal(wrapper2.find('.cell').length, 21, `should render 21 data cells`);

  const expectedRows = {
    0: [
      '{"type":"Feature","properties":{"fillColor":[1,2,3],"lineColor":[4,5,6],"lineWidth":1,"elevation":10,"radius":5},"geometry":{"type":"Point","coordinates":[-122.1,37.3]}}\t',
      '[1,2,3]\t',
      '[4,5,6]\t',
      '1\t',
      '10\t',
      '5e+0\t',
      '\n'
    ],
    1: [
      '{"type":"Feature","properties":{"fillColor":[7,8,9],"lineColor":[4,5,6],"lineWidth":3,"elevation":10,"radius":5},"geometry":{"type":"Point","coordinates":[-122.2,37.2]}}\t',
      '[7,8,9]\t',
      '[4,5,6]\t',
      '3\t',
      '10\t',
      '5e+0\t',
      '\n'
    ],
    2: [
      '{"type":"Feature","properties":{"fillColor":[1,2,3],"lineColor":[4,5,6],"lineWidth":4,"elevation":10,"radius":5},"geometry":{"type":"Point","coordinates":[-122.3,37.1]}}\t',
      '[1,2,3]\t',
      '[4,5,6]\t',
      '4\t',
      '10\t',
      '5e+0\t',
      '\n'
    ]
  };

  Object.entries(expectedRows).forEach(keyAndRow => {
    const [index, expectedRow] = keyAndRow;

    const cells = wrapper2.find(`.row-${index}`);
    t.equal(cells.length, 7, 'should render 6 cells and 1 ghost cell');

    for (let c = 0; c < cells.length; c++) {
      const cellText = cells.at(c).text();
      t.equal(cellText, expectedRow[c], `should render cell ${expectedRow[c]} correctly`);
    }
  });

  t.end();
});
/* eslint-enable max-statements */
