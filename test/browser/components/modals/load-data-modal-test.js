// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {STYLED_COMPONENTS_DUPLICATED_ENTRIES} from '../../../helpers/utils';
import {
  LoadDataModalFactory,
  ModalTabItem,
  LoadStorageMapFactory,
  FileUploadFactory,
  appInjector
} from '@kepler.gl/components';

const LoadDataModal = appInjector.get(LoadDataModalFactory);
const LoadStorageMap = appInjector.get(LoadStorageMapFactory);
const FileUpload = appInjector.get(FileUploadFactory);

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

  t.equal(
    wrapper.find('.file-uploader').length,
    STYLED_COMPONENTS_DUPLICATED_ENTRIES,
    'should render FileUpload'
  );
  t.equal(
    wrapper.find('.load-data-modal__tab').length,
    STYLED_COMPONENTS_DUPLICATED_ENTRIES,
    'should render ModalTabs'
  );
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

test('Components -> LoadDataModal -> auto create layers', t => {
  const onFileUpload = sinon.spy();
  const onTilesetAdded = sinon.spy();
  const onConfirmAddData = sinon.spy();
  const onClose = sinon.spy();
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <LoadDataModal
        onFileUpload={onFileUpload}
        onTilesetAdded={onTilesetAdded}
        onConfirmAddData={onConfirmAddData}
        onClose={onClose}
        stagedToAdd={[{info: {label: 'points.csv'}}]}
      />
    </IntlWrapper>
  );

  const checkbox = () => wrapper.find('.add-data-bar').find('Checkbox').first();
  t.equal(checkbox().props().checked, true, 'auto create layers is checked by default');
  t.equal(
    wrapper.find('.file-uploader .auto-create-layers').length,
    0,
    'checkbox sits in the footer'
  );

  checkbox().simulate('change');
  t.equal(checkbox().props().checked, false, 'should uncheck auto create layers');

  const files = [{name: 'points.csv'}];
  const uploader = wrapper.find(FileUpload);
  t.ok(uploader.length > 0, 'should find the file uploader rendered by the modal');
  uploader.first().props().onFileUpload(files);
  t.deepEqual(onFileUpload.args[0][0], files, 'should upload the selected files');
  t.equal(onFileUpload.args[0][1], undefined, 'parsing waits to apply autoCreateLayers');

  const buttons = wrapper.find('.add-data-bar button');
  buttons.at(0).simulate('click');
  t.equal(onClose.calledOnce, true, 'cancel closes the modal');

  buttons.at(1).simulate('click');
  t.deepEqual(
    onConfirmAddData.args[0][0],
    {autoCreateLayers: false, datasets: [{info: {label: 'points.csv'}}]},
    'Add Data commits the current autoCreateLayers choice'
  );

  const fileCheckbox = wrapper.find('.upload-file-list').find('Checkbox').first();
  t.equal(fileCheckbox.props().checked, true, 'staged datasets start selected');
  fileCheckbox.simulate('change');
  t.equal(
    wrapper.find('.add-data-bar button').at(1).props().disabled,
    true,
    'Add Data waits until a dataset is checked'
  );
  wrapper.find('.add-data-bar button').at(1).simulate('click');
  t.equal(onConfirmAddData.callCount, 1, 'an unchecked dataset is not added');

  const tabs = wrapper.find('.load-data-modal__tab__item');
  let clickedTileset = false;
  for (let i = 0; i < tabs.length; i++) {
    if (tabs.at(i).text() === 'Tileset') {
      tabs.at(i).simulate('click');
      clickedTileset = true;
      break;
    }
  }
  t.equal(clickedTileset, true, 'should find the tileset tab');
  t.equal(
    wrapper.find('.add-data-bar').find('Checkbox').first().props().checked,
    false,
    'tileset tab keeps the unchecked choice'
  );
  t.equal(wrapper.find('.load-data-footer').length, 0, 'tileset confirm uses the shared footer');
  const tilesetButtons = wrapper.find('.add-data-bar button');
  t.equal(tilesetButtons.at(1).props().disabled, true, 'Add Data waits until the tileset is ready');
  t.equal(onTilesetAdded.called, false, 'opening the tileset tab does not add data');

  t.end();
});
