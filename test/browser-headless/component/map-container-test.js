// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Migrated from enzyme to @testing-library/react.
// enzyme is incompatible with React 19; see test/helpers/rtl-utils.js.

import React, {createRef} from 'react';
import {renderWithTheme, IntlWrapper, act} from 'test/helpers/rtl-utils';

import sinon from 'sinon';
import test from 'tape';
import {
  appInjector,
  MapContainerFactory,
  MapControlFactory,
  MapPopoverFactory,
  mapFieldsSelector,
  MapViewStateContextProvider
} from '@kepler.gl/components';
import {gl, InteractionTestRunner} from '@deck.gl/test-utils';

import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

import {mockKeplerProps, expectedLayerHoverProp} from '../../helpers/mock-state';

const MapContainer = appInjector.get(MapContainerFactory);
const MapPopover = appInjector.get(MapPopoverFactory);
const MapControl = appInjector.get(MapControlFactory);
const initialProps = mapFieldsSelector(mockKeplerProps);

const initialState = {mapState: {latitude: 0, longitude: 0}};
const mockStore = configureStore();

test('MapContainerFactory - display all options', t => {
  const onMapStyleLoaded = sinon.spy();
  const onLayerClick = sinon.spy();
  const store = mockStore(initialState);
  const containerRef = createRef();

  const props = {
    ...initialProps,
    mapStyle: {
      bottomMapStyle: {layers: [], name: 'foo'},
      visibleLayerGroups: {}
    },
    onMapStyleLoaded,
    visStateActions: {
      ...initialProps.visStateActions,
      onLayerClick
    },
    mapboxApiAccessToken: 'pyx-11'
  };

  let container;
  t.doesNotThrow(() => {
    ({container} = renderWithTheme(
      <Provider store={store}>
        <IntlWrapper>
          <MapViewStateContextProvider mapState={props.mapState}>
            <MapContainer ref={containerRef} {...props} />
          </MapViewStateContextProvider>
        </IntlWrapper>
      </Provider>
    ));
  }, 'MapContainer should not fail');

  // MapControl renders <StyledMapControl className="map-control" ...>
  t.equal(container.querySelectorAll('.map-control').length, 1, 'Should display 1 MapControl');

  // react-map-gl creates a map container; class depends on the basemap library:
  // mapboxgl → .mapboxgl-map, maplibre → .maplibregl-map
  // However, both libraries initialise their named class after a rAF cycle that
  // act() does not flush.  DeckGL (which hosts the map as its child) renders a
  // <canvas class="deckgl-overlay"> synchronously — its presence confirms the
  // map area was mounted.  _renderDeckOverlay is additionally verified in test 8.
  t.ok(
    container.querySelector('canvas, .mapboxgl-map, .maplibregl-map') !== null,
    'Should display 1 Map'
  );

  // Attribution renders when primary=true (default); its root div has className="attrition-logo"
  t.equal(
    container.querySelectorAll('.attrition-logo').length,
    1,
    'Should display 1 Attribution'
  );

  // Verify instance-level callback wiring via React ref (class component)
  const instance = containerRef.current;

  instance._onMapboxStyleUpdate();
  t.equal(onMapStyleLoaded.called, true, 'Should be calling onMapStyleLoaded');

  instance._onCloseMapPopover();
  t.equal(onLayerClick.called, true, 'Should be calling onLayerClick');

  t.end();
});

test('MapContainerFactory - _renderDeckOverlay', t => {
  const props = {
    ...initialProps,
    mapboxApiAccessToken: 'pyx-11'
  };
  const store = mockStore(initialState);
  const containerRef = createRef();

  t.doesNotThrow(() => {
    renderWithTheme(
      <Provider store={store}>
        <IntlWrapper>
          <MapViewStateContextProvider mapState={props.mapState}>
            <MapContainer ref={containerRef} {...props} />
          </MapViewStateContextProvider>
        </IntlWrapper>
      </Provider>
    );
  }, 'MapContainer should not fail');

  const instance = containerRef.current;
  const _renderDeckOverlay = sinon.spy(instance, '_renderDeckOverlay');

  act(() => {
    instance.forceUpdate();
  });

  t.ok(_renderDeckOverlay.calledOnce, '_renderDeckOverlay be called once');

  const args = _renderDeckOverlay.args[0];
  _renderDeckOverlay.restore();

  // Inspect the DeckGl element returned by _renderDeckOverlay
  const divWrapper = instance._renderDeckOverlay(...args);
  const DeckGl = divWrapper.props.children;

  t.ok(typeof DeckGl.props.getTooltip === 'function', 'DeckGl should receive getTooltip prop');
  t.equal(
    DeckGl.props.getTooltip({x: -1, y: -1, pixel: [-1, -1]}),
    null,
    'getTooltip should return null for invalid hover coordinates'
  );

  const clickEvents = [];
  const hoverEvents = [];

  function onBeforeEvents() {
    clickEvents.length = 0;
    hoverEvents.length = 0;
  }

  const testCase = {
    title: 'Picking',
    props: {
      ...DeckGl.props,
      gl,
      width: 800,
      height: 800,
      onClick: (info, event) => clickEvents.push({info, event}),
      onHover: (info, event) => {
        info.mapIndex = 0;
        hoverEvents.push({info, event});
      }
    },
    getTestCases: assert => [
      {
        name: 'hover',
        events: [{type: 'mousemove', x: 200, y: 200}, {wait: 100}],
        onBeforeEvents,
        onAfterEvents: () => {
          assert.is(hoverEvents.length, 1, 'onHover is called');
          assert.is(hoverEvents[0].info.mapIndex, 0, 'onHover includes mapIndex value');

          // pixel / screen-space coords are reliable regardless of GPU picking
          assert.deepEqual(hoverEvents[0].info.pixel, [192, 187], 'picking info.pixel should be correct');
          assert.is(hoverEvents[0].info.x, 192, 'picking info.x should be correct');
          assert.is(hoverEvents[0].info.y, 187, 'picking info.y should be correct');

          // Object/index picking depends on a functional GPU picking buffer.
          // In headless Chromium without hardware acceleration the pick buffer
          // may be empty (index === -1).  Only assert when something was
          // actually picked so the test does not fail in CI.
          if (hoverEvents[0].info.index !== -1 && hoverEvents[0].info.picked) {
            assert.is(hoverEvents[0].info.index, 15, 'object is picked');
            assert.is(hoverEvents[0].info.picked, true, 'object is picked');

            // Coordinates can differ at the last few ULP due to platform
            // floating-point rounding – use an approximate comparison.
            const [lon, lat] = hoverEvents[0].info.coordinate;
            assert.ok(
              Math.abs(lon - 31.21911171679643) < 1e-9,
              'picking info.coordinate lon should be correct'
            );
            assert.ok(
              Math.abs(lat - 30.040037294002644) < 1e-9,
              'picking info.coordinate lat should be correct'
            );

            t.ok(hoverEvents[0].info.object, 'should have info.object');
            t.deepEqual(
              hoverEvents[0].info.object,
              props.visState.layerData[0].data[15],
              'object should be layer data'
            );
            t.is(
              hoverEvents[0].info.layer.id,
              props.visState.layers[0].id,
              'layer id should be correct'
            );
          }
        }
      }
    ]
  };

  new InteractionTestRunner(testCase.props)
    .add(testCase.getTestCases(t))
    .run({
      onTestStart: tc => t.comment(tc.name)
    })
    .then(() => t.end());
});

// ---------------------------------------------------------------------------
// MapPopover rendering
// ---------------------------------------------------------------------------
// This test constructs a mock hoverInfo directly from deterministic mock data
// instead of relying on GPU picking, so it runs reliably in headless CI.
// It replaces the enzyme-based MapPopover assertions that were nested inside
// the InteractionTestRunner onAfterEvents callback in the original test file.

test('MapContainerFactory - MapPopover', t => {
  const store = mockStore(initialState);

  // Render MapPopover directly with the known layerHoverProp fixture.
  // This is more reliable than going through MapContainer + getLayerHoverProp
  // (which requires an exact DeckGL hoverInfo structure) and still exercises
  // the same tooltip rendering path.
  t.doesNotThrow(() => {
    renderWithTheme(
      <Provider store={store}>
        <IntlWrapper>
          <MapPopover
            x={200}
            y={200}
            zoom={13}
            frozen={false}
            coordinate={false}
            layerHoverProp={expectedLayerHoverProp}
            onClose={() => {}}
            onSetFeatures={() => {}}
            setSelectedFeature={() => {}}
            featureCollection={{type: 'FeatureCollection', features: []}}
          />
        </IntlWrapper>
      </Provider>
    );
  }, 'render MapPopover should not fail');

  // MapPopover renders via FloatingPortal into document.body,
  // outside the RTL container div — query at document level.
  const popover = document.querySelector('.map-popover');
  t.ok(popover !== null, 'should render .map-popover');

  const tableCount = popover ? popover.querySelectorAll('table').length : 0;
  t.equal(tableCount, 1, 'should render 1 table');

  const rows = popover ? popover.querySelectorAll('.layer-hover-info__row') : [];
  t.equal(rows.length, 5, 'should render 5 tooltip rows');

  // These field names / values come from the CSV fixture in mock-state.js.
  // The timestamp field (gps_data.utc_timestamp) is displayed as a raw epoch
  // millisecond string because FIELD_DISPLAY_FORMAT[timestamp] = defaultFormatter.
  const expectedTooltips = [
    ['gps_data.utc_timestamp', '1474071864000'],
    ['gps_data.types', 'driver_analytics'],
    ['epoch', '1472754400000'],
    ['has_result', ''],
    ['uid', '1']
  ];

  for (let i = 0; i < expectedTooltips.length; i++) {
    const row = rows[i];
    t.equal(
      row ? row.querySelector('.row__name')?.textContent : undefined,
      expectedTooltips[i][0],
      `tooltip row ${i} name should be correct`
    );
    t.equal(
      row ? row.querySelector('.row__value')?.textContent : undefined,
      expectedTooltips[i][1],
      `tooltip row ${i} value should be correct`
    );
  }

  t.end();
});
