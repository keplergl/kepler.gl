// Copyright (c) 2019 Uber Technologies, Inc.
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
import {shallow} from 'enzyme';
import sinon from 'sinon';
import test from 'tape';
import MapControlFactory from 'components/map/map-control';

test('MapControlFactory - display all options', t => {

  const MapControl = MapControlFactory();
  const onToggleSplitMap = sinon.spy();
  const onTogglePerspective = sinon.spy();
  const onToggleMapControl = sinon.spy();
  const onSetEditorMode = sinon.spy();

  const $ = shallow(
    <MapControl
      mapControls={{
        splitMap: {show: true},
        visibleLayers: {show: true},
        toggle3d: {show: true},
        mapLegend: {show: true},
        mapDraw: {show: true}
      }}
      datasets={{}}
      layers={[]}
      layersToRender={{}}
      dragRotate={true}
      mapIndex={0}
      onToggleSplitMap={onToggleSplitMap}
      onTogglePerspective={onTogglePerspective}
      onToggleMapControl={onToggleMapControl}
      onSetEditorMode={onSetEditorMode}
    />
  );

  t.equal(
    $.find('ActionPanel').length,
    4,
    'Should show 4 action panels'
  );

  t.end();
});
