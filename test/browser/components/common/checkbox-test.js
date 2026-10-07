// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {act} from 'react';
import test from 'tape';
import sinon from 'sinon';
import {mount} from 'enzyme';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {Checkbox} from '@kepler.gl/components';

// Label activation only happens for nodes that live in the document.
const mountInDocument = node => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const wrapper = mount(<ThemeProvider theme={theme}>{node}</ThemeProvider>, {
    attachTo: container
  });
  return {
    wrapper,
    cleanup: () => {
      act(() => wrapper.unmount());
      container.remove();
    }
  };
};

test('Components -> Checkbox -> label toggles its own input when ids repeat on the page', t => {
  const onChangeFirst = sinon.spy();
  const onChangeSecond = sinon.spy();
  // Two kepler.gl instances loaded with the same config render the same layer ids.
  const {wrapper, cleanup} = mountInDocument(
    <div>
      <Checkbox id="layer-1-visible-switch" onChange={onChangeFirst} />
      <Checkbox id="layer-1-visible-switch" onChange={onChangeSecond} />
    </div>
  );

  const secondLabel = wrapper.find('label.kg-checkbox__label').at(1).getDOMNode();
  act(() => secondLabel.click());

  t.equal(onChangeSecond.callCount, 1, 'should toggle the checkbox whose label was clicked');
  t.equal(onChangeFirst.callCount, 0, 'should not toggle the other checkbox with the same id');

  cleanup();
  t.end();
});

test('Components -> Checkbox -> keeps the given id on the input', t => {
  const onChange = sinon.spy();
  const {wrapper, cleanup} = mountInDocument(
    <div>
      <label htmlFor="legend-include-layer-1" className="external-label">
        Layer 1
      </label>
      <Checkbox id="legend-include-layer-1" onChange={onChange} />
    </div>
  );

  t.equal(
    wrapper.find('input').getDOMNode().id,
    'legend-include-layer-1',
    'should render the input with the id it was given'
  );

  const externalLabel = wrapper.find('label.external-label').getDOMNode();
  act(() => externalLabel.click());
  t.equal(onChange.callCount, 1, 'an external label pointing at the id should still toggle it');

  cleanup();
  t.end();
});
