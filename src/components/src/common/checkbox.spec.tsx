// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';

import {renderWithTheme} from 'test/helpers/component-jest-utils';

import Checkbox from './checkbox';

describe('Checkbox', () => {
  test('associates each label with its own input when ids repeat', () => {
    const onChangeFirst = jest.fn();
    const onChangeSecond = jest.fn();
    const {container} = renderWithTheme(
      <>
        <Checkbox id="layer-visible" label="First layer" onChange={onChangeFirst} />
        <Checkbox id="layer-visible" label="Second layer" onChange={onChangeSecond} />
      </>
    );

    const inputs = container.querySelectorAll('input');
    const labels = container.querySelectorAll('label');

    expect(inputs[0]).toHaveAttribute('id', 'layer-visible');
    expect(inputs[1]).toHaveAttribute('id', 'layer-visible');
    expect(labels[0]).not.toHaveAttribute('for');
    expect(labels[1]).not.toHaveAttribute('for');
    expect(labels[0]).toContainElement(inputs[0]);
    expect(labels[1]).toContainElement(inputs[1]);

    fireEvent.click(screen.getByText('Second layer'));

    expect(onChangeSecond).toHaveBeenCalledTimes(1);
    expect(onChangeFirst).not.toHaveBeenCalled();
  });

  test('keeps the caller-provided id for external labels', () => {
    const onChange = jest.fn();
    const {container} = renderWithTheme(
      <>
        <label htmlFor="legend-layer-visible">Layer visibility</label>
        <Checkbox id="legend-layer-visible" onChange={onChange} />
      </>
    );

    expect(container.querySelector('input')).toHaveAttribute('id', 'legend-layer-visible');

    fireEvent.click(screen.getByText('Layer visibility'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
