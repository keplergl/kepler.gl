// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {replaceMapControl} from '../../../examples/demo-app/src/factories/map-control';

jest.mock('@kepler.gl/components', () => {
  const React = require('react');
  const control = () => () => <div data-testid="map-controls" />;
  control.deps = [];
  const empty = () => () => null;
  const icon = () => null;
  return {
    withState: () => Component => Component,
    MapControlFactory: control,
    EffectControlFactory: empty,
    EffectManagerFactory: empty,
    AnnotationManagerFactory: empty,
    ChartControlFactory: empty,
    Icons: {
      Files: icon,
      CodeAlt: icon,
      Docs: icon,
      Close: props => <button {...props}>Close</button>
    },
    IconRoundSmall: ({children}) => <span>{children}</span>,
    LinkRenderer: ({children, ...props}) => <a {...props}>{children}</a>,
    MapControlButton: ({children, ...props}) => <button {...props}>{children}</button>
  };
});
jest.mock('@kepler.gl/components/charts', () => ({ChartManagerFactory: () => () => null}));
jest.mock('@kepler.gl/utils', () => ({getApplicationConfig: () => ({})}));
jest.mock(
  '@openassistant/kepler-assistant',
  () => ({AiAssistantControlFactory: () => () => null}),
  {
    virtual: true
  }
);
jest.mock('../../../examples/demo-app/src/components/map-control/sql-panel-control', () => ({
  __esModule: true,
  default: () => () => null
}));

function createControl() {
  const [, factory] = replaceMapControl();
  return factory(...factory.deps.map(dep => dep()));
}

describe('demo map controls without the retired release banner', () => {
  test.each([true, false])('does not read old banner preferences (%s)', preference => {
    localStorage.setItem('show-duckdb-preview-banner', String(preference));
    const getItem = jest.spyOn(Storage.prototype, 'getItem');
    const Control = createControl();
    const {container} = render(<Control top={0} />);
    expect(screen.getByTestId('map-controls')).toBeInTheDocument();
    expect(container.querySelector('.project-title')).toBeNull();
    expect(getItem).not.toHaveBeenCalledWith('show-duckdb-preview-banner');
    getItem.mockRestore();
    localStorage.clear();
  });

  test('preserves sample details and their close/reopen control', () => {
    const Control = createControl();
    render(<Control top={0} currentSample={{label: 'Sample map', description: 'Details'}} />);
    expect(screen.getByText('Sample map')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Sample map')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Sample map')).toBeInTheDocument();
  });
});
