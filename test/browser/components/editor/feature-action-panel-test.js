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
import test from 'tape';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import {FeatureActionPanel} from 'components/editor/feature-action-panel';

test('FeatureActionPanel -> display layers', t => {
  const layers = [
    {
      config: {
        label: 'layer 1',
        dataId: 'puppy'
      }
    },
    {
      config: {
        label: 'layer 2',
        dataId: 'puppy'
      }
    }
  ];

  const datasets = {
    puppy: {
      color: [123,123,123]
    }
  };

  const onToggleLayer = sinon.spy();
  const onDeleteFeature = sinon.spy();

  const $ = shallow(
    <FeatureActionPanel
      className="action-item-test"
      layers={layers}
      datasets={datasets}
      onToggleLayer={onToggleLayer}
      onDeleteFeature={onDeleteFeature}
    />
  );

  t.equal(
    $.find('.layer-panel-item').length,
    2,
    'We should display only 2 action panel items'
  );

  t.end();

});
