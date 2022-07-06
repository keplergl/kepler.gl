// Copyright (c) 2022 Uber Technologies, Inc.
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
import sinon from 'sinon';
import test from 'tape';
import {
  FilterManagerFactory,
  SourceDataCatalogFactory,
  FilterPanelFactory,
  FieldSelectorFactory,
  Button,
  FilterPanelHeaderFactory
} from 'components';

import NewFilterPanelFactory from 'components/side-panel/filter-panel/filter-panel';

import {appInjector} from 'components/container';
import {mountWithTheme, IntlWrapper} from 'test/helpers/component-utils';
import keplerGlReducer from 'reducers/core';
import {VisStateActions} from 'actions';
import {testFields, testAllData} from 'test/fixtures/test-csv-data';
import {ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {assertDatasetIsTable} from '../../../helpers/comparison-utils';

// components
const FilterManager = appInjector.get(FilterManagerFactory);
const SourceDataCatalog = appInjector.get(SourceDataCatalogFactory);
const FilterPanel = appInjector.get(FilterPanelFactory);
const NewFilterPanel = appInjector.get(NewFilterPanelFactory);
const FilterPanelHeader = appInjector.get(FilterPanelHeaderFactory);
const FieldSelector = appInjector.get(FieldSelectorFactory);

// mock state
import {StateWFilters, InitialState, applyActions, csvInfo} from 'test/helpers/mock-state';

const nop = () => {};
// default props from initial state
const defaultProps = {
  filters: [],
  datasets: {},
  layers: [],
  showDatasetTable: nop,
  visStateActions: {
    addFilter: nop,
    setFilter: nop,
    removeFilter: nop,
    enlargeFilter: nop,
    toggleAnimation: nop,
    toggleFilterFeature: nop
  }
};

// components
const filterManagerProps = {
  filters: StateWFilters.visState.filters,
  datasets: StateWFilters.visState.datasets,
  layers: StateWFilters.visState.layers,
  showDatasetTable: nop,
  visStateActions: {
    addFilter: nop,
    setFilter: nop,
    removeFilter: nop,
    enlargeFilter: nop,
    toggleAnimation: nop,
    toggleFilterFeature: nop
  }
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
  t.ok(wrapper.find(Button).length === 1, 'should render add filter button');
  t.equal(
    wrapper
      .find(Button)
      .at(0)
      .props().inactive,
    true,
    'inactive should be true'
  );

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
  }, 'FilterManager should not fail without props');

  t.ok(wrapper.find('.filter-manager').length === 1, 'should render Filter Manager');
  t.ok(wrapper.find(SourceDataCatalog).length === 1, 'should render SourceDataCatalog');
  t.ok(wrapper.find(Button).length === 1, 'should render add filter button');
  t.ok(wrapper.find(FilterPanel).length === 2, 'should render 2 FilterPanel');

  // stateless component don't have a instance()
  const filter1Props = wrapper
    .find(FilterPanel)
    .at(0)
    .props();

  t.equal(filter1Props.filter, filterManagerProps.filters[1], 'should render last filter first');
  t.equal(filter1Props.isAnyFilterAnimating, false, 'isAnyFilterAnimating is false');
  const addFilterButton = wrapper.find(Button).at(0);
  // .instance();
  addFilterButton.simulate('click');

  t.deepEqual(
    addFilter.args,
    [[Object.keys(StateWFilters.visState.datasets)[0]]],
    'Should call addFilter with 1st dataset'
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
    visStateActions: {
      addFilter: nop,
      setFilter: nop,
      removeFilter: nop,
      enlargeFilter: nop,
      toggleAnimation: nop,
      toggleFilterFeature: nop
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
  const fieldOptions = wrapper
    .find(FieldSelector)
    .at(0)
    .props().fields;

  t.deepEqual(
    fieldOptions.map(f => f.name),
    ['gps_data.lat', 'gps_data.lng', 'id'],
    'should only pass real / integer fields'
  );

  t.end();
});
