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
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import sinon from 'sinon';
import test from 'tape';
import {
  appInjector,
  MapContainerFactory,
  EditorFactory,
  MapControlFactory,
  MapPopoverFactory
} from 'components';
import MapboxGLMap from 'react-map-gl';
import Tippy from '@tippyjs/react/headless';
import {gl, InteractionTestRunner} from '@deck.gl/test-utils';

import {mapFieldsSelector} from 'components/kepler-gl';
import {mockKeplerProps} from '../../helpers/mock-state';

const MapContainer = appInjector.get(MapContainerFactory);
const MapPopover = appInjector.get(MapPopoverFactory);
const MapControl = appInjector.get(MapControlFactory);
const Editor = appInjector.get(EditorFactory);
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
        <MapContainer {...props} />
      </IntlWrapper>
    );
  }, 'MapContainer should not fail');

  t.equal(wrapper.find(MapControl).length, 1, 'Should display 1 MapControl');

  t.equal(wrapper.find(MapboxGLMap).length, 1, 'Should display 1 InteractiveMap');
  // Can't test overlay because mapboxgl is not supported in chromium
  t.equal(wrapper.find('Attribution').length, 1, 'Should display 1 Attribution');

  const instance = wrapper.find(MapContainer).instance();

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
        <MapContainer {...props} />
      </IntlWrapper>
    );
  }, 'MapContainer should not fail');

  const instance = wrapper.find(MapContainer).instance();
  const _renderDeckOverlay = sinon.spy(instance, '_renderDeckOverlay');
  instance.forceUpdate();
  wrapper.update();

  t.ok(_renderDeckOverlay.calledOnce, '_renderDeckOverlay be called once');

  const args = _renderDeckOverlay.args[0];
  _renderDeckOverlay.restore();

  // Getting the DeckGl instance
  const DeckGl = instance._renderDeckOverlay(...args);

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
        hoverEvents.push({info, event});
      }
    },
    getTestCases: assert => [
      {
        name: 'hover',
        events: [{type: 'mousemove', x: 200, y: 200}, {wait: 50}],
        onBeforeEvents,
        onAfterEvents: ({deck, layers}) => {
          assert.is(hoverEvents.length, 1, 'onHover is called');
          assert.is(hoverEvents[0].info.index, 15, 'object is picked');
          assert.is(hoverEvents[0].info.picked, true, 'object is picked');
          assert.deepEqual(
            layers[0].state.model.getUniforms().picking_uSelectedColor,
            [16, 0, 0],
            'autoHighlight parameter is set'
          );

          // test picking info
          ['color', 'coordinate', 'pixel', 'x', 'y'].forEach(key => {
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
                <MapContainer {...propsWithHoverInfo} />
              </IntlWrapper>
            );
          }, 'render map container with map popover should not fail');

          t.equal(wrapper.find(MapPopover).length, 1, 'should render 1 MapPopover');
          // map control and map popover both uses Tippy
          t.equal(wrapper.find(Tippy).length, 2, 'should render Tippy');
          t.equal(wrapper.find('table').length, 1, 'should render 1 table');

          const table = wrapper.find('table').at(0);
          const rows = table.find('.row');
          t.equal(rows.length, 5, 'should render 5 rows');
          const tippyProps = wrapper
            .find(Tippy)
            .at(1)
            .props();

          const expectedClientRect = {
            bottom: 200,
            height: 0,
            left: 200,
            right: 200,
            top: 200,
            width: 0
          };

          t.deepEqual(
            tippyProps.getReferenceClientRect(),
            expectedClientRect,
            'getReferenceClientRect should return correct rect'
          );

          const expectedTooltips = [
            ['gps_data.utc_timestamp', '2016-09-17 00:24:24'],
            ['gps_data.types', 'driver_analytics'],
            ['epoch', '1472754400000'],
            ['has_result', ''],
            ['id', '1']
          ];

          for (let i = 0; i < 5; i++) {
            t.equal(
              rows
                .at(i)
                .find('.row__name')
                .text(),
              expectedTooltips[i][0],
              'row name should be correct'
            );
            t.equal(
              rows
                .at(i)
                .find('.row__value')
                .text(),
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

test('MapContainerFactory - _renderDrawEditor', t => {
  const props = {
    ...initialProps,
    mapboxApiAccessToken: 'pyx-11'
  };
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapContainer {...props} />
      </IntlWrapper>
    );
  }, 'MapContainer should not fail with intial props');

  const instance = wrapper.find(MapContainer).instance();
  const _renderDrawEditor = sinon.spy(instance, '_renderDrawEditor');
  instance.forceUpdate();
  wrapper.update();

  t.ok(_renderDrawEditor.calledOnce, '_renderDrawEditor be called once');

  const args = _renderDrawEditor.args[0];
  _renderDrawEditor.restore();

  // React-map-gl doesnt render overlays when mapboxgl is not supported
  // here we manually calling the render function to test Editor
  const editor = instance._renderDrawEditor(...args);

  let editorWrapper;
  t.doesNotThrow(() => {
    editorWrapper = mountWithTheme(<IntlWrapper>{editor}</IntlWrapper>);
  }, 'Editor render should not fail');

  t.equal(editorWrapper.find(Editor).length, 1, 'should render 1 Editor');
  t.end();
});
