// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, cleanup, render, screen} from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import {observeDimensions, unobserveDimensions, useDimensions} from './observe-dimensions';

jest.mock('resize-observer-polyfill', () =>
  jest.fn().mockImplementation(() => ({observe: jest.fn(), unobserve: jest.fn()}))
);

const mockObserver = ResizeObserver as jest.MockedClass<typeof ResizeObserver>;
const targets: Element[] = [];

function target() {
  const element = document.createElement('div');
  targets.push(element);
  return element;
}

function deliver(element: Element, width?: number, height?: number) {
  const callback = mockObserver.mock.calls[0][0];
  callback(
    [
      {target: element, ...(width === undefined ? {} : {contentRect: {width, height}})}
    ] as ResizeObserverEntry[],
    mockObserver.mock.results[0].value
  );
}

afterEach(() => {
  cleanup();
  targets.splice(0).forEach(unobserveDimensions);
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe('observeDimensions', () => {
  test('routes shared observer notifications independently and ignores removed targets', () => {
    const first = target();
    const second = target();
    const firstResize = jest.fn();
    const secondResize = jest.fn();
    observeDimensions(first, firstResize, 0);
    observeDimensions(second, secondResize, 0);

    deliver(first, 120, 80);
    expect(firstResize).toHaveBeenLastCalledWith({width: 120, height: 80});
    expect(secondResize).not.toHaveBeenCalled();
    unobserveDimensions(first);
    deliver(first, 200, 100);
    deliver(second, 60, 40);
    expect(firstResize).toHaveBeenCalledTimes(1);
    expect(secondResize).toHaveBeenLastCalledWith({width: 60, height: 40});
    expect(mockObserver).toHaveBeenCalledTimes(1);
  });

  test('allows a removed target to be observed again without calling its old subscriber', () => {
    const element = target();
    const previous = jest.fn();
    const current = jest.fn();
    observeDimensions(element, previous, 0);
    unobserveDimensions(element);
    observeDimensions(element, current, 0);
    deliver(element, 0, 0);
    expect(previous).not.toHaveBeenCalled();
    expect(current).toHaveBeenCalledWith({width: 0, height: 0});
  });

  test('falls back to the target rectangle when a notification has no content rectangle', () => {
    const element = target();
    jest
      .spyOn(element, 'getBoundingClientRect')
      .mockReturnValue({width: 45, height: 30} as DOMRect);
    const resize = jest.fn();
    observeDimensions(element, resize, 0);
    deliver(element);
    expect(resize).toHaveBeenCalledWith({width: 45, height: 30});
  });

  test('throttles a resize burst and delivers the most recent dimensions', () => {
    jest.useFakeTimers();
    const element = target();
    const resize = jest.fn();
    observeDimensions(element, resize, 100);
    deliver(element, 10, 20);
    deliver(element, 30, 40);
    deliver(element, 50, 60);
    expect(resize).toHaveBeenCalledTimes(1);
    expect(resize).toHaveBeenLastCalledWith({width: 10, height: 20});
    jest.advanceTimersByTime(100);
    expect(resize).toHaveBeenCalledTimes(2);
    expect(resize).toHaveBeenLastCalledWith({width: 50, height: 60});
  });
});

function DimensionsView({delay = 0}: {delay?: number}) {
  const [ref, size] = useDimensions<HTMLDivElement>(undefined, delay);
  return (
    <div ref={ref} data-testid="dimensions">
      {size ? `${size.width}x${size.height}` : 'pending'}
    </div>
  );
}

test('useDimensions reports measurements and releases observation on unmount', () => {
  const {unmount} = render(<DimensionsView />);
  const element = screen.getByTestId('dimensions');
  const measure = jest.spyOn(element, 'getBoundingClientRect');
  measure.mockReturnValue({width: 70, height: 50} as DOMRect);
  expect(element).toHaveTextContent('pending');
  act(() => deliver(element, 70, 50));
  expect(element).toHaveTextContent('70x50');
  const observer = mockObserver.mock.results[0].value;
  expect(observer.observe).toHaveBeenCalledWith(element);
  unmount();
  expect(observer.unobserve).toHaveBeenCalledWith(element);
  measure.mockClear();
  act(() => deliver(element, 100, 100));
  expect(measure).not.toHaveBeenCalled();
});

test('useDimensions ignores a throttled notification queued before unmount', () => {
  jest.useFakeTimers();
  const {unmount} = render(<DimensionsView delay={100} />);
  const element = screen.getByTestId('dimensions');
  const measure = jest.spyOn(element, 'getBoundingClientRect');
  measure.mockReturnValue({width: 70, height: 50} as DOMRect);
  act(() => {
    deliver(element, 70, 50);
    deliver(element, 90, 60);
  });
  expect(element).toHaveTextContent('70x50');
  unmount();
  measure.mockClear();
  act(() => jest.advanceTimersByTime(100));
  expect(measure).not.toHaveBeenCalled();
});
