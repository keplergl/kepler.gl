// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {defaultInteractionConfig} from '@kepler.gl/reducers';

import {useKeplerStateActions} from '../hooks/useKeplerStateActions';
import {CustomInteractionManager} from './CustomInteractionManager';

jest.mock('../hooks/useKeplerStateActions', () => ({useKeplerStateActions: jest.fn()}));
jest.mock('@sqlrooms/ui', () => ({
  useTheme: () => ({theme: 'dark'}),
  Switch: ({checked, onCheckedChange}) => (
    <input
      type="checkbox"
      role="switch"
      checked={checked}
      onChange={event => onCheckedChange(event.target.checked)}
    />
  ),
  Checkbox: ({checked, onCheckedChange}) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={event => onCheckedChange(event.target.checked)}
    />
  )
}));
jest.mock('./CustomTooltipConfig', () => ({CustomTooltipConfig: () => null}));

const mockUseKeplerStateActions = jest.mocked(useKeplerStateActions);

describe('CustomInteractionManager', () => {
  test.each([true, false])('keeps coordinates internal when the saved value is %s', enabled => {
    const interactionConfig = {
      ...defaultInteractionConfig,
      coordinate: {...defaultInteractionConfig.coordinate, enabled}
    };
    const interactionConfigChange = jest.fn();
    mockUseKeplerStateActions.mockReturnValue({
      keplerActions: {
        visStateActions: {interactionConfigChange, setColumnDisplayFormat: jest.fn()}
      } as any,
      keplerState: {visState: {interactionConfig, datasets: {}}} as any
    });

    render(<CustomInteractionManager mapId="map" />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.getAllByRole('switch')).toHaveLength(3);
    expect(interactionConfig.coordinate.enabled).toBe(enabled);
    expect(interactionConfigChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole('switch')[0]);
    expect(interactionConfigChange).toHaveBeenCalledWith({
      ...interactionConfig.tooltip,
      enabled: false
    });
  });
});
