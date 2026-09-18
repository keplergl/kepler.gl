// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import sinon from 'sinon';

import {IntlWrapper, mountWithTheme} from 'test/helpers/component-utils';
import {JsonEditor} from '@kepler.gl/components';

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
