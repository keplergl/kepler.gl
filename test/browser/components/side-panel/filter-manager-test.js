// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import sinon from 'sinon';
import test from 'tape';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import {
  FilterManagerFactory,
  SourceDataCatalogFactory,
  FilterPanelFactory,
  FieldSelectorFactory,
  Button,
  FilterPanelHeaderFactory,
  NewFilterPanelFactory,
  appInjector,
  AddFilterButtonFactory,
  RangeSliderFactory,
  Icons
} from '@kepler.gl/components';
import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';
import {keplerGlReducerCore as keplerGlReducer} from '@kepler.gl/reducers';
import {VisStateActions} from '@kepler.gl/actions';
import {testFields, testAllData} from 'test/fixtures/test-csv-data';
import {ALL_FIELD_TYPES, FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {assertDatasetIsTable} from '../../../helpers/comparison-utils';

// components
const FilterManager = appInjector.get(FilterManagerFactory);
const SourceDataCatalog = appInjector.get(SourceDataCatalogFactory);
const FilterPanel = appInjector.get(FilterPanelFactory);
const NewFilterPanel = appInjector.get(NewFilterPanelFactory);
const FilterPanelHeader = appInjector.get(FilterPanelHeaderFactory);
const FieldSelector = appInjector.get(FieldSelectorFactory);
const AddFilterButton = appInjector.get(AddFilterButtonFactory);
const RangeSlider = appInjector.get(RangeSliderFactory);

// mock state
import {StateWFilters, InitialState, applyActions, csvInfo} from 'test/helpers/mock-state';
import {clickItemSelectList} from '../../../helpers/component-utils';

const nop = () => {};
// default props from initial state
const defaultProps = {
  filters: [],
  datasets: {},
  layers: [],
  showDatasetTable: nop,
  updateTableColor: nop,
  removeDataset: nop,
  showAddDataModal: nop,
  panelMetadata: {
    label: 'sidebar.panels.filter'
  },
  panelListView: 'list',
  visStateActions: {
    addFilter: nop,
    setFilter: nop,
    removeFilter: nop,
    enlargeFilter: nop,
    toggleAnimation: nop,
    toggleFilterFeature: nop
  },
  uiStateActions: {
    togglePanelListView: nop
  }
};

// components
const filterManagerProps = {
  ...defaultProps,
  filters: StateWFilters.visState.filters,
  datasets: StateWFilters.visState.datasets,
  layers: StateWFilters.visState.layers
};

test('Components -> FilterManager.mount -> no prop', t => {
  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <FilterManager {...defaultProps} />
      </IntlWrapper>
    );
  }, 'FilterManager should not fail without props');

  t.ok(wrapper.find('.filter-manager').length === 1, 'should render Filter Manager');
  t.ok(wrapper.find(SourceDataCatalog).length === 1, 'should render SourceDataCatalog');
  t.equal(wrapper.find(AddFilterButton).length, 1, 'should render add filter button');

  t.end();
});

test('Components -> FilterManager.mount -> with prop', t => {
  // mount
  const addFilter = sinon.spy();
  const newProps = {
    ...filterManagerProps,
    visStateActions: {
      ...filterManagerProps.visStateActions,
      addFilter
    }
  };
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <FilterManager {...newProps} />
      </IntlWrapper>
    );
  }, 'FilterManager should not fail w/ props');

  t.ok(wrapper.find('.filter-manager').length === 1, 'should render Filter Manager');
  t.ok(wrapper.find(SourceDataCatalog).length === 1, 'should render SourceDataCatalog');
  t.equal(wrapper.find(Button).length, 2, 'should render 2 buttons');
  t.ok(wrapper.find(FilterPanel).length === 2, 'should render 2 FilterPanel');

  // stateless component don't have a instance()
  const filter1Props = wrapper.find(FilterPanel).at(0).props();

  t.equal(filter1Props.filter, filterManagerProps.filters[1], 'should render last filter first');
  t.equal(filter1Props.isAnyFilterAnimating, false, 'isAnyFilterAnimating is false');

  t.equal(wrapper.find('.list__item').length, 2, 'should render 2 options');
  clickItemSelectList(wrapper, 1);

  t.deepEqual(
    addFilter.args,
    [[Object.keys(StateWFilters.visState.datasets)[1]]],
    'Should call addFilter with 1st dataset'
  );

  t.end();
});

test('Components -> FilterManager.mount -> order by dataset view', t => {
  const newProps = {
    ...filterManagerProps,
    panelListView: 'byDataset'
  };
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <FilterManager {...newProps} />
      </IntlWrapper>
    );
  }, 'FilterManager should not fail w/ props');

  t.equal(wrapper.find('DatasetFilterSection').length, 2, 'should render 2 DatasetFilterSection');

  t.end();
});

test('Components -> FilterManager.mount -> numeric filter exposes timeline action', t => {
  let numericState = keplerGlReducer(
    cloneDeep(StateWFilters),
    VisStateActions.setFilter(0, 'name', 'gps_data.lat')
  );
  const numericFilter = numericState.visState.filters[0];
  const yAxis = numericState.visState.datasets[numericFilter.dataId[0]].fields.find(
    field => field.name === 'gps_data.lng'
  );
  numericState = keplerGlReducer(numericState, VisStateActions.setFilterPlot(0, {yAxis}));
  const setFilterView = sinon.spy();
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <FilterManager
        {...filterManagerProps}
        filters={numericState.visState.filters}
        datasets={numericState.visState.datasets}
        layers={numericState.visState.layers}
        visStateActions={{...VisStateActions, setFilterView}}
      />
    </IntlWrapper>
  );

  t.equal(
    wrapper.find(Icons.Clock).length,
    1,
    'should render the playback action for numeric data'
  );
  const numericRangeSlider = wrapper.find('.range-filter-panel').find(RangeSlider).at(0);
  t.equal(
    numericRangeSlider.props().lineChart,
    numericState.visState.filters[0].lineChart,
    'should render the numeric Y-axis chart after playback is closed'
  );
  t.equal(
    numericRangeSlider.props().isTime,
    false,
    'should keep numeric side-panel chart labels out of datetime mode'
  );
  t.equal(
    wrapper.find('.range-filter-panel').find('.filter-panel__filter').length,
    1,
    'should render the numeric histogram while it is a side filter'
  );
  wrapper.find(Icons.Clock).at(0).simulate('click');
  t.deepEqual(
    setFilterView.firstCall.args,
    [0, FILTER_VIEW_TYPES.enlarged],
    'should enable the numeric bottom widget through the existing view action'
  );

  const enlargedNumericState = keplerGlReducer(
    numericState,
    VisStateActions.setFilterView(0, FILTER_VIEW_TYPES.enlarged)
  );
  const enlargedWrapper = mountWithTheme(
    <IntlWrapper>
      <FilterManager
        {...filterManagerProps}
        filters={enlargedNumericState.visState.filters}
        datasets={enlargedNumericState.visState.datasets}
        layers={enlargedNumericState.visState.layers}
      />
    </IntlWrapper>
  );

  t.equal(
    enlargedWrapper.find('.range-filter-panel').find('.filter-panel__filter').length,
    0,
    'should hide the numeric histogram while it is rendered in the bottom widget'
  );

  t.end();
});

test('Components -> FilterManager.mount -> with supportedFilterTypes', t => {
  // load csv and geojson
  const updatedState = applyActions(keplerGlReducer, InitialState, [
    {
      action: VisStateActions.updateVisData,
      payload: [
        [
          {
            info: csvInfo,
            data: {fields: testFields, rows: testAllData},
            supportedFilterTypes: [ALL_FIELD_TYPES.real, ALL_FIELD_TYPES.integer]
          }
        ]
      ]
    }
  ]);

  const {visState} = updatedState;
  // test dataset is table
  assertDatasetIsTable(t, visState.datasets[csvInfo.id]);
  t.deepEqual(
    visState.datasets[csvInfo.id].supportedFilterTypes,
    [ALL_FIELD_TYPES.real, ALL_FIELD_TYPES.integer],
    'supportedFilterTypes should be correct'
  );

  // call addFilter
  const stateWithEmptyFilter = keplerGlReducer(updatedState, VisStateActions.addFilter(csvInfo.id));
  // mount filter panel
  // components
  const props = {
    filters: stateWithEmptyFilter.visState.filters,
    datasets: stateWithEmptyFilter.visState.datasets,
    layers: stateWithEmptyFilter.visState.layers,
    showDatasetTable: nop,
    panelMetadata: {
      label: 'sidebar.panels.filter'
    },
    visStateActions: {
      addFilter: nop,
      setFilter: nop,
      removeFilter: nop,
      enlargeFilter: nop,
      toggleAnimation: nop,
      toggleFilterFeature: nop
    },
    uiStateActions: {
      togglePanelListView: nop
    }
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <FilterManager {...props} />
      </IntlWrapper>
    );
  }, 'FilterManager should not fail when mount with dataset.supportedFilterTypes');

  t.ok(wrapper.find(FilterPanel).length === 1, 'should render 1 FilterPanel');
  t.ok(wrapper.find(NewFilterPanel).length === 1, 'should render 1 NewFilterPanel');
  t.ok(wrapper.find(FilterPanelHeader).length === 1, 'should render 1 FilterPanelHeader');
  t.ok(wrapper.find(FieldSelector).length === 1, 'should render FieldSelector');

  // check field options
  const fieldOptions = wrapper.find(FieldSelector).at(0).props().fields;

  t.deepEqual(
    fieldOptions.map(f => f.name),
    ['gps_data.lat', 'gps_data.lng', 'uid'],
    'should only pass real / integer fields'
  );

  t.end();
});
