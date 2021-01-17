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
import test from 'tape';
import {mountWithTheme} from 'test/helpers/component-utils';
import sinon from 'sinon';
import LoadStorageMapFactory from 'components/modals/load-storage-map';

import MockProvider from 'test/helpers/mock-provider';
import {appInjector} from 'components/container';

const mockProvider = new MockProvider();

const LoadStorageMap = appInjector.get(LoadStorageMapFactory);

test('Components -> LoadStorageMap.mount', t => {
  // mount
  const getSavedMaps = sinon.spy();

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <LoadStorageMap
        getSavedMaps={getSavedMaps}
        cloudProviders={[mockProvider]}
        currentProvider={null}
        onSetCloudProvider={() => {}}
      />
    );
  }, 'Show not fail without props');

  t.equal(wrapper.find('.provider-selection').length, 1, 'should render ProviderSelect');

  t.end();
});

test('Components -> LoadStorageMap.mount', t => {
  // mount
  const getSavedMaps = sinon.spy();

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <LoadStorageMap
        getSavedMaps={getSavedMaps}
        cloudProviders={[mockProvider]}
        currentProvider="taro"
        onSetCloudProvider={() => {}}
      />
    );
  }, 'Show not fail without props');

  t.equal(wrapper.find('.provider-selection').length, 0, 'should not render ProviderSelect');

  t.deepEqual(
    getSavedMaps.args,
    [[mockProvider]],
    'should call getSavedMaps when mount with mockProvider'
  );
  t.end();
});
