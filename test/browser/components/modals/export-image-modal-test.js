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
  SelectionButton,
  TippyTooltip
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

  const transparentBackgroundInput = wrapper.find('input#export-transparent-background').at(0);
  t.equal(
    transparentBackgroundInput.prop('checked'),
    false,
    'transparent background should be disabled by default'
  );
  transparentBackgroundInput.simulate('change');
  t.ok(
    onUpdateImageSetting.calledWith({transparentBackground: true}),
    'should call update transparent background'
  );

  const transparentBackgroundHelp = wrapper.find('.transparent-background-help').at(0);
  t.equal(transparentBackgroundHelp.text(), '(?)', 'should render a helper trigger');
  t.equal(
    transparentBackgroundHelp.prop('aria-label'),
    'Hide basemap',
    'should describe the helper trigger'
  );
  t.equal(
    wrapper.find(TippyTooltip).at(0).prop('render')().props.children,
    'Hide basemap',
    'should show the basemap explanation in the helper tooltip'
  );

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
    '<img class="preview-image-placeholder" alt="Map preview" src="data:image/png;base64,2i3u">',
    'should render image with src'
  );

  t.equal(
    wrapper.find('.preview-image').html(),
    '<div class="preview-image"><div class="preview-image-container"><img class="preview-image-placeholder" alt="Map preview" src="data:image/png;base64,2i3u"></div></div>',
    'should render preview image with src'
  );

  t.end();
});

test('Components -> ExportImageModal.preview transparent image', t => {
  const imageDataUri = 'data:image/png;base64,2i3u';
  const exportImage = {
    ...INITIAL_UI_STATE.exportImage,
    imageDataUri,
    transparentBackground: true,
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
          onUpdateImageSetting={() => {}}
          cleanupExportImage={() => {}}
        />
      </IntlWrapper>
    );
  }, 'Should not fail with a transparent preview image');

  t.equal(
    wrapper.find('.preview-image--transparent').length,
    1,
    'should show a checkerboard behind a transparent image'
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
