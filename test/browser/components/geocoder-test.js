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

/* eslint-disable max-statements */
import React from 'react';
import sinon from 'sinon';
import test from 'tape';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import Geocoder from 'components/geocoder/geocoder';

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

test('Geocoder - render', t => {
  const onSelected = sinon.spy();
  const onDeleteMarker = sinon.spy();

  const mockMapState = {
    latitude: 33,
    longitude: 127,
    zoom: 8,
    width: 800,
    height: 800
  };

  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <Geocoder
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onSelected={onSelected}
          onDeleteMarker={onDeleteMarker}
          mapState={mockMapState}
        />
      </IntlWrapper>
    );
  }, 'Should render');

  t.equal(wrapper.find(Geocoder).length, 1, 'Should display 1 Geocoder');

  // const instance = wrapper.find(Geocoder);
  // const input = instance.find('.geocoder-input input');
  // input.simulate('change', {target: {value: 'boston'}});
  // TODO: implement hooks testing or rewrite Geocoder as component
  t.end();
});
