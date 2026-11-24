// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import test from 'tape';
import {act, fireEvent, render, within} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import {IntlWrapper, mountWithTheme, mockHTMLElementClientSize} from 'test/helpers/component-utils';
import {RangeSlider, Slider, SliderHandle, SliderBarHandle} from '@kepler.gl/components';

test('Components -> RangeSlider.render', t => {
  let wrapper;
  const onChange = () => {};
  t.doesNotThrow(() => {
    wrapper = mountWithTheme(
      <IntlWrapper>
        <RangeSlider range={[0, 10]} value0={1} value1={3} onChange={onChange} />
      </IntlWrapper>
    );
  }, 'Show not fail without props');

  t.equal(wrapper.find(Slider).length, 1, 'should render Slider');
  t.equal(wrapper.find(SliderHandle).length, 2, 'should render 2 Slider handle');
  t.equal(wrapper.find(SliderBarHandle).length, 1, 'should render 1 Slider bar');

  act(() => wrapper.unmount());
  t.end();
});

function renderControlledRange(initialValue, changes, props = {}) {
  function ControlledRange() {
    const [value, setValue] = React.useState(initialValue);
    return (
      <RangeSlider
        range={[0, 100]}
        step={1}
        value0={value[0]}
        value1={value[1]}
        onChange={nextValue => {
          changes.push(nextValue);
          setValue(nextValue);
        }}
        {...props}
      />
    );
  }

  return render(
    <ThemeProvider theme={theme}>
      <IntlWrapper>
        <ControlledRange />
      </IntlWrapper>
    </ThemeProvider>
  );
}

test('Components -> RangeSlider -> native number inputs use the configured step', t => {
  const changes = [];
  const fractional = renderControlledRange([1, 3], changes, {step: 0.1});
  try {
    const [lower, upper] = fractional.getAllByRole('spinbutton');
    lower.stepUp();
    t.equal(lower.valueAsNumber, 1.1, 'increments the lower input by one tenth');
    fireEvent.blur(lower);
    t.deepEqual(changes.pop(), [1.1, 3], 'commits the increment to the controlled range');

    upper.stepDown();
    t.equal(upper.valueAsNumber, 2.9, 'decrements the upper input by one tenth');
    fireEvent.blur(upper);
    t.deepEqual(changes.pop(), [1.1, 2.9], 'commits the decrement to the controlled range');
  } finally {
    fractional.unmount();
  }

  const defaultStep = renderControlledRange([1, 3], [], {step: undefined});
  try {
    const [lower] = defaultStep.getAllByRole('spinbutton');
    lower.stepUp();
    t.equal(lower.valueAsNumber, 2, 'preserves native integer increments when no step is set');
  } finally {
    defaultStep.unmount();
  }

  t.end();
});

test('Components -> RangeSlider -> controlled bar dragging preserves translation and restarts', t => {
  const sizeStub = mockHTMLElementClientSize('offsetWidth', 100);
  const changes = [];
  const view = renderControlledRange([20, 60], changes);

  try {
    const bar = view.container.querySelector('.kg-range-slider__bar');
    fireEvent.mouseDown(bar, {clientX: 40});
    for (const clientX of [50, 60, 70]) {
      fireEvent.mouseMove(document, {clientX});
    }
    t.deepEqual(
      changes,
      [
        [30, 70],
        [40, 80],
        [50, 90]
      ],
      'each move translates both endpoints with immediate controlled updates'
    );

    fireEvent.mouseMove(document, {clientX: 120});
    t.deepEqual(changes[changes.length - 1], [60, 100], 'clamps the whole range at the upper end');
    fireEvent.mouseMove(document, {clientX: 20});
    t.deepEqual(changes[changes.length - 1], [0, 40], 'clamps the whole range at the lower end');
    fireEvent.mouseUp(document);

    fireEvent.mouseDown(bar, {clientX: 20});
    fireEvent.mouseMove(document, {clientX: 35});
    t.deepEqual(
      changes[changes.length - 1],
      [15, 55],
      'a new drag starts from the current selection and pointer position'
    );
  } finally {
    fireEvent.mouseUp(document);
    view.unmount();
    sizeStub.restore();
  }
  t.end();
});

test('Components -> RangeSlider -> bar dragging retains nonlinear scale behavior', t => {
  const sizeStub = mockHTMLElementClientSize('offsetWidth', 100);
  const changes = [];
  const view = renderControlledRange([20, 40], changes, {
    scaleConfig: {focusRange: [0, 50], focusWeight: 0.75}
  });

  try {
    const bar = view.container.querySelector('.kg-range-slider__bar');
    // The focus range occupies 75 pixels, so [20, 40] starts at pixels [30, 60].
    fireEvent.mouseDown(bar, {clientX: 45});
    fireEvent.mouseMove(document, {clientX: 60});
    fireEvent.mouseMove(document, {clientX: 75});
    t.deepEqual(
      changes,
      [
        [30, 50],
        [40, 80]
      ],
      'translates in screen space across the focus boundary after each controlled update'
    );
    fireEvent.mouseUp(document);

    fireEvent.mouseDown(bar, {clientX: 75});
    fireEvent.mouseMove(document, {clientX: 60});
    t.deepEqual(
      changes[changes.length - 1],
      [30, 50],
      'a restarted nonlinear drag uses the latest selection and anchor'
    );
  } finally {
    fireEvent.mouseUp(document);
    view.unmount();
    sizeStub.restore();
  }
  t.end();
});

const timeBin = (x0, x1) => ({x0, x1, count: 1});

function renderTimeline(props) {
  return render(
    <ThemeProvider theme={theme}>
      <IntlWrapper>
        <RangeSlider isTime step={1} value0={props.range[0]} value1={props.range[1]} {...props} />
      </IntlWrapper>
    </ThemeProvider>
  );
}

test('Components -> RangeSlider -> time histograms fill their actual edge bins', t => {
  const sizeStub = mockHTMLElementClientSize('offsetWidth', 212);
  const cases = [
    {
      name: 'timestamps inside calendar bins',
      range: [250, 1750],
      bins: {default: [timeBin(0, 1000), timeBin(1000, 2000)]},
      centers: [0.25, 0.75]
    },
    {
      name: 'inclusive maximum at a bin boundary',
      range: [0, 2000],
      bins: {default: [timeBin(0, 1000), timeBin(1000, 2000), timeBin(2000, 3000)]},
      centers: [1 / 6, 0.5, 5 / 6]
    },
    {
      name: 'a single populated bin',
      range: [250, 750],
      bins: {default: [timeBin(0, 1000)]},
      centers: [0.5]
    },
    {
      name: 'interval animation mode',
      range: [250, 1750],
      bins: {default: [timeBin(0, 1000), timeBin(1000, 2000)]},
      isRanged: false,
      centers: [0.25, 0.75]
    },
    {
      name: 'groups with a genuine empty middle interval',
      range: [250, 2750],
      bins: {first: [timeBin(0, 1000)], last: [timeBin(2000, 3000)]},
      // Grouped bars occupy their own half of each calendar interval.
      centers: [1 / 12, 11 / 12]
    }
  ];

  try {
    for (const {name, centers, ...props} of cases) {
      const view = renderTimeline({...props, plotType: {type: 'histogram'}});
      try {
        const bars = Array.from(view.container.querySelectorAll('.histogram-bars rect'));
        t.equal(bars.length, centers.length, `${name}: renders every populated bin`);
        bars.forEach((bar, index) => {
          const plotWidth = Number(bar.closest('svg').getAttribute('width'));
          const center =
            (Number(bar.getAttribute('x')) + Number(bar.getAttribute('width')) / 2) / plotWidth;
          t.ok(
            Math.abs(center - centers[index]) < 1e-6,
            `${name}: bin ${index} occupies its expected share of the plot`
          );
        });
      } finally {
        view.unmount();
      }
    }
  } finally {
    sizeStub.restore();
  }
  t.end();
});

test('Components -> RangeSlider -> time selection respects actual bins and zoom boundaries', t => {
  const bins = {default: [timeBin(0, 1000), timeBin(1000, 2000)]};
  const cases = [
    {name: 'full domain', range: [250, 1750], expected: [0, 2000]},
    {name: 'zoomed domain', range: [500, 1500], expected: [500, 1500]},
    {name: 'zoomed right edge', range: [250, 1500], expected: [0, 1500]},
    {name: 'missing bins', range: [250, 1750], bins: undefined, expected: [250, 1750]},
    {name: 'empty bins', range: [250, 1750], bins: {default: []}, expected: [250, 1750]},
    {
      name: 'invalid bin boundaries',
      range: [250, 1750],
      bins: {default: [timeBin(NaN, Infinity)]},
      expected: [250, 1750]
    },
    {name: 'numeric histogram', range: [250, 1750], isTime: false, expected: [-250, 2250]}
  ];

  for (const {name, expected, ...props} of cases) {
    const changes = [];
    const view = renderTimeline({
      bins,
      filter: {domain: [250, 1750]},
      onChange: value => changes.push(value),
      ...props
    });
    try {
      const [start, end] = within(view.container).getAllByRole('spinbutton');
      fireEvent.blur(start, {target: {value: '-10000'}});
      fireEvent.blur(end, {target: {value: '10000'}});
      t.deepEqual(
        [changes[0][0], changes[1][1]],
        expected,
        `${name}: clamps selection to the displayed boundaries`
      );
    } finally {
      view.unmount();
    }
  }
  t.end();
});
