// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';

import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {JsonEditor, isJsonEditorEnabled} from '@kepler.gl/components';
import {initApplicationConfig} from '@kepler.gl/utils';

test('Components -> JsonEditor -> apply valid JSON', t => {
  const onApply = sinon.stub().returns({status: 'success', message: 'Config applied'});
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <JsonEditor jsonText={'{\n  "zoom": 9\n}'} onApply={onApply} />
      </IntlWrapper>
    );
  }, 'JsonEditor should mount');

  t.equal(
    wrapper.find('[data-testid="json-editor"]').hostNodes().length,
    1,
    'should render json editor'
  );
  t.equal(wrapper.find('textarea').length, 1, 'should render textarea');

  wrapper.find('textarea').simulate('change', {target: {value: '{\n  "zoom": 12\n}'}});
  wrapper.find('[data-testid="json-editor-apply"]').hostNodes().simulate('click');

  t.ok(onApply.calledOnce, 'should call onApply');
  t.equal(onApply.args[0][0], '{\n  "zoom": 12\n}', 'should pass edited JSON');

  t.end();
});

test('Components -> JsonEditor -> close button', t => {
  const onClose = sinon.spy();
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <JsonEditor jsonText={'{\n  "zoom": 9\n}'} onClose={onClose} />
      </IntlWrapper>
    );
  }, 'JsonEditor should mount with close button');

  t.equal(
    wrapper.find('[data-testid="json-editor-close"]').hostNodes().length,
    1,
    'should render close button'
  );

  wrapper.find('[data-testid="json-editor-close"]').hostNodes().simulate('click');
  t.ok(onClose.calledOnce, 'should call onClose');

  t.end();
});

test('Components -> JsonEditor -> section flags', t => {
  t.ok(isJsonEditorEnabled('layer'), 'layer JSON editor is enabled by default');
  t.ok(isJsonEditorEnabled('filter'), 'filter JSON editor is enabled by default');
  t.ok(isJsonEditorEnabled('effect'), 'effect JSON editor is enabled by default');
  t.ok(isJsonEditorEnabled('animation'), 'animation JSON editor is enabled by default');
  t.notOk(isJsonEditorEnabled('viewport'), 'viewport JSON editor is disabled by default');

  initApplicationConfig({enableLayerJsonEditor: false, enableViewportJsonEditor: true});
  t.notOk(isJsonEditorEnabled('layer'), 'layer JSON editor can be disabled');
  t.ok(isJsonEditorEnabled('viewport'), 'viewport JSON editor can be enabled');
  t.ok(isJsonEditorEnabled('filter'), 'other section flags stay unchanged');

  initApplicationConfig({enableJsonEditors: false});
  t.notOk(isJsonEditorEnabled('viewport'), 'master switch hides enabled sections');
  t.notOk(isJsonEditorEnabled('filter'), 'master switch hides default sections');

  initApplicationConfig({
    enableJsonEditors: true,
    enableLayerJsonEditor: true,
    enableViewportJsonEditor: false
  });
  t.end();
});
