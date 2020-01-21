// Copyright (c) 2020 Uber Technologies, Inc.
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
import {mount as render} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';
import MapContainerFactory from 'components/map-container';

test('MapContainerFactory - display all options', t => {
  const MapPopover = () => <div className="map-popover" />;
  const MapControl = () => <div className="map-control" />;
  const MapContainer = MapContainerFactory(MapPopover, MapControl);

  const updateMap = sinon.spy();
  const onMapStyleLoaded = sinon.spy();
  const onLayerClick = sinon.spy();

  const $ = render(
    <MapContainer
      mapState={{}}
      mapStyle={{
        bottomMapStyle: {layers: [], name: 'foo'},
        visibleLayerGroups: {}
      }}
      mapStateActions={{
        updateMap
      }}
      mapLayers={{}}
      layers={[]}
      filters={[]}
      datasets={{}}
      uiState={{
        mapControls: {
          splitMap: {show: true},
          visibleLayers: {show: true},
          toggle3d: {show: true},
          mapLegend: {show: true},
          mapDraw: {show: true}
        },
        editor: {}
      }}
      uiStateActions={{}}
      visStateActions={{
        onLayerClick
      }}
      interactionConfig={{
        tooltip: {
          enabled: true
        },
        coordinate: {
          enabled: true
        }
      }}
      layerBlending=""
      layerOrder={[]}
      layerData={[]}
      pinned={{
        coordinate: [0, 0]
      }}
      mapboxApiAccessToken=""
      editor={{
        features:[]
      }}
      onMapStyleLoaded={onMapStyleLoaded}
      mousePos={{
        mousePosition: [0, 0],
        coordinate: [0, 0],
        pinned: null
      }}
    />
  );

  t.equal(
    $.find('MapControl').length,
    1,
    'Should display 1 MapControl'
  );

  t.equal(
    $.find('InteractiveMap').length,
    1,
    'Should display 1 InteractiveMap'
  );

  // Editor
  t.equal(
    $.find('StaticMap').length,
    1,
    'Should display 1 DeckGl'
  );

  const instance = $.instance();

  instance._onMapboxStyleUpdate();

  t.equal(
    onMapStyleLoaded.called,
    true,
    'Should be calling onMapStyleLoaded'
  );

  instance._onCloseMapPopover();
  t.equal(
    onLayerClick.called,
    true,
    'Should be calling onLayerClick'
  );

  t.end();
});
