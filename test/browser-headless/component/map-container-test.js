// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

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
// import {Map} from 'react-map-gl'; // see other TODO below
import {gl, InteractionTestRunner} from '@deck.gl/test-utils';

import {mockKeplerProps, expectedLayerHoverProp} from '../../helpers/mock-state';
import {act} from 'react-dom/test-utils';

const MapContainer = appInjector.get(MapContainerFactory);
const MapPopover = appInjector.get(MapPopoverFactory);
const MapControl = appInjector.get(MapControlFactory);
const initialProps = mapFieldsSelector(mockKeplerProps);

test('MapContainerFactory - display all options', t => {
  const onMapStyleLoaded = sinon.spy();
  const onLayerClick = sinon.spy();

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
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapViewStateContextProvider mapState={props.mapState}>
          <MapContainer {...props} />
        </MapViewStateContextProvider>
      </IntlWrapper>
    );
  }, 'MapContainer should not fail');

  t.equal(wrapper.find(MapControl).length, 1, 'Should display 1 MapControl');

  // TODO: why is this failing without Map in quotes
  t.equal(wrapper.find('Map').length, 1, 'Should display 1 Map');
  // Can't test overlay because mapboxgl is not supported in chromium
  t.equal(wrapper.find('Attribution').length, 1, 'Should display 1 Attribution');

  const instance = wrapper.find('MapContainer').instance();

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
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapViewStateContextProvider mapState={props.mapState}>
          <MapContainer {...props} />
        </MapViewStateContextProvider>
      </IntlWrapper>
    );
  }, 'MapContainer should not fail');

  const instance = wrapper.find('MapContainer').instance();
  const _renderDeckOverlay = sinon.spy(instance, '_renderDeckOverlay');
  act(() => instance.forceUpdate());
  wrapper.update();

  t.ok(_renderDeckOverlay.calledOnce, '_renderDeckOverlay be called once');

  const args = _renderDeckOverlay.args[0];
  _renderDeckOverlay.restore();

  // Getting the DeckGl instance
  const divWrapper = instance._renderDeckOverlay(...args);
  const DeckGl = divWrapper.props.children;

  const clickEvents = [];
  const hoverEvents = [];

  function onBeforeEvents() {
    // reset logs
    clickEvents.length = 0;
    hoverEvents.length = 0;
  }
  const expectedCoordinate = [31.21911171679643, 30.040037294002644];
  const expectedInfo = {
    color: {0: 16, 1: 0, 2: 0, 3: 1},
    coordinate: expectedCoordinate,
    index: 15,
    // layer: {}, only test id
    // object: {data: allData[15], position: [], index: 15}, // test seperately
    picked: true,
    pixel: [192, 187],
    // viewport: {}, // not tested
    x: 192,
    y: 187
  };

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
        events: [{type: 'mousemove', x: 200, y: 200}, {wait: 50}],
        onBeforeEvents,
        // eslint-disable-next-line max-statements
        onAfterEvents: () => {
          assert.is(hoverEvents.length, 1, 'onHover is called');
          assert.is(hoverEvents[0].info.index, 15, 'object is picked');
          assert.is(hoverEvents[0].info.picked, true, 'object is picked');
          assert.is(hoverEvents[0].info.mapIndex, 0, 'onHover includes mapIndex value');

          [
            // test picking info
            ('color', 'coordinate', 'pixel', 'x', 'y')
          ].forEach(key => {
            assert.deepEqual(
              hoverEvents[0].info[key],
              expectedInfo[key],
              `picking info.${key} should be correct`
            );
          });

          // test picking info.object
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

          // asign info object to to state and test map popover
          const propsWithHoverInfo = {
            ...initialProps,
            mapboxApiAccessToken: 'pyx-11',
            visState: {
              ...initialProps.visState,
              hoverInfo: hoverEvents[0].info,
              mousePos: {
                ...initialProps.visState.mousePos,
                coordinate: expectedCoordinate,
                mousePosition: [200, 200]
              }
            }
          };

          t.doesNotThrow(() => {
            wrapper = mountWithTheme(
              <IntlWrapper>
                <MapViewStateContextProvider mapState={propsWithHoverInfo.mapState}>
                  <MapContainer {...propsWithHoverInfo} />
                </MapViewStateContextProvider>
              </IntlWrapper>
            );
          }, 'render map container with map popover should not fail');

          t.equal(wrapper.find(MapPopover).length, 1, 'should render 1 MapPopover');
          const mapPopoverProps = wrapper.find(MapPopover).at(0).props();

          // test MapPopoverProp
          testMapPopoverProp(t, mapPopoverProps);
          t.equal(wrapper.find('.map-popover').length, 3, 'should render .map-popover');
          t.equal(wrapper.find('table').length, 1, 'should render 1 table');

          const table = wrapper.find('table').at(0);
          const rows = table.find('.layer-hover-info__row');
          t.equal(rows.length, 5, 'should render 5 rows');

          const expectedTooltips = [
            ['gps_data.utc_timestamp', '2016-09-17 00:24:24'],
            ['gps_data.types', 'driver_analytics'],
            ['epoch', '1472754400000'],
            ['has_result', ''],
            ['uid', '1']
          ];

          for (let i = 0; i < 5; i++) {
            t.equal(
              rows.at(i).find('.row__name').text(),
              expectedTooltips[i][0],
              'row name should be correct'
            );
            t.equal(
              rows.at(i).find('.row__value').text(),
              expectedTooltips[i][1],
              'row value should be correct'
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

function testMapPopoverProp(t, mapPopoverProp) {
  const expected = {
    container: 'test exist',
    coordinate: false,
    frozen: false,
    layerHoverProp: 'test seperate',
    onClose: 'test exist',
    x: 200,
    y: 200,
    zoom: 13,
    onSetFeatures: sinon.spy(),
    setSelectedFeature: sinon.spy(),
    featureCollection: {type: 'FeatureCollection', features: []}
  };
  t.deepEqual(
    Object.keys(mapPopoverProp).sort(),
    Object.keys(expected).sort(),
    'MapPopover should receive corrent props'
  );

  t.equal(
    mapPopoverProp.coordinate,
    expected.coordinate,
    `MapPopover.props.coordinate should be correct`
  );
  t.equal(mapPopoverProp.frozen, expected.frozen, `MapPopover.props.frozen should be correct`);
  t.equal(mapPopoverProp.x, expected.x, `MapPopover.props.x should be correct`);
  t.equal(mapPopoverProp.y, expected.y, `MapPopover.props.y should be correct`);
  t.equal(mapPopoverProp.zoom, expected.zoom, `MapPopover.props.zoom should be correct`);

  testlayerHoverProp(t, mapPopoverProp.layerHoverProp);
}

function testlayerHoverProp(t, layerHoverProp) {
  t.deepEqual(
    Object.keys(layerHoverProp).sort(),
    Object.keys(expectedLayerHoverProp).sort(),
    'layerHoverProp should have corrent props'
  );

  t.equal(
    layerHoverProp.currentTime,
    expectedLayerHoverProp.currentTime,
    `layerHoverProp.currentTime should be correct`
  );

  t.equal(
    layerHoverProp.data.values(),
    expectedLayerHoverProp.data.values(),
    `layerHoverProp.data should be correct`
  );

  t.equal(
    layerHoverProp.fields,
    expectedLayerHoverProp.fields,
    `layerHoverProp.fields should be correct`
  );

  t.equal(
    layerHoverProp.fieldsToShow,
    expectedLayerHoverProp.fieldsToShow,
    `layerHoverProp.fieldsToShow should be correct`
  );
  t.equal(
    layerHoverProp.layer,
    expectedLayerHoverProp.layer,
    `layerHoverProp.layer should be correct`
  );
}

/*
test('MapContainerFactory - _renderEditorContextMenu', t => {
  const props = {
    ...initialProps,
    mapboxApiAccessToken: 'pyx-11'
  };
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapViewStateContextProvider mapState={props.mapState}>
          <MapContainer {...props} />
        </MapViewStateContextProvider>
      </IntlWrapper>
    );
  }, 'MapContainer should not fail with intial props');

  const instance = wrapper.find('MapContainer').instance();
  const _renderEditorContextMenu = sinon.spy(instance, '_renderEditorContextMenu');
  instance.forceUpdate();
  wrapper.update();

  t.ok(_renderEditorContextMenu.calledOnce, '_renderEditorContextMenu be called once');

  const args = _renderEditorContextMenu.args[0];
  _renderEditorContextMenu.restore();

  // React-map-gl doesnt render overlays when mapboxgl is not supported
  // here we manually calling the render function to test Editor
  const editor = instance._renderEditorContextMenu(...args);

  let editorWrapper;
  t.doesNotThrow(() => {
    editorWrapper = mountWithTheme(<IntlWrapper>{editor}</IntlWrapper>);
  }, 'Editor render should not fail');

  t.equal(editorWrapper.find(Editor).length, 1, 'should render 1 Editor');
  t.end();
});
*/
