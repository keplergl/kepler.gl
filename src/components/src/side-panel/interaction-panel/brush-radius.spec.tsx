// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {RangeSlider} from '@kepler.gl/components';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import BrushConfigFactory from './brush-config';

const BrushConfig = BrushConfigFactory(RangeSlider);

test('displays a saved zero radius', () => {
  renderWithTheme(<BrushConfig config={{size: 0}} onChange={jest.fn()} />);
  expect(screen.getByRole('spinbutton')).toHaveValue(0);
});

test('keeps the displayed radius in sync when dragging down to zero', () => {
  const width = jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(500);
  const onChange = jest.fn();
  function ControlledBrushConfig() {
    const [config, setConfig] = React.useState({size: 4});
    return (
      <BrushConfig
        config={config}
        onChange={nextConfig => {
          onChange(nextConfig);
          setConfig(nextConfig);
        }}
      />
    );
  }
  try {
    const {container} = renderWithTheme(<ControlledBrushConfig />);
    const handle = container.querySelectorAll('.kg-range-slider__handle')[1];
    fireEvent.mouseDown(handle, {clientX: 40});
    fireEvent.mouseMove(document, {clientX: 1});
    expect(onChange).toHaveBeenLastCalledWith({size: 0.1});
    expect(screen.getByRole('spinbutton')).toHaveValue(0.1);
    fireEvent.mouseMove(document, {clientX: 0});
    expect(onChange).toHaveBeenLastCalledWith({size: 0});
    expect(screen.getByRole('spinbutton')).toHaveValue(0);
  } finally {
    fireEvent.mouseUp(document);
    width.mockRestore();
  }
});
