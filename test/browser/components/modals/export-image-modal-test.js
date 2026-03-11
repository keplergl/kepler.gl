// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape-catch';
import sinon from 'sinon';
import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import {
  ExportImageModalFactory,
  ImagePreview,
  appInjector,
  SelectionButton
} from '@kepler.gl/components';

import {INITIAL_UI_STATE} from '@kepler.gl/reducers';

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
      scale: 1,
      imageW: 500,
      imageH: 500
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
    '<img class="preview-image-placeholder" src="data:image/png;base64,2i3u" alt="Map preview">',
    'should render image with src'
  );

  t.equal(
    wrapper.find('.preview-image').html(),
    '<div class="preview-image"><div class="preview-image-container"><img class="preview-image-placeholder" src="data:image/png;base64,2i3u" alt="Map preview"></div></div>',
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
