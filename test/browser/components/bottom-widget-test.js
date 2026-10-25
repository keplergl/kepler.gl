// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {
  BottomWidgetFactory,
  TimeWidgetFactory,
  AnimationControlFactory,
  Icons,
  TimezoneSelector,
  appInjector
} from '@kepler.gl/components';
import {VisStateActions} from '@kepler.gl/actions';
import {visStateReducer as reducer} from '@kepler.gl/reducers';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';

const BottomWidget = appInjector.get(BottomWidgetFactory);
const TimeWidget = appInjector.get(TimeWidgetFactory);
const AnimationControl = appInjector.get(AnimationControlFactory);

// mock state
import {InitialState, StateWFilters} from 'test/helpers/mock-state';

// default props from initial state
const defaultProps = {
  datasets: InitialState.visState.datasets,
  filters: InitialState.visState.filters,
  layers: InitialState.visState.layers,
  animationConfig: InitialState.visState.animationConfig,
  uiState: InitialState.uiState,
  containerW: 900,
  sidePanelWidth: 300,
  visStateActions: VisStateActions
};

test('Components -> BottomWidget.mount -> initial state', t => {
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <BottomWidget {...defaultProps} />
      </IntlWrapper>
    );
  }, 'BottomWidget should not fail without props');

  t.equal(wrapper.find(TimeWidget).length, 0, 'should not render');
  t.equal(wrapper.find(AnimationControl).length, 0, 'should not render');

  t.end();
});

test('Components -> BottomWidget.mount -> datetime and opt-in numeric filters', t => {
  const mountWidget = visState =>
    mountWithTheme(
      <IntlWrapper>
        <BottomWidget
          {...defaultProps}
          datasets={visState.datasets}
          filters={visState.filters}
          layers={visState.layers}
        />
      </IntlWrapper>
    );

  let wrapper = mountWidget(StateWFilters.visState);
  t.equal(wrapper.find(TimeWidget).length, 1, 'should preserve the enlarged datetime widget');
  wrapper.unmount();

  let numericState = reducer(
    cloneDeep(StateWFilters.visState),
    VisStateActions.setFilter(0, 'name', 'gps_data.lat')
  );
  wrapper = mountWidget(numericState);
  t.equal(wrapper.find(TimeWidget).length, 0, 'should leave an ordinary numeric filter disabled');
  wrapper.unmount();

  numericState = reducer(
    numericState,
    VisStateActions.setFilterView(0, FILTER_VIEW_TYPES.enlarged)
  );
  const numericDataId = numericState.filters[0].dataId[0];
  const numericBins = numericState.filters[0].bins[numericDataId];
  numericState = {
    ...numericState,
    filters: [
      {
        ...numericState.filters[0],
        bins: {
          ...numericState.filters[0].bins,
          [numericDataId]: [
            {...numericBins[0], x1: numericBins[0].x0 + 1e-12},
            ...numericBins.slice(1)
          ]
        }
      },
      ...numericState.filters.slice(1)
    ]
  };
  wrapper = mountWidget(numericState);
  t.equal(wrapper.find(TimeWidget).length, 1, 'should render the numeric widget when enlarged');

  wrapper.find(Icons.Gear).at(0).simulate('click');
  wrapper.update();
  t.ok(wrapper.text().includes('Bin size'), 'should show numeric binning controls');
  t.equal(
    wrapper.find('[data-testid="numeric-bin-size"]').hostNodes().prop('value'),
    '0.002',
    'should infer the regular bin size instead of a tiny padded edge bin'
  );
  t.equal(
    window.getComputedStyle(
      wrapper.find('[data-testid="numeric-bin-size"]').hostNodes().getDOMNode()
    ).width,
    window.getComputedStyle(
      wrapper.find('[data-testid="time-widget-aggregation"]').hostNodes().getDOMNode()
    ).width,
    'should match the aggregation control width'
  );
  t.equal(wrapper.find(TimezoneSelector).length, 0, 'should hide the timezone control');
  t.equal(
    wrapper.find('[data-testid="time-widget-time-format"]').hostNodes().length,
    0,
    'should hide the calendar time-format control'
  );

  wrapper.unmount();
  t.end();
});
