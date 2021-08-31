// Copyright (c) 2021 Uber Technologies, Inc.
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
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import MapControlFactory from 'components/map/map-control';
import {MapControlButton} from 'components/common/styled-components';

import {Cube3d, Split, Legend, DrawPolygon, Layers, Delete} from 'components/common/icons';

import {appInjector} from 'components';

const MapControl = appInjector.get(MapControlFactory);

test('MapControlFactory - display options', t => {
  const onToggleSplitMap = sinon.spy();
  const onTogglePerspective = sinon.spy();
  const onToggleMapControl = sinon.spy();
  const onSetEditorMode = sinon.spy();
  const onToggleEditorVisibility = sinon.spy();
  const onSetLocale = sinon.spy();

  const defaultProps = {
    mapControls: {
      splitMap: {show: true},
      visibleLayers: {show: true},
      toggle3d: {show: true},
      mapLegend: {show: true},
      mapDraw: {show: true},
      mapLocale: {show: true}
    },
    datasets: {},
    layers: [],
    locale: 'en',
    layersToRender: {},
    dragRotate: true,
    mapIndex: 0,
    onToggleSplitMap,
    onTogglePerspective,
    onToggleMapControl,
    onSetEditorMode,
    onToggleEditorVisibility,
    onSetLocale
  };

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapControl {...defaultProps} />{' '}
      </IntlWrapper>
    );
  }, 'BottomWidget should not fail without props');

  // layer selector is not active
  t.equal(wrapper.find(MapControlButton).length, 5, 'Should show 5 MapControlButton');

  t.equal(wrapper.find(Split).length, 1, 'Should show 1 split map button');
  t.equal(wrapper.find(Cube3d).length, 1, 'Should show 1 toggle 3d button');
  t.equal(wrapper.find(Legend).length, 1, 'Should show 1 map legend button');
  t.equal(wrapper.find(DrawPolygon).length, 1, 'Should show 1 map draw button');
  t.equal(wrapper.find('.map-control-button__locale').length, 1, 'Should show 1 locale  button');

  // with split map and active layer selector
  const nextProps = {
    ...defaultProps,
    isSplit: true,
    mapControls: {
      ...defaultProps.mapControls,
      visibleLayers: {show: true, active: false}
    }
  };

  wrapper.setProps({
    children: <MapControl {...nextProps} />
  });

  t.equal(wrapper.find(MapControlButton).length, 6, 'Should show 6 MapControlButton');
  t.equal(wrapper.find(Split).length, 0, 'Should show 0 split map split button');
  t.equal(wrapper.find(Delete).length, 1, 'Should show 1 split map delete button');
  t.equal(wrapper.find(Layers).length, 1, 'Should show 1 Layer button');

  // with 0 mapcontrols
  wrapper.setProps({
    children: <MapControl {...defaultProps} mapControls={{}} />
  });

  t.equal(wrapper.find(MapControlButton).length, 0, 'Should show 0 MapControlButton');

  t.end();
});
