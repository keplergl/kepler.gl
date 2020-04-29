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
import {GeocoderPanel} from 'components/geocoder-panel';

test('GeocoderPanel - render', t => {
  const enabled = true;
  const dispatch = sinon.spy();
  const mockGeoItem = {
    center: [0, 0],
    text: 'mock',
    bbox: [0, 0, 0, 0]
  };

  const mockGeoItemWithOutBbox = {
    center: [0, 0],
    text: 'mock'
  };

  const mockPayload = {
    datasets: [
      {
        data: {
          fields: [
            {
              name: 'lt',
              format: '',
              tableFieldIndex: 1,
              type: 'integer',
              analyzerType: 'INT'
            },
            {
              name: 'ln',
              format: '',
              tableFieldIndex: 2,
              type: 'integer',
              analyzerType: 'INT'
            },
            {
              name: 'icon',
              format: '',
              tableFieldIndex: 3,
              type: 'string',
              analyzerType: 'STRING'
            },
            {
              name: 'text',
              format: '',
              tableFieldIndex: 4,
              type: 'string',
              analyzerType: 'STRING'
            }
          ],
          rows: [[0, 0, 'place', 'mock']]
        },
        id: 'geocoder_dataset',
        info: {
          hidden: true,
          id: 'geocoder_dataset',
          label: 'geocoder_dataset'
        }
      }
    ],
    options: {
      keepExistingConfig: true
    },
    config: {
      version: 'v1',
      config: {
        visState: {
          layers: [
            {
              id: 'geocoder_layer',
              type: 'icon',
              config: {
                label: 'Geocoder Layer',
                color: [255, 0, 0],
                dataId: 'geocoder_dataset',
                columns: {
                  lat: 'lt',
                  lng: 'ln',
                  icon: 'icon',
                  label: 'text'
                },
                isVisible: true,
                hidden: true,
                visConfig: {
                  radius: 80
                }
              }
            }
          ]
        }
      }
    }
  };

  // const onLayerClick = sinon.spy();
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <GeocoderPanel
          isGeocoderEnabled={enabled}
          mapboxApiAccessToken="smoothie-the-cat"
          dispatch={dispatch}
        />
      </IntlWrapper>
    );
  }, 'Should render');

  t.equal(wrapper.find(GeocoderPanel).length, 1, 'Should display 1 GeoCoderPanel');
  t.equal(wrapper.find('Geocoder').length, 0, 'Should display 0 Geocoder because of invalid key');

  const instance = wrapper.find(GeocoderPanel).instance();

  instance.onSelected(null, mockGeoItem);
  t.deepEqual(
    dispatch.getCall(0).args,
    [{type: '@@kepler.gl/REMOVE_DATASET', key: 'geocoder_dataset'}],
    'Should be dispatching removeDataset action on onSelected'
  );
  t.deepEqual(
    dispatch.getCall(1).args,
    [{type: '@@kepler.gl/ADD_DATA_TO_MAP', payload: mockPayload}],
    'Should be dispatching addDataToMap action on onSelected'
  );
  t.deepEqual(
    dispatch.getCall(2).args,
    [{type: '@@kepler.gl/FIT_BOUNDS', payload: mockGeoItem.bbox}],
    'Should be dispatching fitBounds action on onSelected w/ bbox'
  );

  instance.onSelected(null, mockGeoItemWithOutBbox);
  t.deepEqual(
    dispatch.getCall(5).args,
    [{type: '@@kepler.gl/FIT_BOUNDS', payload: [-0.1, -0.1, 0.1, 0.1]}],
    'Should be dispatching fitBounds action on onSelected w/o bbox'
  );

  instance.removeMarker();
  t.deepEqual(
    dispatch.getCall(6).args,
    [{type: '@@kepler.gl/REMOVE_DATASET', key: 'geocoder_dataset'}],
    'Should be dispatching removeDataset action on removeMarker'
  );

  instance.removeGeocoderDataset();
  t.deepEqual(
    dispatch.getCall(7).args,
    [{type: '@@kepler.gl/REMOVE_DATASET', key: 'geocoder_dataset'}],
    'Should be dispatching removeDataset action on removeGeocoderDataset'
  );

  t.end();
});
