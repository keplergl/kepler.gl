// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, renderHook} from '@testing-library/react';
import useOnClickOutside from './use-on-click-outside';

function Popover({onClose, disabled = false}) {
  const ref = useOnClickOutside<HTMLDivElement>(onClose, disabled);
  return (
    <div ref={ref} data-testid="popover">
      <button>Inside</button>
    </div>
  );
}

describe('useOnClickOutside', () => {
  test('ignores container and descendant clicks, forwarding the outside event once', () => {
    const onClose = jest.fn();
    const {getByTestId, getByRole} = render(<Popover onClose={onClose} />);

    fireEvent.click(getByTestId('popover'));
    fireEvent.click(getByRole('button'));
    expect(onClose).not.toHaveBeenCalled();

    const event = new MouseEvent('click', {bubbles: true});
    fireEvent(document.body, event);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith(event);
  });

  test('detects outside clicks even when their bubbling is stopped', () => {
    const onClose = jest.fn();
    const {getByText} = render(
      <>
        <Popover onClose={onClose} />
        <button onClick={event => event.stopPropagation()}>Outside</button>
      </>
    );

    fireEvent.click(getByText('Outside'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('honors disabled initially and after enabling, disabling and re-enabling', () => {
    const onClose = jest.fn();
    const {rerender} = render(<Popover onClose={onClose} disabled />);
    fireEvent.click(document.body);
    expect(onClose).not.toHaveBeenCalled();

    rerender(<Popover onClose={onClose} />);
    fireEvent.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<Popover onClose={onClose} disabled />);
    fireEvent.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(<Popover onClose={onClose} />);
    fireEvent.click(document.body);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('replaces the callback without retaining old listeners', () => {
    const first = jest.fn();
    const second = jest.fn();
    const {rerender} = render(<Popover onClose={first} />);
    rerender(<Popover onClose={second} />);
    fireEvent.click(document.body);

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  test('ignores clicks before the ref is assigned and follows the current target', () => {
    const onClose = jest.fn();
    const {result} = renderHook(() => useOnClickOutside<HTMLDivElement>(onClose));
    const first = document.createElement('div');
    const second = document.createElement('div');
    document.body.append(first, second);
    try {
      fireEvent.click(first);
      expect(onClose).not.toHaveBeenCalled();

      result.current.current = first;
      fireEvent.click(first);
      expect(onClose).not.toHaveBeenCalled();

      result.current.current = second;
      fireEvent.click(second);
      expect(onClose).not.toHaveBeenCalled();
      fireEvent.click(first);
      expect(onClose).toHaveBeenCalledTimes(1);
    } finally {
      first.remove();
      second.remove();
    }
  });

  test('unmount removes its listener without affecting another mounted observer', () => {
    const first = jest.fn();
    const second = jest.fn();
    const firstHook = renderHook(() => useOnClickOutside<HTMLDivElement>(first));
    const secondHook = renderHook(() => useOnClickOutside<HTMLDivElement>(second));
    // Keep refs assigned after unmount so a leaked listener cannot hide behind a null ref.
    firstHook.result.current.current = document.createElement('div');
    secondHook.result.current.current = document.createElement('div');

    firstHook.unmount();
    fireEvent.click(document.body);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);

    secondHook.unmount();
    fireEvent.click(document.body);
    expect(second).toHaveBeenCalledTimes(1);
  });
});
