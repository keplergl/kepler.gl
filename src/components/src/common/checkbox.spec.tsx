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

    expect(inputs[0].id).not.toBe(inputs[1].id);
    expect(labels[0]).toHaveAttribute('for', inputs[0].id);
    expect(labels[1]).toHaveAttribute('for', inputs[1].id);
    expect(labels[1]).not.toContainElement(inputs[1]);

    fireEvent.click(screen.getByText('Second layer'));

    expect(onChangeSecond).toHaveBeenCalledTimes(1);
    expect(onChangeFirst).not.toHaveBeenCalled();
  });
});
