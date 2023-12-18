import React from 'react';
import test from 'tape-catch';
import sinon from 'sinon';

import {ExportVideoPanelContainer} from '@hubble.gl/react';
import {createHeadlessContext} from '@luma.gl/test-utils';

import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';

import {ExportVideoModalFactory, appInjector} from '@kepler.gl/components';
import {
  INITIAL_UI_STATE,
  INITIAL_VIS_STATE,
  INITIAL_MAP_STATE,
  INITIAL_MAP_STYLE
} from '@kepler.gl/reducers';

const ExportVideoModal = appInjector.get(ExportVideoModalFactory);

test('Components -> ExportVideoModal.mount', t => {
  const onUpdateVideoSetting = sinon.spy();
  let wrapper;

  const glContext = createHeadlessContext({width: 1280, height: 720});

  const mapStyle = {
    ...INITIAL_MAP_STYLE,
    bottomMapStyle: {id: 'id', owner: 'user'}
  };

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <ExportVideoModal
          exportVideo={INITIAL_UI_STATE.exportVideo}
          onUpdateVideoSetting={onUpdateVideoSetting}
          mapState={INITIAL_MAP_STATE}
          mapStyle={mapStyle}
          visState={INITIAL_VIS_STATE}
          glContext={glContext}
        />
      </IntlWrapper>
    );
  }, 'Show not fail with props');

  t.equal(
    wrapper.find(ExportVideoPanelContainer).length,
    1,
    'should render ExportVideoPanelContainer'
  );
  /*
  const ratioOpts = wrapper
    .find('#export-video-modal__option_ratio')
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
  */

  t.end();
});
