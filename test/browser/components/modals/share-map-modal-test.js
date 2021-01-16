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
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import sinon from 'sinon';
import ShareMapUrlModalFactory, {SharingUrl} from 'components/modals/share-map-modal';

import CloudTile from 'components/modals/cloud-tile';
import StatusPanel from 'components/modals/status-panel';
const ShareMapUrlModal = ShareMapUrlModalFactory();

test('Components -> ShareMapUrlModal.mount', t => {
  const onSetCloudProvider = sinon.spy();

  // mount
  t.doesNotThrow(() => {
    mountWithTheme(
      <IntlWrapper>
        <ShareMapUrlModal onSetCloudProvider={onSetCloudProvider} />
      </IntlWrapper>
    );
  }, 'Show not fail without props');
  t.ok(onSetCloudProvider.notCalled, 'should not call onSetCloudProvider when mount');

  t.end();
});

test('Components -> ShareMapUrlModal.mount with providers', t => {
  const onSetCloudProvider = sinon.spy();

  const mockProvider = {
    getAccessToken: () => true,
    name: 'taro'
  };
  // mount
  t.doesNotThrow(() => {
    mountWithTheme(
      <IntlWrapper>
        <ShareMapUrlModal onSetCloudProvider={onSetCloudProvider} cloudProviders={[mockProvider]} />
      </IntlWrapper>
    );
  }, 'Show not fail mount props');
  t.ok(onSetCloudProvider.calledWithExactly('taro'), 'should set default provider when mount');

  const wrapper = mountWithTheme(
    <IntlWrapper>
      <ShareMapUrlModal
        onSetCloudProvider={onSetCloudProvider}
        cloudProviders={[mockProvider]}
        currentProvider="hello"
      />
    </IntlWrapper>
  );
  t.ok(onSetCloudProvider.calledOnce, 'should not set default provider if it is already set');

  t.ok(wrapper.find(CloudTile).length === 1, 'should render 1 cloud provider');
  t.ok(wrapper.find(StatusPanel).length === 0, 'should not render StatusPanel');

  t.end();
});

test('Components -> ShareMapUrlModal.mount with isLoading', t => {
  const mockProvider = {
    getAccessToken: () => true,
    name: 'taro'
  };
  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ShareMapUrlModal
          isProviderLoading
          onSetCloudProvider={() => {}}
          cloudProviders={[mockProvider]}
        />
      </IntlWrapper>
    );
  }, 'Show not fail mount with isProviderLoading');

  t.ok(
    wrapper.find(StatusPanel).length === 1,
    'should render StatusPanel when isProviderLoading=true'
  );

  wrapper = mountWithTheme(
    <IntlWrapper>
      <ShareMapUrlModal
        providerError="something is wrong"
        onSetCloudProvider={() => {}}
        cloudProviders={[mockProvider]}
      />
    </IntlWrapper>
  );
  t.ok(wrapper.find(StatusPanel).length === 1, 'should render StatusPanel when error');
  t.equal(wrapper.find('.notification-item--message').length, 1, 'should render 1 message');
  t.equal(
    wrapper
      .find('.notification-item--message')
      .find('p')
      .text(),
    'something is wrong',
    'should render error msg'
  );
  t.end();
});

test('Components -> ShareMapUrlModal.mount with SharingUrl', t => {
  const shareUrl = 'http://taro-and-blue';
  const mockProvider = {
    getAccessToken: () => true,
    name: 'taro'
  };

  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ShareMapUrlModal
          successInfo={{shareUrl}}
          cloudProviders={[mockProvider]}
          currentProvider="taro"
          onSetCloudProvider={() => {}}
        />
      </IntlWrapper>
    );
  }, 'Show not fail mount with successInfo');

  t.ok(wrapper.find(SharingUrl).length === 1, 'should render SharingUrl when loading');

  t.equal(
    wrapper
      .find(SharingUrl)
      .find('input')
      .props().value,
    shareUrl,
    'should render with successInfo.shareUrl'
  );

  t.end();
});
