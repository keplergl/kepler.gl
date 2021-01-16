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
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import sinon from 'sinon';
import test from 'tape';
import {appInjector, MapContainerFactory} from 'components';
import {mapFieldsSelector} from 'components/kepler-gl';
import {mockKeplerProps} from '../../helpers/mock-state';

const MapContainer = appInjector.get(MapContainerFactory);
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
    }
  };
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <MapContainer {...props} />
      </IntlWrapper>
    );
  }, 'MapContainer should not fail without props');

  t.equal(wrapper.find('MapControl').length, 1, 'Should display 1 MapControl');

  t.equal(wrapper.find('InteractiveMap').length, 1, 'Should display 1 InteractiveMap');

  // Editor
  t.equal(wrapper.find('StaticMap').length, 1, 'Should display 1 DeckGl');

  const instance = wrapper.find(MapContainer).instance();

  instance._onMapboxStyleUpdate();

  t.equal(onMapStyleLoaded.called, true, 'Should be calling onMapStyleLoaded');

  instance._onCloseMapPopover();
  t.equal(onLayerClick.called, true, 'Should be calling onLayerClick');

  t.end();
});
