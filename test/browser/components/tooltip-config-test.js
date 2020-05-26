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
import sinon from 'sinon';
import test from 'tape';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import TooltipConfigFactory from 'components/side-panel/interaction-panel/tooltip-config';
import {StateWTrips} from 'test/helpers/mock-state';

test('TooltipConfig - render', t => {
  const DataSetTag = () => <div className="dataset-tag" />;
  const TooltipConfig = TooltipConfigFactory(DataSetTag);
  const datasets = StateWTrips.visState.datasets;
  const config = {
    fieldsToShow: {
      test_trip_data: [
        {
          name: 'tpep_pickup_datetime',
          format: null
        },
        {
          name: 'tpep_dropoff_datetime',
          format: null
        },
        {
          name: 'fare_amount',
          format: null
        }
      ]
    },
    enabled: true
  };
  const onChange = sinon.spy();
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <TooltipConfig onChange={onChange} config={config} datasets={datasets} />
      </IntlWrapper>
    );
  }, 'Should render');

  t.equal(wrapper.find(TooltipConfig).length, 1, 'Should display 1 TooltipConfig');
  t.end();
});
