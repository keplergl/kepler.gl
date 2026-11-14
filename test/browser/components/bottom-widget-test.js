// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import test from 'tape';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {
  BottomWidgetFactory,
  TimeWidgetFactory,
  AnimationControlFactory,
  FilterAnimationControllerFactory,
  LayerAnimationControllerFactory,
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
import {InitialState, StateWFilters, StateWTripGeojson} from 'test/helpers/mock-state';

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

test('Components -> BottomWidget -> skips unchanged parent renders and keeps updates live', t => {
  let renders = 0;
  const TimeWidgetProbe = ({filter, onClose}) => {
    renders++;
    return <button onClick={onClose}>{filter.value.join(',')}</button>;
  };
  const Widget = BottomWidgetFactory(
    TimeWidgetProbe,
    () => null,
    appInjector.get(FilterAnimationControllerFactory),
    appInjector.get(LayerAnimationControllerFactory),
    () => null
  );
  const closeCalls = [];
  const props = {
    ...defaultProps,
    ...StateWFilters.visState,
    visStateActions: {...VisStateActions, setFilterView: (...args) => closeCalls.push(args)}
  };
  const ref = React.createRef();
  const tree = (next = props, nextTheme = theme) => (
    <ThemeProvider theme={nextTheme}>
      <Widget {...next} ref={ref} />
    </ThemeProvider>
  );
  const view = render(tree(), {baseElement: document.createElement('div')});
  t.equal(renders, 1, 'renders the enlarged filter');
  t.equal(ref.current, view.container.firstChild, 'forwards the DOM ref');
  view.rerender(tree({...props}));
  t.equal(renders, 1, 'skips a parent render with unchanged inputs');

  const filters = props.filters.map(filter => ({...filter, value: [1, 2]}));
  view.rerender(tree({...props, filters}));
  t.ok(view.getByText('1,2'), 'updates the displayed filter value');
  fireEvent.click(view.getByText('1,2'));
  t.deepEqual(closeCalls, [[0, FILTER_VIEW_TYPES.side]], 'retains filter controls');
  const beforeTheme = renders;
  view.rerender(tree({...props, filters}, {...theme, sidePanelBg: '#123456'}));
  t.equal(renders, beforeTheme + 1, 'consumed theme changes still propagate');
  view.rerender(tree({...props, filters: [], datasets: {}}));
  t.equal(view.queryByRole('button'), null, 'handles the filter being removed');
  view.unmount();
  t.end();
});

test('Components -> timeline controllers -> reuse unchanged inputs and update replaced inputs', t => {
  for (const [factory, prop, initial] of [
    [FilterAnimationControllerFactory, 'filter', StateWFilters.visState.filters[0]],
    [LayerAnimationControllerFactory, 'animationConfig', StateWTripGeojson.visState.animationConfig]
  ]) {
    let renders = 0;
    const Timeline = React.memo(({timeline}) => {
      renders++;
      return <output>{JSON.stringify(timeline)}</output>;
    });
    const Controller = factory(({timeline}) => <Timeline timeline={timeline} />);
    const props = {
      [prop]: initial,
      filterIdx: 0,
      setFilterAnimationTime: () => {},
      setLayerAnimationTime: () => {}
    };
    const view = render(<Controller {...props} />);
    const original = view.container.textContent;
    view.rerender(<Controller {...props} />);
    t.equal(renders, 1, `${prop}: does not rerender a timeline with unchanged inputs`);
    view.rerender(<Controller {...props} {...{[prop]: {...initial, domain: [10, 20]}}} />);
    t.equal(renders, 2, `${prop}: updates after domain replacement`);
    t.notEqual(view.container.textContent, original, `${prop}: renders the new domain`);
    view.unmount();
  }
  t.end();
});

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
