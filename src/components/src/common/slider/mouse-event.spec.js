// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import MouseEventHandler from './mouse-event';

function touchEvent(type, clientX, clientY) {
  const event = new Event(type, {bubbles: true, cancelable: true});
  Object.defineProperty(event, 'touches', {value: [{clientX, clientY}]});
  return event;
}

function createHandler(vertical = false, withAnchor = true) {
  const element = document.createElement('div');
  element.getBoundingClientRect = () => ({left: 100, bottom: 300});
  const track = {current: element};
  const valueListener = jest.fn();
  const toggleMouseOver = jest.fn();
  const setAnchor = jest.fn();
  const handler = new MouseEventHandler({
    vertical,
    track,
    valueListener,
    toggleMouseOver,
    setAnchor: withAnchor ? setAnchor : null
  });
  return {handler, track, valueListener, toggleMouseOver, setAnchor};
}

describe('slider drag events', () => {
  afterEach(() => {
    // End any active drag even if an assertion failed, keeping document listeners isolated.
    document.dispatchEvent(new MouseEvent('mouseup'));
    document.dispatchEvent(new Event('touchend'));
  });

  test.each([
    {vertical: false, anchor: 30, distance: 80},
    {vertical: true, anchor: -60, distance: -100}
  ])(
    'mouse drag reports track-relative distances (vertical=$vertical)',
    ({vertical, anchor, distance}) => {
      const drag = createHandler(vertical);
      drag.handler.handleMouseDown(new MouseEvent('mousedown', {clientX: 130, clientY: 240}));
      expect(drag.setAnchor).toHaveBeenCalledWith(anchor);
      expect(drag.toggleMouseOver).toHaveBeenCalledTimes(1);
      expect(drag.valueListener).not.toHaveBeenCalled();

      const move = new MouseEvent('mousemove', {
        clientX: 180,
        clientY: 200,
        buttons: 1,
        cancelable: true
      });
      document.dispatchEvent(move);
      expect(move.defaultPrevented).toBe(true);
      expect(drag.valueListener).toHaveBeenCalledWith(distance);

      document.dispatchEvent(new MouseEvent('mouseup'));
      const afterRelease = new MouseEvent('mousemove', {clientX: 250, cancelable: true});
      document.dispatchEvent(afterRelease);
      expect(afterRelease.defaultPrevented).toBe(false);
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(drag.valueListener).toHaveBeenCalledTimes(1);
      expect(drag.toggleMouseOver).toHaveBeenCalledTimes(2);
    }
  );

  test.each([
    {vertical: false, anchor: 30, distance: 80},
    {vertical: true, anchor: -60, distance: -100}
  ])(
    'touch drag reports track-relative distances (vertical=$vertical)',
    ({vertical, anchor, distance}) => {
      const drag = createHandler(vertical);
      drag.handler.handleTouchStart(touchEvent('touchstart', 130, 240));
      expect(drag.setAnchor).toHaveBeenCalledWith(anchor);
      expect(drag.toggleMouseOver).toHaveBeenCalledTimes(1);
      expect(drag.valueListener).not.toHaveBeenCalled();

      document.dispatchEvent(touchEvent('touchmove', 180, 200));
      expect(drag.valueListener).toHaveBeenCalledWith(distance);
      document.dispatchEvent(new Event('touchend'));
      document.dispatchEvent(touchEvent('touchmove', 250, 100));
      document.dispatchEvent(new Event('touchend'));
      expect(drag.valueListener).toHaveBeenCalledTimes(1);
      expect(drag.toggleMouseOver).toHaveBeenCalledTimes(2);
    }
  );

  test('handle drags work without an anchor callback and can be restarted', () => {
    const drag = createHandler(false, false);
    drag.handler.handleMouseDown(new MouseEvent('mousedown'));
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: 150, buttons: 1}));
    document.dispatchEvent(new MouseEvent('mouseup'));
    drag.handler.handleMouseDown(new MouseEvent('mousedown'));
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: 170, buttons: 1}));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(drag.setAnchor).not.toHaveBeenCalled();
    expect(drag.valueListener.mock.calls).toEqual([[50], [70]]);
    expect(drag.toggleMouseOver).toHaveBeenCalledTimes(4);
  });

  test('reads the current track position and tolerates a cleared track during drag', () => {
    const drag = createHandler();
    drag.handler.handleMouseDown(new MouseEvent('mousedown', {clientX: 150}));
    drag.track.current.getBoundingClientRect = () => ({left: 120, bottom: 320});
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: 150, buttons: 1}));
    drag.track.current = null;
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: 150, buttons: 1}));
    expect(drag.valueListener.mock.calls).toEqual([[30], [0]]);
  });

  test.each([false, true])(
    'a missed release stops the drag without canceling the next move (vertical=%s)',
    vertical => {
      const drag = createHandler(vertical);
      drag.handler.handleMouseDown(new MouseEvent('mousedown', {clientX: 130, clientY: 240}));
      const releasedMove = new MouseEvent('mousemove', {
        clientX: 180,
        clientY: 200,
        buttons: 0,
        cancelable: true
      });
      document.dispatchEvent(releasedMove);
      expect(releasedMove.defaultPrevented).toBe(false);
      expect(drag.valueListener).not.toHaveBeenCalled();
      expect(drag.toggleMouseOver).toHaveBeenCalledTimes(2);

      const selectionMove = new MouseEvent('mousemove', {buttons: 1, cancelable: true});
      document.dispatchEvent(selectionMove);
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(selectionMove.defaultPrevented).toBe(false);
      expect(drag.valueListener).not.toHaveBeenCalled();
      expect(drag.toggleMouseOver).toHaveBeenCalledTimes(2);

      drag.handler.handleMouseDown(new MouseEvent('mousedown', {clientX: 140, clientY: 230}));
      expect(drag.setAnchor).toHaveBeenLastCalledWith(vertical ? -70 : 40);
      document.dispatchEvent(new MouseEvent('mousemove', {clientX: 170, clientY: 210, buttons: 1}));
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(drag.valueListener).toHaveBeenCalledWith(vertical ? -90 : 70);
      expect(drag.toggleMouseOver).toHaveBeenCalledTimes(4);
    }
  );

  test.each(['mouse', 'touch'])('window blur ends a %s drag once and allows restart', input => {
    const drag = createHandler();
    const start = () =>
      input === 'mouse'
        ? drag.handler.handleMouseDown(new MouseEvent('mousedown'))
        : drag.handler.handleTouchStart(touchEvent('touchstart', 130, 240));
    const move = () =>
      input === 'mouse'
        ? new MouseEvent('mousemove', {clientX: 150, buttons: 1, cancelable: true})
        : touchEvent('touchmove', 150, 240);
    const end = () => document.dispatchEvent(new Event(input === 'mouse' ? 'mouseup' : 'touchend'));

    start();
    window.dispatchEvent(new Event('blur'));
    window.dispatchEvent(new Event('blur'));
    const canceledDragMove = move();
    document.dispatchEvent(canceledDragMove);
    end();
    expect(canceledDragMove.defaultPrevented).toBe(false);
    expect(drag.valueListener).not.toHaveBeenCalled();
    expect(drag.toggleMouseOver).toHaveBeenCalledTimes(2);

    start();
    document.dispatchEvent(move());
    end();
    expect(drag.valueListener).toHaveBeenCalledWith(50);
    expect(drag.toggleMouseOver).toHaveBeenCalledTimes(4);
  });

  test.each(['mouse', 'touch'])('destroy cleans up a %s drag without updating its owner', input => {
    const drag = createHandler();
    if (input === 'mouse') {
      drag.handler.handleMouseDown(new MouseEvent('mousedown'));
    } else {
      drag.handler.handleTouchStart(touchEvent('touchstart', 130, 240));
    }
    drag.handler.destroy();
    drag.handler.destroy();
    const move = new MouseEvent('mousemove', {clientX: 150, buttons: 1, cancelable: true});
    document.dispatchEvent(move);
    document.dispatchEvent(touchEvent('touchmove', 150, 240));
    document.dispatchEvent(new MouseEvent('mouseup'));
    document.dispatchEvent(new Event('touchend'));
    document.dispatchEvent(new Event('touchcancel'));
    window.dispatchEvent(new Event('blur'));
    expect(move.defaultPrevented).toBe(false);
    expect(drag.valueListener).not.toHaveBeenCalled();
    expect(drag.toggleMouseOver).toHaveBeenCalledTimes(1);
  });

  test('touch cancellation ends the drag once and allows a new drag', () => {
    const drag = createHandler();
    drag.handler.handleTouchStart(touchEvent('touchstart', 130, 240));
    document.dispatchEvent(new Event('touchcancel'));
    document.dispatchEvent(touchEvent('touchmove', 150, 240));
    document.dispatchEvent(new Event('touchend'));
    expect(drag.valueListener).not.toHaveBeenCalled();
    expect(drag.toggleMouseOver).toHaveBeenCalledTimes(2);

    drag.handler.handleTouchStart(touchEvent('touchstart', 150, 240));
    document.dispatchEvent(touchEvent('touchmove', 170, 240));
    document.dispatchEvent(new Event('touchend'));
    expect(drag.valueListener).toHaveBeenCalledWith(70);
    expect(drag.toggleMouseOver).toHaveBeenCalledTimes(4);
  });

  test.each(['mouse', 'touch'])('duplicate %s starts do not toggle the drag state again', input => {
    const drag = createHandler();
    for (let i = 0; i < 2; i++) {
      if (input === 'mouse') {
        drag.handler.handleMouseDown(new MouseEvent('mousedown'));
      } else {
        drag.handler.handleTouchStart(touchEvent('touchstart', 130, 240));
      }
    }
    expect(drag.toggleMouseOver).toHaveBeenCalledTimes(1);
    document.dispatchEvent(new Event(input === 'mouse' ? 'mouseup' : 'touchend'));
    expect(drag.toggleMouseOver).toHaveBeenCalledTimes(2);
  });

  test('destroying one handler leaves another slider drag active', () => {
    const first = createHandler();
    const second = createHandler();
    first.handler.handleMouseDown(new MouseEvent('mousedown'));
    second.handler.handleMouseDown(new MouseEvent('mousedown'));
    first.handler.destroy();
    const move = new MouseEvent('mousemove', {clientX: 150, buttons: 1, cancelable: true});
    document.dispatchEvent(move);
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(move.defaultPrevented).toBe(true);
    expect(first.valueListener).not.toHaveBeenCalled();
    expect(second.valueListener).toHaveBeenCalledWith(50);
    expect(first.toggleMouseOver).toHaveBeenCalledTimes(1);
    expect(second.toggleMouseOver).toHaveBeenCalledTimes(2);
  });
});
