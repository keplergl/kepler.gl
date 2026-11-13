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

      const move = new MouseEvent('mousemove', {clientX: 180, clientY: 200, cancelable: true});
      document.dispatchEvent(move);
      expect(move.defaultPrevented).toBe(true);
      expect(drag.valueListener).toHaveBeenCalledWith(distance);

      document.dispatchEvent(new MouseEvent('mouseup'));
      document.dispatchEvent(new MouseEvent('mousemove', {clientX: 250, clientY: 100}));
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
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: 150}));
    document.dispatchEvent(new MouseEvent('mouseup'));
    drag.handler.handleMouseDown(new MouseEvent('mousedown'));
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: 170}));
    document.dispatchEvent(new MouseEvent('mouseup'));
    expect(drag.setAnchor).not.toHaveBeenCalled();
    expect(drag.valueListener.mock.calls).toEqual([[50], [70]]);
    expect(drag.toggleMouseOver).toHaveBeenCalledTimes(4);
  });

  test('reads the current track position and tolerates a cleared track during drag', () => {
    const drag = createHandler();
    drag.handler.handleMouseDown(new MouseEvent('mousedown', {clientX: 150}));
    drag.track.current.getBoundingClientRect = () => ({left: 120, bottom: 320});
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: 150}));
    drag.track.current = null;
    document.dispatchEvent(new MouseEvent('mousemove', {clientX: 150}));
    expect(drag.valueListener.mock.calls).toEqual([[30], [0]]);
  });
});
