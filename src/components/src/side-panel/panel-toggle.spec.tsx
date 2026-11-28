// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {appInjector} from '@kepler.gl/components';
import {SIDEBAR_PANELS} from '@kepler.gl/constants';
import {IntlWrapper, renderWithTheme} from 'test/helpers/component-jest-utils';

import PanelToggleFactory from './panel-toggle';

const PanelToggle = appInjector.get(PanelToggleFactory);

const panels = SIDEBAR_PANELS.map(panel => ({...panel, iconComponent: () => null}));

function renderPanelToggle(props = {}) {
  const togglePanel = jest.fn();
  renderWithTheme(
    <IntlWrapper>
      <PanelToggle panels={panels} activePanel="layer" togglePanel={togglePanel} {...props} />
    </IntlWrapper>
  );
  return {togglePanel};
}

describe('PanelToggle', () => {
  test('exposes each sidebar panel as a named button with its selection state', () => {
    renderPanelToggle();

    const buttons = screen.getAllByRole('button');
    expect(buttons.map(button => button.getAttribute('aria-label'))).toEqual([
      'Layers',
      'Filters',
      'Interactions',
      'Base map'
    ]);

    expect(screen.getByRole('button', {name: 'Layers', pressed: true})).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Filters', pressed: false})).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Interactions', pressed: false})).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Base map', pressed: false})).toBeTruthy();
  });

  test('selects a panel from the keyboard', async () => {
    const user = userEvent.setup();
    const {togglePanel} = renderPanelToggle();

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Layers'}));

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Filters'}));
    await user.keyboard('{Enter}');
    expect(togglePanel).toHaveBeenLastCalledWith('filter');

    await user.tab();
    await user.keyboard(' ');
    expect(togglePanel).toHaveBeenLastCalledWith('interaction');
  });
});
