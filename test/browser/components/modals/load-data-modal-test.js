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
import LoadDataModalFactory from 'components/modals/load-data-modal';
import {ModalTabItem} from 'components/modals/modal-tabs';
import LoadStorageMapFactory from 'components/modals/load-storage-map';

import {appInjector} from 'components/container';

const LoadDataModal = appInjector.get(LoadDataModalFactory);
const LoadStorageMap = appInjector.get(LoadStorageMapFactory);

test('Components -> LoadDataModal.mount', t => {
  // mount
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LoadDataModal />
      </IntlWrapper>
    );
  }, 'Show not fail without props');

  t.equal(wrapper.find('.file-uploader').length, 3, 'should render FileUpload');
  t.equal(wrapper.find('.load-data-modal__tab').length, 3, 'should render ModalTabs');
  t.equal(wrapper.find(LoadStorageMap).length, 0, 'should not render LoadStorageMap');
  t.end();
});

test('Components -> LoadDataModal -> custom loading method', t => {
  // mount
  const MockComp = () => <div className="taro" />;
  const MockTabComp = () => <div className="taro's tab" />;

  const loadingMethods = [
    {
      id: 'taro',
      label: 'Taro and Blue',
      elementType: MockComp,
      tabElementType: MockTabComp
    }
  ];

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <LoadDataModal loadingMethods={loadingMethods} />
      </IntlWrapper>
    );
  }, 'Show not fail without props');

  t.equal(wrapper.find(ModalTabItem).length, 1, 'should render 1 ModalTabItem');
  t.equal(wrapper.find(MockComp).length, 1, 'should render MockComp by default');
  t.equal(wrapper.find(MockTabComp).length, 1, 'should render MockTabComp');
  t.end();
});
