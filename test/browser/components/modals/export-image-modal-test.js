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
import test from 'tape-catch';
import sinon from 'sinon';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import ExportImageModalFactory from 'components/modals/export-image-modal';
import ImagePreview from 'components/common/image-preview';
import {appInjector} from 'components/container';
import {SelectionButton} from 'components/common/styled-components';

import {INITIAL_UI_STATE} from 'reducers/ui-state-updaters';

const ExportImageModal = appInjector.get(ExportImageModalFactory);

test('Components -> ExportImageModal.mount', t => {
  const onUpdateImageSetting = sinon.spy();
  const cleanupExportImage = () => {};
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ExportImageModal
          mapW={500}
          mapH={500}
          exportImage={INITIAL_UI_STATE.exportImage}
          onUpdateImageSetting={onUpdateImageSetting}
          cleanupExportImage={cleanupExportImage}
        />
      </IntlWrapper>
    );
  }, 'Show not fail with props');

  t.ok(onUpdateImageSetting.calledTwice, 'should call onUpdateImageSetting when mount');
  t.deepEqual(onUpdateImageSetting.args, [[{exporting: true}], [{mapH: 500, mapW: 500}]]);

  t.equal(wrapper.find(ImagePreview).length, 1, 'should render ImagePreview');

  const ratioOpts = wrapper
    .find('#export-image-modal__option_ratio')
    .at(0)
    .find(SelectionButton)
    .map(c => c.text());

  t.deepEqual(ratioOpts, ['Original Screen', '4:3', '16:9'], 'should render correct ratio options');

  t.ok(
    wrapper
      .find('#export-image-modal__option_ratio')
      .at(0)
      .find(SelectionButton)
      .at(0)
      .props('selected'),
    'first option should be selected'
  );

  wrapper
    .find('#export-image-modal__option_ratio')
    .at(0)
    .find(SelectionButton)
    .at(0)
    .simulate('click');
  t.ok(onUpdateImageSetting.calledWith({ratio: 'SCREEN'}), 'should call update ratio');

  const resolutionOpts = wrapper
    .find('#export-image-modal__option_resolution')
    .at(0)
    .find(SelectionButton)
    .map(c => c.text());

  t.deepEqual(resolutionOpts, ['1x', '2x'], 'should render correct ratio options');

  t.ok(
    wrapper
      .find('#export-image-modal__option_resolution')
      .at(0)
      .find(SelectionButton)
      .at(0)
      .props('selected'),
    'first option should be selected'
  );

  wrapper
    .find('#export-image-modal__option_resolution')
    .at(0)
    .find(SelectionButton)
    .at(1)
    .simulate('click');

  t.ok(onUpdateImageSetting.calledWith({resolution: 'TWO_X'}), 'should call update resolution');

  t.end();
});

test('Components -> ExportImageModal.preview image', t => {
  const onUpdateImageSetting = sinon.spy();
  const cleanupExportImage = () => {};

  const imageDataUri = 'data:image/png;base64,2i3u';
  const exportImage = {
    ...INITIAL_UI_STATE.exportImage,
    imageDataUri,
    imageSize: {
      imageH: 500,
      imageW: 500
    }
  };
  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ExportImageModal
          mapW={500}
          mapH={500}
          exportImage={exportImage}
          onUpdateImageSetting={onUpdateImageSetting}
          cleanupExportImage={cleanupExportImage}
        />
      </IntlWrapper>
    );
  }, 'Show not fail with exportImage.imageDataUri');

  t.equal(
    wrapper.find('.preview-image-placeholder').html(),
    '<img class="preview-image-placeholder" src="data:image/png;base64,2i3u">',
    'should render image with src'
  );

  t.equal(
    wrapper.find('.preview-image').html(),
    '<div class="preview-image" style="width: 400px; height: 400px;"><img class="preview-image-placeholder" src="data:image/png;base64,2i3u"></div>',
    'should render preview image with src'
  );

  t.end();
});

test('Components -> ExportImageModal.unmount', t => {
  const onUpdateImageSetting = () => {};
  const cleanupExportImage = sinon.spy();

  let wrapper;
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ExportImageModal
          mapW={500}
          mapH={500}
          exportImage={INITIAL_UI_STATE.exportImage}
          onUpdateImageSetting={onUpdateImageSetting}
          cleanupExportImage={cleanupExportImage}
        />
      </IntlWrapper>
    );
  }, 'Show not fail with props');
  t.ok(cleanupExportImage.notCalled, 'should not call cleanupExportImage when mount');

  wrapper.unmount();
  t.ok(cleanupExportImage.calledOnce, 'should call cleanupExportImage when unmount');

  t.end();
});
