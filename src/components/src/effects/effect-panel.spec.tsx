// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {LIGHT_AND_SHADOW_EFFECT} from '@kepler.gl/constants';
import {Effect} from '@kepler.gl/types';
import {initApplicationConfig} from '@kepler.gl/utils';
import EffectPanelFactory, {EffectPanelProps} from './effect-panel';

// Keep the panel's state routing real, replacing child widgets with buttons that
// exercise their public callbacks rather than unrelated pointer/editor mechanics.
const Header = ((props: Record<string, any>) => (
  <div>
    <button onClick={props.onToggleEnabled}>Enable</button>
    <button onClick={props.onToggleEnableConfig}>Configure</button>
    <button onClick={props.onRemoveEffect}>Remove</button>
    {props.showJsonEditor && <button onClick={props.onToggleJsonEditor}>JSON</button>}
    {props.showSortHandle && <button disabled={!props.isDragNDropEnabled}>Reorder</button>}
  </div>
)) as Parameters<typeof EffectPanelFactory>[0];
const Configurator = (({effect, updateEffectConfig}: Record<string, any>) => (
  <button onClick={event => updateEffectConfig(event, effect.id, {parameters: {strength: 0}})}>
    Change parameter
  </button>
)) as Parameters<typeof EffectPanelFactory>[1];
const JsonEditor = (({onClose}: Record<string, any>) => (
  <button onClick={onClose}>Close JSON</button>
)) as Parameters<typeof EffectPanelFactory>[2];
const Panel = EffectPanelFactory(Header, Configurator, JsonEditor);
const original = {
  id: 'effect-a',
  type: 'brightnessContrast',
  isEnabled: true,
  isConfigActive: false,
  isJsonEditorActive: false
} as Effect;
function Wrapper({children}: {children: React.ReactNode}) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
function setup(changes: Partial<Effect> = {}, extra: Partial<EffectPanelProps> = {}) {
  const props = {
    className: '',
    effect: {...original, ...changes},
    isDraggable: true,
    listeners: {},
    removeEffect: jest.fn(),
    updateEffect: jest.fn(),
    onMouseDown: jest.fn(),
    onTouchStart: jest.fn(),
    ...extra
  };
  const view = render(<Panel {...props} />, {wrapper: Wrapper});
  return {...view, props};
}
beforeEach(() => initApplicationConfig({enableJsonEditors: true, enableEffectJsonEditor: true}));
afterEach(() => initApplicationConfig({}));

describe('effect panel state routing', () => {
  test('disables an enabled effect without rewriting other state', () => {
    const {props} = setup();
    fireEvent.click(screen.getByText('Enable'));
    expect(props.updateEffect).toHaveBeenCalledWith('effect-a', {isEnabled: false});
  });
  test('uses current effect identity and enabled state after replacement', () => {
    const {props, rerender} = setup();
    const updateEffect = jest.fn();
    rerender(
      <Panel
        {...props}
        effect={{...original, id: 'effect-b', isEnabled: false}}
        updateEffect={updateEffect}
      />
    );
    fireEvent.click(screen.getByText('Enable'));
    expect(updateEffect).toHaveBeenCalledWith('effect-b', {isEnabled: true});
    expect(props.updateEffect).not.toHaveBeenCalled();
  });
  test('opens a collapsed configurator and closes an expanded one', () => {
    const {props, rerender} = setup();
    expect(screen.queryByText('Change parameter')).toBeNull();
    fireEvent.click(screen.getByText('Configure'));
    expect(props.updateEffect).toHaveBeenLastCalledWith('effect-a', {isConfigActive: true});
    rerender(<Panel {...props} effect={{...original, isConfigActive: true}} />);
    expect(screen.getByText('Change parameter')).toBeTruthy();
    fireEvent.click(screen.getByText('Configure'));
    expect(props.updateEffect).toHaveBeenLastCalledWith('effect-a', {isConfigActive: false});
  });
  test('removes only the selected effect', () => {
    const {props} = setup();
    fireEvent.click(screen.getByText('Remove'));
    expect(props.removeEffect).toHaveBeenCalledTimes(1);
    expect(props.removeEffect).toHaveBeenCalledWith('effect-a');
    expect(props.updateEffect).not.toHaveBeenCalled();
  });
  test('forwards parameter edits including zero', () => {
    const {props} = setup({isConfigActive: true});
    fireEvent.click(screen.getByText('Change parameter'));
    expect(props.updateEffect).toHaveBeenCalledWith('effect-a', {parameters: {strength: 0}});
  });
  test('opening JSON also expands a collapsed panel', () => {
    const {props} = setup();
    fireEvent.click(screen.getByText('JSON'));
    expect(props.updateEffect).toHaveBeenCalledWith('effect-a', {
      isConfigActive: true,
      isJsonEditorActive: true
    });
  });
  test('closing JSON preserves expanded configuration and restores the normal editor', () => {
    const {props, rerender} = setup({isConfigActive: true, isJsonEditorActive: true});
    expect(screen.queryByText('Change parameter')).toBeNull();
    fireEvent.click(screen.getByText('Close JSON'));
    expect(props.updateEffect).toHaveBeenCalledWith('effect-a', {isJsonEditorActive: false});
    rerender(<Panel {...props} effect={{...original, isConfigActive: true}} />);
    expect(screen.getByText('Change parameter')).toBeTruthy();
    expect(screen.queryByText('Close JSON')).toBeNull();
  });
  test('toggling JSON in an expanded panel does not rewrite expansion', () => {
    const {props} = setup({isConfigActive: true, isJsonEditorActive: true});
    fireEvent.click(screen.getByText('JSON'));
    expect(props.updateEffect).toHaveBeenCalledWith('effect-a', {isJsonEditorActive: false});
  });
  test('disables reordering when drag is unavailable and omits it for lighting', () => {
    const {props, rerender} = setup({}, {isDraggable: false});
    expect(screen.getByText('Reorder')).toBeDisabled();
    rerender(
      <Panel {...props} isDraggable effect={{...original, type: LIGHT_AND_SHADOW_EFFECT.type}} />
    );
    expect(screen.queryByText('Reorder')).toBeNull();
  });
  test('honors the JSON editor feature flag', () => {
    initApplicationConfig({enableJsonEditors: true, enableEffectJsonEditor: false});
    setup();
    expect(screen.queryByText('JSON')).toBeNull();
    expect(screen.getByText('Configure')).toBeTruthy();
  });
});
