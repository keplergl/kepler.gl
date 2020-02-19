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
import test from 'tape';
import {mountWithTheme} from 'test/helpers/component-utils';
import sinon from 'sinon';
import SaveMapModalFactory from 'components/modals/save-map-modal';

import CloudTile from 'components/modals/cloud-tile';
import ImagePreview from 'components/common/image-preview';
const SaveMapModal = SaveMapModalFactory();

test.only('Components -> SaveMapModal.mount', t => {
  const onUpdateImageSetting = sinon.spy();
  const onSetCloudProvider = sinon.spy();

  // mount
  t.doesNotThrow(() => {
    mountWithTheme(
      <SaveMapModal
        onUpdateImageSetting={onUpdateImageSetting}
        onSetCloudProvider={onSetCloudProvider}
      />
    );
  }, 'Show not fail without props');
  t.ok(onUpdateImageSetting.calledOnce, 'should call onUpdateImageSetting when mount');
  t.ok(onSetCloudProvider.notCalled, 'should not call onSetCloudProvider when mount');

  t.end();
});

test('Components -> SaveMapModal.mount with providers', t => {
  const onSetCloudProvider = sinon.spy();

  const mockProvider = {
    getAccessToken: () => true,
    name: 'taro'
  };
  // mount
  t.doesNotThrow(() => {
    mountWithTheme(
      <SaveMapModal
        onUpdateSetting={() => {}}
        onSetCloudProvider={onSetCloudProvider}
        cloudProviders={[mockProvider]}
      />
    );
  }, 'Show not fail mount props');
  t.ok(onSetCloudProvider.calledWithExactly('taro'), 'should set default provider when mount');

  const wrapper = mountWithTheme(
    <SaveMapModal
      onUpdateSetting={() => {}}
      onSetCloudProvider={onSetCloudProvider}
      cloudProviders={[mockProvider]}
      currentProvider="hello"
    />
  );
  t.ok(onSetCloudProvider.calledOnce, 'should not set default provider if it is already set');

  t.ok(wrapper.find(CloudTile).length === 1, 'should render 1 cloud provider');
  t.ok(wrapper.find(ImagePreview).length === 1, 'should render 1 ImagePreview');

  t.end();
});

test('Components -> SaveMapModal on change input', t => {
  const onSetMapInfo = sinon.spy();
  const eventObj = {target: {value: 'taro'}};

  let wrapper;
  // mount
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <SaveMapModal onUpdateSetting={() => {}} onSetMapInfo={onSetMapInfo} />
    );
  }, 'Show not fail mount props');

  wrapper.find('input#map-title').simulate('change', eventObj);

  t.ok(onSetMapInfo.calledWithExactly({title: 'taro'}), 'should set map title');

  wrapper.find('textarea#map-description').simulate('change', eventObj);

  t.ok(onSetMapInfo.calledWithExactly({description: 'taro'}), 'should set map description');

  t.end();
});

test('Components -> SaveMapModal on click provider', t => {
  const onSetCloudProvider = sinon.spy();
  const login = sinon.spy();
  const logout = sinon.spy();

  const mockProvider = {
    getAccessToken: () => true,
    name: 'taro',
    logout
  };

  const mockProvider2 = {
    getAccessToken: () => false,
    name: 'blue',
    login
  };

  let wrapper;
  // mount
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <SaveMapModal
        cloudProviders={[mockProvider, mockProvider2]}
        currentProvider="taro"
        onUpdateSetting={() => {}}
        onSetCloudProvider={onSetCloudProvider}
      />
    );
  }, 'Show not fail mount props');

  t.equal(wrapper.find('.provider-tile__wrapper').length, 2, 'should render 1 provider tile');

  // click taro to select
  wrapper
    .find('.provider-tile__wrapper')
    .at(0)
    .simulate('click');
  t.ok(onSetCloudProvider.calledWithExactly('taro'), 'should call onSetCloudProvider with taro');

  // click blue to login
  wrapper
    .find('.provider-tile__wrapper')
    .at(1)
    .simulate('click');
  t.ok(login.calledOnce, 'should call login');

  // call onSuccess after login to set current provider
  const onSuccess = login.args[0][0];
  onSuccess();
  t.ok(onSetCloudProvider.calledWithExactly('blue'), 'should call onSetCloudProvider with blue');

  // click taro to logout
  wrapper.find('.logout-button').simulate('click');
  t.ok(logout.calledOnce, 'should call logout');

  // call onSuccess after login to set current provider
  const onSuccessLogout = logout.args[0][0];
  onSuccessLogout();
  t.ok(onSetCloudProvider.calledWithExactly(null), 'should call onSetCloudProvider with null');

  t.end();
});
