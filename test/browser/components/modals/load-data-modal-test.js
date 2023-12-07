// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {
  LoadDataModalFactory,
  ModalTabItem,
  LoadStorageMapFactory,
  appInjector
} from '@kepler.gl/components';

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
