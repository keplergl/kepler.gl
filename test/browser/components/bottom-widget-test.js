// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import Window from 'global/window';
import {render, fireEvent, act, within} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import test from 'tape';
import sinon from 'sinon';
import cloneDeep from 'es-toolkit/compat/cloneDeep';
import {IntlWrapper, mountWithTheme, mockHTMLElementClientSize} from 'test/helpers/component-utils';
import {
  BottomWidgetFactory,
  TimeWidgetFactory,
  AnimationControlFactory,
  FilterAnimationControllerFactory,
  LayerAnimationControllerFactory,
  TimezoneSelector,
  bottomWidgetSelector,
  appInjector
} from '@kepler.gl/components';
import {VisStateActions} from '@kepler.gl/actions';
import {visStateReducer as reducer} from '@kepler.gl/reducers';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import * as dimensions from '../../../src/utils/src/observe-dimensions';

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

test('Components -> BottomWidget -> stopping layer playback preserves the final data time', t => {
  const LayerController = ({animationConfig, setLayerAnimationTime, onAnimationEnd}) => (
    <button
      onClick={() => {
        setLayerAnimationTime(animationConfig.domain[1]);
        onAnimationEnd();
      }}
    >
      Finish playback
    </button>
  );
  const Widget = BottomWidgetFactory(
    () => null,
    () => null,
    () => null,
    LayerController,
    () => null
  );
  let state = {
    ...StateWTripGeojson.visState,
    filters: [],
    animationConfig: {
      ...StateWTripGeojson.visState.animationConfig,
      domain: [0, 100],
      currentTime: 99,
      isAnimating: true,
      animationLoop: false
    }
  };
  const actions = {
    ...VisStateActions,
    setLayerAnimationTime: value => {
      state = reducer(state, VisStateActions.setLayerAnimationTime(value));
    },
    setAnimationConfig: config => {
      state = reducer(state, VisStateActions.setAnimationConfig(config));
    }
  };
  const view = render(
    <ThemeProvider theme={theme}>
      <Widget {...defaultProps} {...state} visStateActions={actions} />
    </ThemeProvider>
  );
  try {
    // The controller publishes its final time and completion in the same frame,
    // before React has rendered the updated animationConfig.
    fireEvent.click(view.getByText('Finish playback'));
    t.equal(state.animationConfig.currentTime, 100, 'retains the final native data timestamp');
    t.equal(state.animationConfig.isAnimating, false, 'stops the native data clock');
  } finally {
    view.unmount();
  }
  t.end();
});

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

test('Components -> BottomWidget -> reserves space only for the bottom-right legend', t => {
  const matchMedia = Window.matchMedia;
  const timelineHeight = 240;
  const heightStub = mockHTMLElementClientSize('offsetHeight', timelineHeight);
  const Widget = BottomWidgetFactory(
    () => <div>Timeline</div>,
    () => null,
    appInjector.get(FilterAnimationControllerFactory),
    appInjector.get(LayerAnimationControllerFactory),
    () => null
  );
  let view;
  try {
    for (const portable of [false, true]) {
      Window.matchMedia = query => ({...matchMedia(query), matches: portable});
      const props = {
        ...defaultProps,
        ...StateWFilters.visState,
        containerW: portable ? 600 : 1000,
        uiState: {...defaultProps.uiState, activeSidePanel: 'layer'}
      };
      const tree = legend => (
        <ThemeProvider theme={theme}>
          <Widget
            {...props}
            uiState={{
              ...props.uiState,
              mapControls: {...props.uiState.mapControls, mapLegend: {show: true, ...legend}}
            }}
          />
        </ThemeProvider>
      );
      view = render(tree({active: false}));
      const widget = view.container.querySelector('.bottom-widget--container');
      const initialStyle = window.getComputedStyle(widget);
      const initialWidth = initialStyle.width;
      const reservedWidth = portable
        ? 0
        : theme.mapControl.width +
          theme.mapControl.mapLegend.pinned.right * 2 -
          theme.bottomWidgetPaddingRight;
      const cornerWidth =
        theme.mapControl.width +
        theme.mapControl.mapLegend.pinned.right * 2 -
        theme.bottomWidgetPaddingRight;
      const visibleTimelineTop = timelineHeight - theme.bottomWidgetPaddingTop;
      t.equal(
        initialWidth,
        `${props.containerW - props.sidePanelWidth}px`,
        'starts with the available width for the current layout'
      );
      for (const [action, legend, reserved] of [
        ['opening in the default corner', {active: true}, reservedWidth],
        [
          'moving to the top-right',
          {
            active: true,
            settings: {position: {x: 10, y: 10, anchorX: 'right', anchorY: 'top'}}
          },
          0
        ],
        [
          'moving to the bottom-left',
          {
            active: true,
            settings: {position: {x: 10, y: 30, anchorX: 'left', anchorY: 'bottom'}}
          },
          0
        ],
        [
          'moving just above the timeline with the same corner anchors',
          {
            active: true,
            settings: {
              position: {x: 10, y: visibleTimelineTop, anchorX: 'right', anchorY: 'bottom'}
            }
          },
          0
        ],
        [
          'moving left of the corner column with the same anchors',
          {
            active: true,
            settings: {position: {x: cornerWidth, y: 30, anchorX: 'right', anchorY: 'bottom'}}
          },
          0
        ],
        [
          'overlapping the timeline by exactly 30px',
          {
            active: true,
            settings: {
              position: {x: 10, y: visibleTimelineTop - 30, anchorX: 'right', anchorY: 'bottom'}
            }
          },
          0
        ],
        [
          'overlapping the corner column by exactly 30px',
          {
            active: true,
            settings: {
              position: {x: cornerWidth - 30, y: 30, anchorX: 'right', anchorY: 'bottom'}
            }
          },
          0
        ],
        [
          'overlapping both corner bounds by 31px',
          {
            active: true,
            settings: {
              position: {
                x: cornerWidth - 31,
                y: visibleTimelineTop - 31,
                anchorX: 'right',
                anchorY: 'bottom'
              }
            }
          },
          reservedWidth
        ],
        [
          'returning to the bottom-right',
          {
            active: true,
            settings: {position: {x: 10, y: 30, anchorX: 'right', anchorY: 'bottom'}}
          },
          reservedWidth
        ],
        ['hiding', {active: true, show: false}, 0],
        ['closing', {active: false}, 0]
      ]) {
        view.rerender(tree(legend));
        const style = window.getComputedStyle(widget);
        t.equal(style.width, `${parseFloat(initialWidth) - reserved}px`, `${action}: width`);
        t.equal(style.marginRight, `${reserved}px`, `${action}: reserved corner space`);
      }
      if (!portable) {
        props.containerW = props.sidePanelWidth + 100;
        view.rerender(tree({active: true}));
        const style = window.getComputedStyle(widget);
        t.equal(style.width, '0px', 'a small embedded map never produces a negative width');
        t.equal(
          style.marginRight,
          '100px',
          'legend space cannot push the timeline under the sidebar'
        );
      }
      view.unmount();
      view = null;
    }
  } finally {
    view?.unmount();
    heightStub.restore();
    Window.matchMedia = matchMedia;
  }
  t.end();
});

test('Components -> BottomWidget -> refreshes legend clearance when Settings changes height', t => {
  const matchMedia = Window.matchMedia;
  Window.matchMedia = query => ({...matchMedia(query), matches: false});
  const resizeCallbacks = new Map();
  const observeStub = sinon.stub(dimensions, 'observeDimensions').callsFake((target, callback) => {
    resizeCallbacks.set(target, callback);
  });
  const unobserveStub = sinon.stub(dimensions, 'unobserveDimensions').callsFake(target => {
    resizeCallbacks.delete(target);
  });
  const heightStub = sinon.stub(HTMLElement.prototype, 'offsetHeight').get(function () {
    return this.querySelector('.time-widget--settings') ? 400 : 240;
  });
  const tree = y => (
    <ThemeProvider theme={theme}>
      <IntlWrapper>
        <BottomWidget
          {...defaultProps}
          {...StateWFilters.visState}
          containerW={1000}
          uiState={{
            ...defaultProps.uiState,
            mapControls: {
              ...defaultProps.uiState.mapControls,
              mapLegend: {
                show: true,
                active: true,
                settings: {position: {x: 10, y, anchorX: 'right', anchorY: 'bottom'}}
              }
            }
          }}
        />
      </IntlWrapper>
    </ThemeProvider>
  );
  let view;
  try {
    view = render(tree(260));
    const widget = view.container.querySelector('.bottom-widget--container');
    const reservedSpace = () => parseFloat(window.getComputedStyle(widget).marginRight);
    const notifyResize = () => act(() => resizeCallbacks.get(widget)?.());
    t.equal(reservedSpace(), 0, 'legend above the timeline reserves no space');
    t.ok(resizeCallbacks.has(widget), 'watches the timeline for content size changes');

    const settings = within(widget).getByRole('button', {name: 'Settings'});
    fireEvent.click(settings);
    t.ok(view.container.querySelector('.time-widget--settings'), 'opens real Timeline Settings');
    notifyResize();
    t.ok(reservedSpace() > 0, 'reserves space when opening Settings creates overlap');

    view.rerender(tree(259));
    t.ok(reservedSpace() > 0, 'keeps space after moving Legend over the taller timeline');
    fireEvent.click(settings);
    t.notOk(view.container.querySelector('.time-widget--settings'), 'closes Timeline Settings');
    notifyResize();
    t.equal(reservedSpace(), 0, 'releases space after Settings closes without moving Legend');

    view.unmount();
    view = null;
    t.notOk(resizeCallbacks.has(widget), 'stops watching after the widget unmounts');
  } finally {
    view?.unmount();
    heightStub.restore();
    observeStub.restore();
    unobserveStub.restore();
    Window.matchMedia = matchMedia;
  }
  t.end();
});

test('Components -> BottomWidget -> updates available space on resize and sidebar changes', t => {
  const matchMedia = Window.matchMedia;
  let portable = false;
  Window.matchMedia = query => ({...matchMedia(query), matches: portable});
  const Widget = BottomWidgetFactory(
    () => <div>Timeline</div>,
    () => null,
    appInjector.get(FilterAnimationControllerFactory),
    appInjector.get(LayerAnimationControllerFactory),
    () => null
  );
  const props = {...defaultProps, ...StateWFilters.visState};
  const tree = (containerW, activeSidePanel = 'layer') => (
    <ThemeProvider theme={theme}>
      <Widget {...props} containerW={containerW} uiState={{...props.uiState, activeSidePanel}} />
    </ThemeProvider>
  );
  let view;
  try {
    view = render(tree(1000));
    const width = () => window.getComputedStyle(view.container.firstChild).width;
    t.equal(width(), '700px', 'desktop reserves space for the open sidebar');
    portable = true;
    view.rerender(tree(600));
    t.equal(width(), '300px', 'resizing to portable still reserves space for the open sidebar');
    t.equal(
      window.getComputedStyle(view.container.firstChild).marginLeft,
      'auto',
      'aligns the narrower timeline to the right of the sidebar in normal flow'
    );
    view.rerender(tree(600, null));
    t.equal(width(), '600px', 'closing the sidebar in portable mode releases its space');
    view.rerender(tree(600));
    t.equal(width(), '300px', 'reopening the sidebar in portable mode reserves its space');
    portable = false;
    view.rerender(tree(900));
    t.equal(width(), '600px', 'resizing back to desktop reserves sidebar space again');
    view.rerender(tree(900, null));
    t.equal(width(), '900px', 'closing the sidebar releases its space');
    view.rerender(tree(900));
    t.equal(width(), '600px', 'reopening the sidebar reserves its space');
    view.rerender(tree(200));
    t.equal(
      width(),
      '0px',
      'an embedded container narrower than the sidebar has no negative width'
    );
  } finally {
    view?.unmount();
    Window.matchMedia = matchMedia;
  }
  t.end();
});

test('Components -> BottomWidget -> read-only embeds do not reserve hidden sidebar space', t => {
  const Widget = BottomWidgetFactory(
    () => <div>Timeline</div>,
    () => null,
    appInjector.get(FilterAnimationControllerFactory),
    appInjector.get(LayerAnimationControllerFactory),
    () => null
  );
  const containerW = 600;
  const tree = (readOnly, stateReadOnly) => {
    const props = bottomWidgetSelector(
      {
        readOnly,
        sidePanelWidth: defaultProps.sidePanelWidth,
        visState: StateWFilters.visState,
        uiState: {...defaultProps.uiState, activeSidePanel: 'layer', readOnly: stateReadOnly},
        visStateActions: VisStateActions,
        uiStateActions: {toggleModal: () => {}}
      },
      theme
    );
    return (
      <ThemeProvider theme={theme}>
        <Widget {...props} containerW={containerW} />
      </ThemeProvider>
    );
  };
  const view = render(tree(false, false));
  const width = () => window.getComputedStyle(view.container.firstChild).width;
  const sidebarWidth = defaultProps.sidePanelWidth + theme.sidePanel.margin.left;
  try {
    t.equal(width(), `${containerW - sidebarWidth}px`, 'reserves space for a visible sidebar');
    view.rerender(tree(true, false));
    t.equal(width(), `${containerW}px`, 'the readOnly prop releases hidden sidebar space');
    view.rerender(tree(false, true));
    t.equal(width(), `${containerW}px`, 'read-only UI state releases hidden sidebar space');
    view.rerender(tree(false, false));
    t.equal(width(), `${containerW - sidebarWidth}px`, 'restores space when the sidebar returns');
  } finally {
    view.unmount();
  }
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

  const settingsButton = wrapper.find('button[data-testid="time-widget-settings"]').hostNodes();
  t.equal(settingsButton.length, 1, 'should expose Settings directly');
  settingsButton.simulate('click');
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
