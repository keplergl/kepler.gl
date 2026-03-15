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

test('Components -> ExportImageModal.4:3 ratio dropdown', t => {
  const onUpdateImageSetting = sinon.spy();
  const cleanupExportImage = () => {};
  
  const exportImage = {
    ...INITIAL_UI_STATE.exportImage,
    ratio: 'FOUR_BY_THREE',
    resolution: '1280x960'
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
  }, 'Should not fail with 4:3 ratio');

  // Check that dropdown is rendered instead of buttons for 4:3 ratio
  const dropdown = wrapper.find('#export-image-modal__option_resolution select');
  t.equal(dropdown.length, 1, 'should render resolution dropdown for 4:3 ratio');
  
  // Check dropdown options
  const options = dropdown.find('option');
  const optionValues = options.map(opt => opt.prop('value'));
  const optionTexts = options.map(opt => opt.text());
  
  t.equal(options.length, 5, 'should have 5 options (placeholder + 4 resolutions)');
  t.equal(optionValues[0], '', 'first option should be empty placeholder');
  t.deepEqual(
    optionValues.slice(1),
    ['1024x768', '1280x960', '1600x1200', '1920x1440'],
    'should have correct 4:3 resolution values'
  );
  
  // Check selected value
  t.equal(dropdown.prop('value'), '1280x960', 'should have correct selected value');
  
  // Test selecting a different resolution
  onUpdateImageSetting.resetHistory();
  dropdown.simulate('change', { target: { value: '1600x1200' } });
  
  t.ok(
    onUpdateImageSetting.calledWith({resolution: '1600x1200'}),
    'should call onUpdateImageSetting with new resolution'
  );
  
  // Test selecting empty placeholder - should select first available
  onUpdateImageSetting.resetHistory();
  dropdown.simulate('change', { target: { value: '' } });
  
  t.ok(
    onUpdateImageSetting.calledWith({resolution: '1024x768'}),
    'should select first available resolution when empty is selected'
  );
  
  // Test selecting invalid value - should not update
  onUpdateImageSetting.resetHistory();
  dropdown.simulate('change', { target: { value: 'invalid-resolution' } });
  
  t.ok(
    onUpdateImageSetting.notCalled,
    'should not call onUpdateImageSetting with invalid resolution'
  );
  
  // Test selecting a value not in the filtered list (e.g., 16:9 resolution)
  onUpdateImageSetting.resetHistory();
  dropdown.simulate('change', { target: { value: '1920x1080' } });
  
  t.ok(
    onUpdateImageSetting.notCalled,
    'should not call onUpdateImageSetting with resolution from different ratio'
  );
  
  t.end();
});

test('Components -> ExportImageModal.16:9 ratio dropdown', t => {
  const onUpdateImageSetting = sinon.spy();
  const cleanupExportImage = () => {};
  
  const exportImage = {
    ...INITIAL_UI_STATE.exportImage,
    ratio: 'SIXTEEN_BY_NINE',
    resolution: '1920x1080'
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
  }, 'Should not fail with 16:9 ratio');

  // Check that dropdown is rendered for 16:9 ratio
  const dropdown = wrapper.find('#export-image-modal__option_resolution select');
  t.equal(dropdown.length, 1, 'should render resolution dropdown for 16:9 ratio');
  
  // Check dropdown options
  const options = dropdown.find('option');
  const optionValues = options.map(opt => opt.prop('value'));
  
  t.equal(options.length, 5, 'should have 5 options (placeholder + 4 resolutions)');
  t.equal(optionValues[0], '', 'first option should be empty placeholder');
  t.deepEqual(
    optionValues.slice(1),
    ['1280x720', '1600x900', '1920x1080', '2560x1440'],
    'should have correct 16:9 resolution values'
  );
  
  // Check selected value
  t.equal(dropdown.prop('value'), '1920x1080', 'should have correct selected value');
  
  // Test disabled state for unavailable options
  const disabledStates = options.map(opt => opt.prop('disabled'));
  t.deepEqual(
    disabledStates,
    [false, false, false, false, false],
    'all options should be enabled by default'
  );
  
  // Test selecting a different resolution
  onUpdateImageSetting.resetHistory();
  dropdown.simulate('change', { target: { value: '2560x1440' } });
  
  t.ok(
    onUpdateImageSetting.calledWith({resolution: '2560x1440'}),
    'should call onUpdateImageSetting with new resolution'
  );
  
  t.end();
});

test('Components -> ExportImageModal.ratio switching', t => {
  const onUpdateImageSetting = sinon.spy();
  const cleanupExportImage = () => {};
  
  let exportImage = {
    ...INITIAL_UI_STATE.exportImage,
    ratio: 'SCREEN',
    resolution: 'ONE_X'
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
  }, 'Should not fail with SCREEN ratio');

  // Initially should show buttons for SCREEN ratio
  t.equal(
    wrapper.find('#export-image-modal__option_resolution').find(SelectionButton).length,
    2,
    'should show resolution buttons for SCREEN ratio'
  );
  t.equal(
    wrapper.find('#export-image-modal__option_resolution select').length,
    0,
    'should not show dropdown for SCREEN ratio'
  );
  
  // Switch to 4:3 ratio
  onUpdateImageSetting.resetHistory();
  wrapper
    .find('#export-image-modal__option_ratio')
    .find(SelectionButton)
    .at(1) // 4:3 is the second option
    .simulate('click');
    
  t.ok(
    onUpdateImageSetting.calledWith({ratio: 'FOUR_BY_THREE'}),
    'should call onUpdateImageSetting with 4:3 ratio'
  );
  
  // Update wrapper with new ratio
  exportImage = {
    ...exportImage,
    ratio: 'FOUR_BY_THREE',
    resolution: '1280x960'
  };
  wrapper.setProps({
    children: (
      <ExportImageModal
        mapW={500}
        mapH={500}
        exportImage={exportImage}
        onUpdateImageSetting={onUpdateImageSetting}
        cleanupExportImage={cleanupExportImage}
      />
    )
  });
  wrapper.update();
  
  // Should now show dropdown for 4:3 ratio
  t.equal(
    wrapper.find('#export-image-modal__option_resolution select').length,
    1,
    'should show dropdown for 4:3 ratio'
  );
  t.equal(
    wrapper.find('#export-image-modal__option_resolution').find(SelectionButton).length,
    0,
    'should not show buttons for 4:3 ratio'
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
