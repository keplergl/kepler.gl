// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, screen} from '@testing-library/react';
import {Filter, Timeline} from '@kepler.gl/types';
import {ANIMATION_WINDOW} from '@kepler.gl/constants';
import {RangeSlider as RealRangeSlider} from '@kepler.gl/components';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import TimeRangeSliderFactory from './time-range-slider';
import TimeRangeSliderTimeTitleFactory from './time-range-slider-time-title';
import AnimationControlFactory from './animation-control/animation-control';
import PlaybackControlsFactory from './animation-control/playback-controls';
import TimelineSliderFactory from './timeline-slider';

const PlaybackControls: ReturnType<typeof PlaybackControlsFactory> = ({
  startAnimation,
  resetAnimation
}) => (
  <>
    <button onClick={startAnimation}>Play</button>
    <button onClick={resetAnimation}>Reset</button>
  </>
);
const AnimationControl = AnimationControlFactory(
  PlaybackControls,
  () => <></>,
  ({setTimelineValue}) => (
    <button onClick={() => setTimelineValue([20, 80])}>Change selection</button>
  )
);
const TimeRangeSlider = TimeRangeSliderFactory(
  PlaybackControls,
  ({onChange}) => <button onClick={() => onChange?.([20, 80])}>Change selection</button>,
  React.memo(() => <></>),
  TimeRangeSliderTimeTitleFactory(),
  AnimationControl
);
const timeline: Timeline = {
  domain: [0, 100],
  value: [10, 90],
  speed: 1,
  isAnimating: false,
  step: 1
};

function setup(isMinified: boolean, showControls?: boolean) {
  const onChange = jest.fn();
  const toggleAnimation = jest.fn();
  const resetAnimation = jest.fn();
  const result = renderWithTheme(
    <TimeRangeSlider
      domain={[0, 100]}
      value={[10, 90]}
      step={1}
      speed={1}
      isAnimating={false}
      isEnlarged
      isMinified={isMinified}
      showControls={showControls}
      isTime={false}
      timeFormat="YYYY"
      timeline={timeline}
      onChange={onChange}
      toggleAnimation={toggleAnimation}
      resetAnimation={resetAnimation}
      exportAnimation={jest.fn()}
    />
  );
  return {...result, onChange, toggleAnimation, resetAnimation};
}

test.each([false, true])(
  'hides duplicate controls and preserves selection (minified=%s)',
  minified => {
    const {container, onChange} = setup(minified, false);
    expect(screen.queryByRole('button', {name: 'Play'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Reset'})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: 'Change selection'}));
    expect(onChange).toHaveBeenCalledWith([20, 80]);
    expect(container.querySelector('.time-range-slider__title')).toHaveStyle({width: '100%'});
    if (!minified) {
      expect(container.querySelector('.timeline-container')).toHaveStyle({width: '100%'});
    }
  }
);

test.each([false, true])('preserves playback controls by default (minified=%s)', minified => {
  const {container, toggleAnimation, resetAnimation} = setup(minified);
  fireEvent.click(screen.getByRole('button', {name: 'Play'}));
  fireEvent.click(screen.getByRole('button', {name: 'Reset'}));
  expect(toggleAnimation).toHaveBeenCalledTimes(1);
  expect(resetAnimation).toHaveBeenCalledTimes(1);
  expect(container.querySelector('.time-range-slider__title')).toHaveStyle({
    width: 'calc(100% - 195px)'
  });
});

test('preserves the zoomed chart viewport when cached time bins span the full filter domain', () => {
  const width = jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(212);
  const RealTimeRangeSlider = TimeRangeSliderFactory(
    PlaybackControls,
    RealRangeSlider,
    React.memo(() => <></>),
    TimeRangeSliderTimeTitleFactory(),
    AnimationControl
  );
  try {
    const {container} = renderWithTheme(
      <RealTimeRangeSlider
        domain={[500, 1500]}
        value={[500, 1500]}
        filter={{domain: [250, 1750]} as Filter}
        timeBins={{
          data: {
            second: [
              {x0: 0, x1: 1000, count: 1, indexes: [0]},
              {x0: 1000, x1: 2000, count: 1, indexes: [1]}
            ]
          }
        }}
        plotType={{type: 'histogram', interval: 'second'}}
        step={1}
        speed={1}
        isAnimating={false}
        showControls={false}
        isTime
        timeFormat="HH:mm:ss"
        timeline={{...timeline, domain: [250, 1750], value: [500, 1500]}}
        onChange={jest.fn()}
        toggleAnimation={jest.fn()}
      />
    );
    const bars = Array.from<SVGRectElement>(container.querySelectorAll('.histogram-bars rect'));
    expect(bars).toHaveLength(2);
    // The viewport bisects each outer bin instead of expanding back to show both whole bins.
    bars.forEach((bar, index) => {
      const plotWidth = Number(bar.closest('svg')?.getAttribute('width'));
      const center =
        (Number(bar.getAttribute('x')) + Number(bar.getAttribute('width')) / 2) / plotWidth;
      expect(center).toBeCloseTo(index);
    });
  } finally {
    width.mockRestore();
  }
});

describe('expanded timeline range dragging', () => {
  const ExpandedTimeRangeSlider = TimeRangeSliderFactory(
    PlaybackControls,
    RealRangeSlider,
    React.memo(() => <></>),
    TimeRangeSliderTimeTitleFactory(),
    AnimationControl
  );
  const svgDimensions = ['width', 'height'] as const;
  const svgDescriptors = svgDimensions.map(name =>
    Object.getOwnPropertyDescriptor(SVGSVGElement.prototype, name)
  );

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(212);
    // RangePlot normally omits D3 brushes in tests because jsdom lacks these SVG APIs.
    jest.spyOn(jest.requireMock('@kepler.gl/utils'), 'isTest').mockReturnValue(false);
    svgDimensions.forEach(name => {
      Object.defineProperty(SVGSVGElement.prototype, name, {
        configurable: true,
        get() {
          return {baseVal: {value: Number(this.getAttribute(name))}};
        }
      });
    });
  });

  afterEach(() => {
    fireEvent.mouseUp(window, {view: window});
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
    jest.restoreAllMocks();
    svgDimensions.forEach((name, index) => {
      const descriptor = svgDescriptors[index];
      if (descriptor) Object.defineProperty(SVGSVGElement.prototype, name, descriptor);
      else Reflect.deleteProperty(SVGSVGElement.prototype, name);
    });
  });

  test.each<{
    name: string;
    domain: [number, number];
    initialValue: [number, number];
    firstMove: [number, number];
    secondMove: [number, number];
    boundaries: [number, number];
  }>([
    {
      name: 'the full calendar-bin domain',
      domain: [250, 1750],
      initialValue: [500, 1000],
      firstMove: [750, 1250],
      secondMove: [1000, 1500],
      boundaries: [0, 2000]
    },
    {
      name: 'a zoomed viewport inside the calendar bins',
      domain: [500, 1500],
      initialValue: [750, 1000],
      firstMove: [875, 1125],
      secondMove: [1000, 1250],
      boundaries: [500, 1500]
    }
  ])(
    'moves the existing brush and resizes both ends within $name',
    ({domain, initialValue, firstMove, secondMove, boundaries}) => {
      const onChange = jest.fn();
      function ControlledTimeline() {
        const [value, setValue] = React.useState(initialValue);
        const update = React.useCallback((next: number[]) => {
          onChange(next);
          setValue([next[0], next[1]]);
        }, []);
        return (
          <ExpandedTimeRangeSlider
            domain={domain}
            value={value}
            filter={{domain: [250, 1750]} as Filter}
            timeBins={{
              data: {
                second: [
                  {x0: 0, x1: 1000, count: 1, indexes: [0]},
                  {x0: 1000, x1: 2000, count: 1, indexes: [1]}
                ]
              }
            }}
            plotType={{type: 'histogram', interval: 'second'}}
            step={1}
            speed={1}
            isAnimating={false}
            showControls={false}
            isTime
            timeFormat="HH:mm:ss"
            timeline={{...timeline, domain: [250, 1750], value}}
            onChange={update}
            toggleAnimation={jest.fn()}
          />
        );
      }
      const {container} = renderWithTheme(<ControlledTimeline />);
      function brushElement(selector: string) {
        const element = container.querySelector(`.kg-range-slider__brush ${selector}`);
        if (!element) throw new Error(`Missing brush element: ${selector}`);
        return element;
      }
      function move(clientX: number) {
        fireEvent.mouseMove(window, {clientX, clientY: 10, buttons: 1, view: window});
      }
      function release(clientX: number) {
        fireEvent.mouseUp(window, {clientX, clientY: 10, button: 0, view: window});
        act(() => jest.advanceTimersByTime(40));
      }
      function press(selector: string, clientX: number) {
        fireEvent.mouseDown(brushElement(selector), {
          clientX,
          clientY: 10,
          button: 0,
          view: window
        });
      }

      // Both fixtures start at pixels [50, 100] on a 200-pixel brush track.
      press('.selection', 75);
      move(100);
      act(() => jest.advanceTimersByTime(40));
      expect(onChange).toHaveBeenLastCalledWith(firstMove);
      move(125);
      release(125);
      expect(onChange).toHaveBeenLastCalledWith(secondMove);

      press('.handle--w', 100);
      move(-20);
      release(-20);
      expect(onChange).toHaveBeenLastCalledWith([boundaries[0], secondMove[1]]);

      press('.handle--e', 150);
      move(220);
      release(220);
      expect(onChange).toHaveBeenLastCalledWith(boundaries);

      const updateCount = onChange.mock.calls.length;
      move(100);
      act(() => jest.advanceTimersByTime(40));
      expect(onChange).toHaveBeenCalledTimes(updateCount);
    }
  );
});

describe('minimized timeline range dragging', () => {
  const RealTimelineSlider = TimelineSliderFactory();
  const MinimizedTimeRangeSlider = TimeRangeSliderFactory(
    PlaybackControls,
    RealRangeSlider,
    React.memo(() => <></>),
    TimeRangeSliderTimeTitleFactory(),
    AnimationControlFactory(PlaybackControls, () => <></>, RealTimelineSlider)
  );

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);
  });

  afterEach(() => {
    fireEvent.mouseUp(document);
    fireEvent.touchEnd(document);
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  function renderMinimized(initial: Timeline = {...timeline, value: [20, 60]}) {
    const onChange = jest.fn();
    function ControlledTimeline() {
      const [value, setValue] = React.useState(initial.value);
      const update = React.useCallback((next: number[]) => {
        onChange(next);
        setValue([next[0], next[1]]);
      }, []);
      return (
        <MinimizedTimeRangeSlider
          domain={initial.domain ?? undefined}
          value={Array.isArray(value) ? value : [value, value]}
          step={initial.step ?? 1}
          speed={1}
          isAnimating={false}
          isMinified
          showControls={false}
          isTime={false}
          timeFormat="YYYY"
          timeline={{...initial, value}}
          animationWindow={initial.animationWindow ?? undefined}
          onChange={update}
          toggleAnimation={jest.fn()}
        />
      );
    }
    const result = renderWithTheme(<ControlledTimeline />);
    const bar = result.container.querySelector('.kg-range-slider__bar') as HTMLElement;
    return {...result, bar, onChange};
  }

  test('moves both ends together through rapid mouse moves', () => {
    const {bar, onChange} = renderMinimized();
    fireEvent.mouseDown(bar, {clientX: 40});
    fireEvent.mouseMove(document, {clientX: 50});
    fireEvent.mouseMove(document, {clientX: 60});
    fireEvent.mouseMove(document, {clientX: 70});
    fireEvent.mouseUp(document);
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenLastCalledWith([50, 90]);

    fireEvent.mouseMove(document, {clientX: 80});
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenLastCalledWith([50, 90]);
  });

  test('moves a narrow selection while both endpoints remain independently resizable', () => {
    const {bar, container, onChange} = renderMinimized({...timeline, value: [20, 43]});

    fireEvent.mouseDown(bar, {clientX: 32});
    fireEvent.mouseMove(document, {clientX: 42});
    fireEvent.mouseUp(document);
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenLastCalledWith([30, 53]);

    const handles = container.querySelectorAll('.kg-range-slider__handle');
    fireEvent.mouseDown(handles[0], {clientX: 30});
    fireEvent.mouseMove(document, {clientX: 35});
    fireEvent.mouseUp(document);
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenLastCalledWith([35, 53]);

    fireEvent.mouseDown(handles[1], {clientX: 53});
    fireEvent.mouseMove(document, {clientX: 60});
    fireEvent.mouseUp(document);
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenLastCalledWith([35, 60]);
  });

  test.each([
    {clientX: -20, expected: [0, 40]},
    {clientX: 120, expected: [60, 100]}
  ])('keeps the selected width at the domain edge: $expected', ({clientX, expected}) => {
    const {bar, onChange} = renderMinimized();
    fireEvent.mouseDown(bar, {clientX: 40});
    fireEvent.mouseMove(document, {clientX});
    fireEvent.mouseUp(document);
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenLastCalledWith(expected);
  });

  test('preserves a duration that is not a multiple of the step', () => {
    const {bar, onChange} = renderMinimized({
      ...timeline,
      domain: [0, 9],
      value: [4, 9],
      step: 2
    });
    fireEvent.mouseDown(bar, {clientX: 70});
    fireEvent.mouseMove(document, {clientX: 48});
    fireEvent.mouseUp(document);
    expect(onChange).toHaveBeenLastCalledWith([2, 7]);
  });

  test.each<{
    name: string;
    initial: Timeline;
    delta: number;
    expected: [number, number];
    trackWidth?: number;
  }>([
    {
      name: 'right-clipped calendar bin',
      initial: {...timeline, domain: [0, 950], value: [800, 1000]},
      delta: -100,
      expected: [700, 900],
      trackWidth: 95
    },
    {
      name: 'left-clipped selection',
      initial: {...timeline, domain: [0, 950], value: [-50, 150]},
      delta: 100,
      expected: [50, 250],
      trackWidth: 95
    },
    {
      name: 'left-clipped selection at the lower boundary',
      initial: {...timeline, value: [-10, 30]},
      delta: -100,
      expected: [0, 40]
    },
    {
      name: 'right-clipped selection at the upper boundary',
      initial: {...timeline, value: [80, 110]},
      delta: 100,
      expected: [70, 100]
    },
    {
      name: 'selection wider than the domain',
      initial: {...timeline, value: [-10, 110]},
      delta: 20,
      expected: [0, 100]
    },
    {
      name: 'clipped fractional duration that is not a multiple of the step',
      initial: {...timeline, domain: [0, 1], value: [0.8, 1.05], step: 0.1},
      delta: -0.2,
      expected: [0.6, 0.85]
    }
  ])(
    'preserves the selected duration for $name',
    ({initial, delta, expected, trackWidth = 100}) => {
      jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(trackWidth);
      const {bar, onChange} = renderMinimized(initial);
      const domain = initial.domain as [number, number];
      const pixelDelta = (delta / (domain[1] - domain[0])) * trackWidth;
      fireEvent.mouseDown(bar, {clientX: 50});
      fireEvent.mouseMove(document, {clientX: 50 + pixelDelta / 2});
      act(() => jest.advanceTimersByTime(40));
      fireEvent.mouseMove(document, {clientX: 50 + pixelDelta});
      fireEvent.mouseUp(document);
      act(() => jest.advanceTimersByTime(40));
      const result = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(result[0]).toBeCloseTo(expected[0], 10);
      expect(result[1]).toBeCloseTo(expected[1], 10);
    }
  );

  test('moves a time range through controlled touch updates and resizes both ends by touch', () => {
    const start = Date.UTC(2026, 0, 1);
    const hour = 60 * 60 * 1000;
    const {bar, container, onChange} = renderMinimized({
      ...timeline,
      domain: [start, start + 100 * hour],
      value: [start + 20 * hour, start + 60 * hour],
      step: hour
    });
    fireEvent.touchStart(bar, {touches: [{clientX: 40}]});
    fireEvent.touchMove(document, {touches: [{clientX: 50}]});
    fireEvent.touchMove(document, {touches: [{clientX: 60}]});
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenLastCalledWith([start + 40 * hour, start + 80 * hour]);
    fireEvent.touchMove(document, {touches: [{clientX: 70}]});
    fireEvent.touchEnd(document);
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenLastCalledWith([start + 50 * hour, start + 90 * hour]);

    const handles = container.querySelectorAll('.kg-range-slider__handle');
    fireEvent.touchStart(handles[0], {touches: [{clientX: 50}]});
    fireEvent.touchMove(document, {touches: [{clientX: 55}]});
    fireEvent.touchMove(document, {touches: [{clientX: 60}]});
    fireEvent.touchEnd(document);
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenLastCalledWith([start + 60 * hour, start + 90 * hour]);

    fireEvent.touchStart(handles[1], {touches: [{clientX: 90}]});
    fireEvent.touchMove(document, {touches: [{clientX: 95}]});
    fireEvent.touchMove(document, {touches: [{clientX: 100}]});
    fireEvent.touchEnd(document);
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenLastCalledWith([start + 60 * hour, start + 100 * hour]);

    const updateCount = onChange.mock.calls.length;
    fireEvent.touchMove(document, {touches: [{clientX: 80}]});
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).toHaveBeenCalledTimes(updateCount);
  });

  test.each<Timeline>([
    {...timeline, value: 20},
    {...timeline, animationWindow: ANIMATION_WINDOW.interval, value: [20, 40]},
    {...timeline, domain: null}
  ])('does not turn a point, interval, or missing domain into a draggable range: %j', initial => {
    const {bar, onChange} = renderMinimized(initial);
    fireEvent.mouseDown(bar, {clientX: 40});
    fireEvent.mouseMove(document, {clientX: 60});
    fireEvent.mouseUp(document);
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not move the selected range when bar dragging is disabled', () => {
    const onChange = jest.fn();
    const {container} = renderWithTheme(
      <RealTimelineSlider timeline={timeline} enableBarDrag={false} setTimelineValue={onChange} />
    );
    const bar = container.querySelector('.kg-range-slider__bar') as HTMLElement;
    fireEvent.mouseDown(bar, {clientX: 40});
    fireEvent.mouseMove(document, {clientX: 60});
    fireEvent.mouseUp(document);
    act(() => jest.advanceTimersByTime(40));
    expect(onChange).not.toHaveBeenCalled();
  });
});
