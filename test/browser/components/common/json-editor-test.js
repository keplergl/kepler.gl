// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';

import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {
  JsonEditor,
  isJsonEditorEnabled,
  jsonToEffectProps,
  jsonToFilterConfig
} from '@kepler.gl/components';
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

test('Components -> JsonEditor -> reset restores original JSON', t => {
  const onReset = sinon.spy();
  let wrapper;

  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <JsonEditor jsonText={'{\n  "zoom": 9\n}'} onReset={onReset} />
      </IntlWrapper>
    );
  }, 'JsonEditor should mount');

  t.equal(
    wrapper.find('[data-testid="json-editor-reset"]').hostNodes().length,
    0,
    'should hide reset until the JSON is edited'
  );

  wrapper.find('textarea').simulate('change', {target: {value: '{\n  "zoom": 12\n}'}});
  t.equal(
    wrapper.find('[data-testid="json-editor-reset"]').hostNodes().length,
    1,
    'should show reset after edit'
  );

  wrapper.find('[data-testid="json-editor-reset"]').hostNodes().simulate('click');
  t.ok(onReset.calledOnce, 'should call onReset');
  t.equal(
    wrapper.find('textarea').hostNodes().prop('value'),
    '{\n  "zoom": 9\n}',
    'should restore original JSON'
  );
  t.equal(
    wrapper.find('[data-testid="json-editor-reset"]').hostNodes().length,
    0,
    'should hide reset after restore'
  );

  t.end();
});

test('Components -> JsonEditor -> textarea has accessible name', t => {
  const wrapper = mountWithTheme(
    <IntlWrapper>
      <JsonEditor jsonText={'{\n  "zoom": 9\n}'} />
    </IntlWrapper>
  );

  t.equal(
    wrapper.find('textarea').prop('aria-label'),
    'JSON configuration',
    'should label the textarea'
  );
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

test('Components -> JsonEditor -> jsonToFilterConfig keeps identity fields', t => {
  const filter = {
    id: 'filter-1',
    type: 'range',
    dataId: ['dataset-a'],
    name: ['value'],
    value: [0, 10]
  };

  const next = jsonToFilterConfig(
    JSON.stringify({
      id: 'filter-2',
      type: 'timeRange',
      dataId: ['dataset-b'],
      value: [1, 5]
    }),
    filter
  );

  t.equal(next.id, 'filter-1', 'should keep filter id');
  t.equal(next.type, 'range', 'should keep filter type');
  t.deepEqual(next.dataId, ['dataset-a'], 'should keep filter dataId');
  t.deepEqual(next.value, [1, 5], 'should apply other edited fields');
  t.end();
});

test('Components -> JsonEditor -> jsonToEffectProps keeps id and type', t => {
  const effect = {id: 'e_ink', type: 'ink', isEnabled: true, parameters: {strength: 0.25}};

  const next = jsonToEffectProps(
    JSON.stringify({
      id: 'e_other',
      type: 'sepia',
      isEnabled: false,
      parameters: {strength: 0.8},
      deckEffect: {circular: true}
    }),
    effect
  );

  t.equal(next.id, 'e_ink', 'should keep effect id');
  t.equal(next.type, 'ink', 'should keep effect type');
  t.equal(next.isEnabled, false, 'should apply other edited fields');
  t.deepEqual(next.parameters, {strength: 0.8}, 'should apply parameters');
  t.notOk('deckEffect' in next, 'should drop runtime deckEffect');
  t.end();
});
