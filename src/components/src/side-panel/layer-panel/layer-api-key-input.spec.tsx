// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {IntlProvider} from 'react-intl';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';
import LayerApiKeyInput, {API_KEY_MASK} from './layer-api-key-input';

function Wrapper({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <IntlProvider locale="en" messages={messages.en}>
        {children}
      </IntlProvider>
    </ThemeProvider>
  );
}

function input() {
  return screen.getByRole('textbox') as HTMLInputElement;
}

describe('layer access token replacement', () => {
  test('never puts the existing token in the rendered input or markup', () => {
    const {container} = render(
      <LayerApiKeyInput accessToken="stored-secret" onCommit={jest.fn()} />,
      {wrapper: Wrapper}
    );
    expect(input().value).toBe(API_KEY_MASK);
    expect(container.innerHTML).not.toContain('stored-secret');
    fireEvent.focus(input());
    expect(input().value).toBe('');
    expect(container.innerHTML).not.toContain('stored-secret');
  });

  test('commits a trimmed replacement on blur and masks the committed token', () => {
    const onCommit = jest.fn();
    const view = render(<LayerApiKeyInput accessToken="old" onCommit={onCommit} />, {
      wrapper: Wrapper
    });
    fireEvent.focus(input());
    fireEvent.change(input(), {target: {value: '  replacement  '}});
    fireEvent.blur(input());
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith('replacement');
    view.rerender(<LayerApiKeyInput accessToken="replacement" onCommit={onCommit} />);
    expect(input().value).toBe(API_KEY_MASK);
  });

  test.each(['', '   ', API_KEY_MASK, 'old'])(
    'does not replace an existing token with %p',
    value => {
      const onCommit = jest.fn();
      render(<LayerApiKeyInput accessToken="old" onCommit={onCommit} />, {wrapper: Wrapper});
      fireEvent.focus(input());
      fireEvent.change(input(), {target: {value}});
      fireEvent.blur(input());
      expect(onCommit).not.toHaveBeenCalled();
      expect(input().value).toBe(API_KEY_MASK);
    }
  );

  test('commits a first token with Enter by leaving the input', () => {
    const onCommit = jest.fn();
    render(<LayerApiKeyInput onCommit={onCommit} />, {wrapper: Wrapper});
    expect(input().value).toBe('');
    act(() => input().focus());
    fireEvent.change(input(), {target: {value: 'new-token'}});
    fireEvent.keyDown(input(), {key: 'Enter'});
    expect(onCommit).toHaveBeenCalledWith('new-token');
    expect(document.activeElement).not.toBe(input());
  });

  test.each(['copy', 'cut'])(
    'blocks %s while masked but allows clipboard use for an editable draft',
    eventType => {
      render(<LayerApiKeyInput accessToken="old" onCommit={jest.fn()} />, {wrapper: Wrapper});
      const maskedEvent = new Event(eventType, {bubbles: true, cancelable: true});
      fireEvent(input(), maskedEvent);
      expect(maskedEvent.defaultPrevented).toBe(true);
      fireEvent.focus(input());
      fireEvent.change(input(), {target: {value: 'draft'}});
      const draftEvent = new Event(eventType, {bubbles: true, cancelable: true});
      fireEvent(input(), draftEvent);
      expect(draftEvent.defaultPrevented).toBe(false);
    }
  );

  test('does not start a parent layer drag when the token field is pressed', () => {
    const onMouseDown = jest.fn();
    render(
      <div onMouseDown={onMouseDown}>
        <LayerApiKeyInput onCommit={jest.fn()} />
      </div>,
      {wrapper: Wrapper}
    );
    fireEvent.mouseDown(input());
    expect(onMouseDown).not.toHaveBeenCalled();
  });

  test('uses the latest callback and token when props change during editing', () => {
    const oldCommit = jest.fn();
    const newCommit = jest.fn();
    const view = render(<LayerApiKeyInput accessToken="old" onCommit={oldCommit} />, {
      wrapper: Wrapper
    });
    fireEvent.focus(input());
    fireEvent.change(input(), {target: {value: 'replacement'}});
    view.rerender(<LayerApiKeyInput accessToken="external-update" onCommit={newCommit} />);
    expect(input().value).toBe('replacement');
    fireEvent.blur(input());
    expect(oldCommit).not.toHaveBeenCalled();
    expect(newCommit).toHaveBeenCalledWith('replacement');
  });
});
