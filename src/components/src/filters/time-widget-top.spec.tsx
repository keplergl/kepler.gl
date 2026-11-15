// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlProvider} from 'react-intl';
import {ThemeProvider} from 'styled-components';
import {getDefaultFilter, initApplicationConfig} from '@kepler.gl/utils';
import {TimeRangeFilter} from '@kepler.gl/types';
import {theme} from '@kepler.gl/styles';
import {messages} from '@kepler.gl/localization';
import {FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {INITIAL_VIS_STATE} from '@kepler.gl/reducers';
import {IntlWrapper} from 'test/helpers/component-jest-utils';
import AnimationSpeedSliderFactory from '../common/animation-control/animation-speed-slider';
import {
  AnimationJsonEditorFactory,
  AnimationJsonEditorProps
} from '../common/animation-control/animation-json-editor';
import TimeWidgetTopFactory from './time-widget-top';
import {TimeWidgetTopProps} from './types';

// Exercise the real editor and apply flow while providing state at the Redux boundary.
jest.mock('../injector', () => ({
  withState: () => (Component: React.ComponentType) => Component
}));

const TimeWidgetTop = TimeWidgetTopFactory();
const RealAnimationJsonEditor = AnimationJsonEditorFactory();
const filter: TimeRangeFilter = {
  ...getDefaultFilter({dataId: 'data', id: 'time'}),
  type: 'timeRange',
  fieldType: 'timestamp',
  domain: [0, 1000],
  value: [0, 1000] as [number, number],
  mappedValue: [],
  step: 1000,
  animationWindow: 'free',
  syncedWithLayerTimeline: false,
  syncTimelineMode: 0,
  invertTrendColor: false,
  plotType: {interval: '3-month'}
};

function HeaderWrapper({children, locale = 'en'}: {children: React.ReactNode; locale?: string}) {
  return (
    <ThemeProvider theme={theme}>
      <IntlWrapper locale={locale}>{children}</IntlWrapper>
    </ThemeProvider>
  );
}

function setup(overrides: Partial<TimeWidgetTopProps> = {}) {
  const props = {
    filter,
    readOnly: false,
    isMinified: false,
    onClose: jest.fn(),
    onToggleMinify: jest.fn(),
    onToggleSettings: jest.fn(),
    ...overrides
  };
  const result = render(<TimeWidgetTop {...props} />, {wrapper: HeaderWrapper});
  return {...result, props};
}

async function expectTooltip(target: HTMLElement, text: string) {
  expect(target).not.toHaveAttribute('title');
  fireEvent.mouseEnter(target);
  const tooltip = await waitFor(() => {
    const popup = document.getElementById(target.getAttribute('aria-describedby') || '');
    expect(popup).not.toBeNull();
    const content = within(popup as HTMLElement).getByRole('tooltip');
    expect(content).toHaveTextContent(text);
    return content;
  });
  fireEvent.mouseLeave(target);
  fireEvent.blur(target);
  await waitFor(() => expect(tooltip).not.toBeInTheDocument());
}

test('uses kepler tooltips for the chart title and close action', async () => {
  const {container} = setup();
  const title = screen.getByText('Count of Rows per 3 month');
  await expectTooltip(title, title.textContent || '');
  await expectTooltip(screen.getByRole('button', {name: 'Close timeline'}), 'Close timeline');
  expect(container.querySelector('[title]')).not.toBeInTheDocument();
});

test.each(['{Enter}', ' '])('activates each header action by keyboard with %p', async key => {
  const user = userEvent.setup();
  const {props} = setup();
  for (const [name, action] of [
    ['Settings', props.onToggleSettings],
    ['Collapse timeline', props.onToggleMinify],
    ['Close timeline', props.onClose]
  ] as const) {
    await user.tab();
    expect(screen.getByRole('button', {name})).toHaveFocus();
    await user.keyboard(key);
    expect(action).toHaveBeenCalledTimes(1);
  }
});

test('activates header controls exactly once when clicking their icons', () => {
  const {props} = setup();
  for (const [name, action] of [
    ['Settings', props.onToggleSettings],
    ['Collapse timeline', props.onToggleMinify],
    ['Close timeline', props.onClose]
  ] as const) {
    fireEvent.click(screen.getByRole('button', {name}).querySelector('svg') as SVGElement);
    expect(action).toHaveBeenCalledTimes(1);
  }
});

test('announces the settings state and offers hiding them from the same gear', async () => {
  const user = userEvent.setup();
  const {props, rerender} = setup();
  const settings = screen.getByRole('button', {name: 'Settings'});
  expect(settings).toHaveAttribute('aria-expanded', 'false');
  await user.click(settings);
  expect(props.onToggleSettings).toHaveBeenCalledTimes(1);
  rerender(<TimeWidgetTop {...props} settingsOpen />);
  expect(settings).toHaveAttribute('aria-expanded', 'true');
  await expectTooltip(settings, 'Hide settings');
  await user.click(settings);
  expect(props.onToggleSettings).toHaveBeenCalledTimes(2);
  rerender(<TimeWidgetTop {...props} settingsOpen={false} />);
  expect(settings).toHaveAttribute('aria-expanded', 'false');
});

test('exposes the collapsed state and keeps expansion keyboard accessible in read-only mode', async () => {
  const user = userEvent.setup();
  const {props, rerender} = setup({readOnly: true, isMinified: true});
  const expand = screen.getByRole('button', {name: 'Expand timeline'});
  expect(expand).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('button', {name: 'Settings'})).not.toBeInTheDocument();
  expect(screen.queryByRole('button', {name: 'Close timeline'})).not.toBeInTheDocument();
  await expectTooltip(expand, 'Expand timeline');
  await user.tab();
  expect(expand).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(props.onToggleMinify).toHaveBeenCalledTimes(1);

  rerender(<TimeWidgetTop {...props} isMinified={false} />);
  expect(screen.getByRole('button', {name: 'Collapse timeline'})).toHaveAttribute(
    'aria-expanded',
    'true'
  );
  fireEvent.click(screen.getByRole('button', {name: 'Settings'}));
  expect(props.onToggleSettings).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('button', {name: 'Close timeline'})).not.toBeInTheDocument();
});

describe('compact timeline playback controls', () => {
  const AnimationSpeedSlider = AnimationSpeedSliderFactory(({value1, onChange}) => (
    <input
      aria-label="Playback speed value"
      type="number"
      defaultValue={value1}
      onBlur={event => onChange?.([0, Number(event.target.value)])}
    />
  ));
  const AnimationJsonEditor = jest.fn(({filterId, onClose}: AnimationJsonEditorProps) => (
    <div>
      <output aria-label="JSON filter ID">{filterId}</output>
      <textarea aria-label="Animation JSON" defaultValue="{}" />
      <button onClick={onClose}>Close JSON editor</button>
    </div>
  ));
  const CompactHeader = TimeWidgetTopFactory(AnimationSpeedSlider, AnimationJsonEditor);

  function setupPlayback(
    overrides: Partial<TimeWidgetTopProps> = {},
    playbackOverrides: Partial<NonNullable<TimeWidgetTopProps['playbackControls']>> = {},
    locale = 'en'
  ) {
    const playbackControls = {
      isAnimatable: true,
      isAnimating: false,
      speed: 1.25,
      toggleAnimation: jest.fn(),
      resetAnimation: jest.fn(),
      updateAnimationSpeed: jest.fn(),
      setFilterAnimationWindow: jest.fn(),
      exportAnimation: jest.fn(),
      ...playbackOverrides
    };
    const props = {
      filter,
      readOnly: false,
      isMinified: false,
      onClose: jest.fn(),
      onToggleMinify: jest.fn(),
      onToggleSettings: jest.fn(),
      rangeDisplay: <span>08 Jan 1991 — 30 Mar 2011</span>,
      playbackControls,
      ...overrides
    };
    const result = render(<CompactHeader {...props} />, {
      wrapper: ({children}) => <HeaderWrapper locale={locale}>{children}</HeaderWrapper>
    });
    return {...result, props, playbackControls};
  }

  beforeEach(() => {
    initApplicationConfig({enableJsonEditors: true, enableAnimationJsonEditor: true});
    AnimationJsonEditor.mockClear();
    // JSDOM has no layout; react-modal uses dimensions to find keyboard targets.
    jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);
  });
  afterEach(() => {
    initApplicationConfig({});
    jest.restoreAllMocks();
  });

  test.each([false, true])(
    'announces the visible localized mode as it changes when minimized is %s',
    isMinified => {
      const {props, playbackControls, rerender} = setupPlayback({isMinified});
      const localizedMessages = {
        ...messages.es,
        'tooltip.movingWindow': 'Ventana móvil',
        'tooltip.cumulativeWindow': 'Acumulativo',
        'tooltip.singleInterval': 'Intervalo único'
      };
      for (const [animationWindow, labelId] of [
        ['free', 'tooltip.movingWindow'],
        ['incremental', 'tooltip.cumulativeWindow'],
        ['interval', 'tooltip.singleInterval']
      ] as const) {
        rerender(
          <IntlProvider locale="es" messages={localizedMessages}>
            <CompactHeader {...props} playbackControls={{...playbackControls, animationWindow}} />
          </IntlProvider>
        );
        const label = localizedMessages[labelId];
        expect(screen.getByRole('button', {name: label})).toHaveTextContent(label);
      }
    }
  );

  test.each([false, true])(
    'edits loop behavior inside the mode menu when minimized is %s',
    async isMinified => {
      const user = userEvent.setup();
      const setAnimationLoop = jest.fn();
      const {props, playbackControls, rerender} = setupPlayback({isMinified}, {setAnimationLoop});
      expect(screen.queryByRole('checkbox', {name: 'Loop playback'})).not.toBeInTheDocument();
      const mode = screen.getByRole('button', {name: 'Moving window'});
      expect(mode).toHaveTextContent('Moving window');
      await user.click(mode);
      const loop = screen.getByRole('checkbox', {name: 'Loop playback'});
      expect(loop).toBeChecked();
      loop.focus();
      await user.keyboard(' ');
      expect(setAnimationLoop).toHaveBeenCalledWith(false);
      rerender(
        <CompactHeader
          {...props}
          playbackControls={{
            ...playbackControls,
            animationLoop: false,
            animationWindow: 'incremental'
          }}
        />
      );
      expect(loop).not.toBeChecked();
      expect(screen.getByText('Stop at end')).toBeInTheDocument();
      expect(mode).toHaveTextContent('Cumulative');
      expect(mode).toHaveAccessibleName('Cumulative');
      await user.click(loop);
      expect(setAnimationLoop).toHaveBeenLastCalledWith(true);
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('checkbox', {name: 'Loop playback'})).not.toBeInTheDocument();
    }
  );

  test.each([false, true])(
    'localizes playback tooltips and accessible names when minimized is %s',
    async isMinified => {
      const user = userEvent.setup();
      const {props, playbackControls, rerender} = setupPlayback({isMinified}, {}, 'es');
      const translated = messages.es;
      for (const [id, action] of [
        ['tooltip.play', playbackControls.toggleAnimation],
        ['tooltip.reset', playbackControls.resetAnimation]
      ] as const) {
        const button = screen.getByRole('button', {name: translated[id]});
        await expectTooltip(button, translated[id]);
        await user.click(button);
        expect(action).toHaveBeenCalledTimes(1);
      }

      const speed = screen.getByRole('button', {name: translated['tooltip.speed']});
      await expectTooltip(speed, translated['tooltip.speed']);
      await user.click(speed);
      expect(screen.getByRole('dialog', {name: translated['tooltip.speed']})).toBeInTheDocument();
      await user.keyboard('{Escape}');

      rerender(
        <CompactHeader {...props} playbackControls={{...playbackControls, isAnimating: true}} />
      );
      const pause = screen.getByRole('button', {name: translated['tooltip.pause']});
      await expectTooltip(pause, translated['tooltip.pause']);
      await user.click(pause);
      expect(playbackControls.toggleAnimation).toHaveBeenCalledTimes(2);
    }
  );

  test.each([false, true])(
    'supports step buttons by keyboard and explains their shortcuts when minimized is %s',
    async isMinified => {
      const user = userEvent.setup();
      const stepBackward = jest.fn();
      const stepForward = jest.fn();
      setupPlayback({isMinified}, {stepBackward, stepForward});
      for (const [name, shortcut, callback] of [
        ['Previous interval', 'ArrowLeft', stepBackward],
        ['Next interval', 'ArrowRight', stepForward]
      ] as const) {
        const button = screen.getByRole('button', {name});
        button.focus();
        expect(button).toHaveFocus();
        expect(button).toHaveAttribute('aria-keyshortcuts', `Control+${shortcut} Meta+${shortcut}`);
        await user.keyboard('{Enter}');
        await user.keyboard(' ');
        expect(callback).toHaveBeenCalledTimes(2);
        await expectTooltip(
          button,
          `${name} (Ctrl/Cmd + ${shortcut === 'ArrowRight' ? '→' : '←'})`
        );
      }
    }
  );

  test.each([false, true])(
    'shows localized step controls without hovering when minimized is %s',
    async isMinified => {
      const user = userEvent.setup();
      const stepBackward = jest.fn();
      const stepForward = jest.fn();
      setupPlayback({isMinified}, {stepBackward, stepForward}, 'es');
      const previous = screen.getByRole('button', {name: messages.es['tooltip.previousInterval']});
      const next = screen.getByRole('button', {name: messages.es['tooltip.nextInterval']});
      expect(previous).toBeVisible();
      expect(next).toBeVisible();
      for (const [button, id, arrow, callback] of [
        [previous, 'tooltip.previousInterval', '←', stepBackward],
        [next, 'tooltip.nextInterval', '→', stepForward]
      ] as const) {
        await expectTooltip(button, `${messages.es[id]} (Ctrl/Cmd + ${arrow})`);
        await user.click(button);
        expect(callback).toHaveBeenCalledTimes(1);
      }
    }
  );

  test('disables unavailable steps without blocking the other direction', async () => {
    const user = userEvent.setup();
    const stepBackward = jest.fn();
    const stepForward = jest.fn();
    const {props, playbackControls, rerender} = setupPlayback(
      {},
      {stepBackward, stepForward, canStepBackward: false, canStepForward: true}
    );
    expect(screen.getByRole('button', {name: 'Previous interval'})).toBeDisabled();
    await user.click(screen.getByRole('button', {name: 'Next interval'}));
    expect(stepForward).toHaveBeenCalledTimes(1);
    expect(stepBackward).not.toHaveBeenCalled();
    rerender(
      <CompactHeader {...props} playbackControls={{...playbackControls, isAnimatable: false}} />
    );
    expect(screen.getByRole('button', {name: 'Next interval'})).toBeDisabled();
  });

  test('groups chart actions separately from the selected range and playback controls', async () => {
    const user = userEvent.setup();
    setupPlayback();
    const actions = screen.getByRole('group', {name: 'Timeline actions'});
    const playback = screen.getByRole('group', {name: 'Timeline playback'});
    const controls = within(playback).getByRole('group', {name: 'Playback controls'});
    expect(
      within(actions)
        .getAllByRole('button')
        .map(button => button.getAttribute('aria-label'))
    ).toEqual([
      'Settings',
      'Video Export',
      'Edit animation JSON',
      'Collapse timeline',
      'Close timeline'
    ]);
    await expectTooltip(within(actions).getByRole('button', {name: 'Settings'}), 'Settings');
    expect(
      within(controls)
        .getAllByRole('button')
        .map(button => button.getAttribute('aria-label'))
    ).toEqual(['Play', 'Reset', 'Speed', 'Moving window']);
    expect(within(playback).getByRole('group', {name: 'Selected range'})).toHaveTextContent(
      '08 Jan 1991 — 30 Mar 2011'
    );
    expect(within(actions).queryByRole('group', {name: 'Selected range'})).not.toBeInTheDocument();
    for (const button of [
      ...within(actions).getAllByRole('button'),
      ...within(controls).getAllByRole('button')
    ]) {
      expect(button).not.toHaveAttribute('title');
      await user.tab();
      expect(button).toHaveFocus();
    }
  });

  test('keeps every minimized action visible and keyboard accessible in reading order', async () => {
    const user = userEvent.setup();
    const {props, playbackControls} = setupPlayback({isMinified: true});
    const playback = screen.getByRole('group', {name: 'Timeline playback'});
    const actions = screen.getByRole('group', {name: 'Timeline actions'});
    expect(within(playback).getByRole('group', {name: 'Selected range'})).toHaveTextContent(
      '08 Jan 1991 — 30 Mar 2011'
    );
    expect(within(actions).queryByRole('button', {name: 'Settings'})).not.toBeInTheDocument();
    const names = [
      'Play',
      'Reset',
      'Speed',
      'Moving window',
      'Video Export',
      'Edit animation JSON',
      'Expand timeline',
      'Close timeline'
    ];
    expect(screen.getAllByRole('button')).toHaveLength(names.length);
    for (const name of names) {
      const button = screen.getByRole('button', {name});
      expect(button).toBeVisible();
      expect(button).not.toHaveAttribute('title');
      await user.tab();
      expect(button).toHaveFocus();
      if (name === 'Reset' || name === 'Expand timeline') {
        await user.keyboard(' ');
      }
    }
    expect(playbackControls.resetAnimation).toHaveBeenCalledTimes(1);
    expect(props.onToggleMinify).toHaveBeenCalledTimes(1);
  });

  test('preserves keyboard focus when expanding and collapsing the compact header', async () => {
    const user = userEvent.setup();
    const {props, rerender} = setupPlayback({isMinified: true});
    const expand = screen.getByRole('button', {name: 'Expand timeline'});
    expand.focus();
    await user.keyboard('{Enter}');
    expect(props.onToggleMinify).toHaveBeenCalledTimes(1);
    rerender(<CompactHeader {...props} isMinified={false} />);
    expect(screen.getByRole('button', {name: 'Collapse timeline'})).toHaveFocus();

    await user.keyboard(' ');
    expect(props.onToggleMinify).toHaveBeenCalledTimes(2);
    rerender(<CompactHeader {...props} isMinified />);
    expect(screen.getByRole('button', {name: 'Expand timeline'})).toHaveFocus();
  });

  test('keeps play/pause and the current speed available in the header', async () => {
    const user = userEvent.setup();
    const {props, playbackControls, rerender} = setupPlayback();
    const play = screen.getByRole('button', {name: 'Play'});
    expect(play).toHaveAttribute('aria-pressed', 'false');
    await user.click(play);
    expect(playbackControls.toggleAnimation).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', {name: 'Speed'})).toHaveTextContent('1.3×');

    rerender(
      <CompactHeader {...props} playbackControls={{...playbackControls, isAnimating: true}} />
    );
    const pause = screen.getByRole('button', {name: 'Pause'});
    expect(pause).toHaveAttribute('aria-pressed', 'true');
    await user.click(pause);
    expect(playbackControls.toggleAnimation).toHaveBeenCalledTimes(2);
  });

  test('resets directly from the header without opening a menu', async () => {
    const user = userEvent.setup();
    const {playbackControls} = setupPlayback();
    const reset = screen.getByRole('button', {name: 'Reset'});
    await user.click(reset);
    expect(playbackControls.resetAnimation).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(reset).toHaveFocus();
  });

  test('can focus and activate Reset from the keyboard without hovering', async () => {
    const user = userEvent.setup();
    const {playbackControls} = setupPlayback();
    for (let index = 0; index < 7; index++) {
      await user.tab();
    }
    const reset = screen.getByRole('button', {name: 'Reset'});
    expect(reset).toHaveFocus();
    await user.keyboard(' ');
    expect(playbackControls.resetAnimation).toHaveBeenCalledTimes(1);
    expect(reset).toHaveFocus();
  });

  test.each(['Escape', 'outside click'])(
    'commits edited speed before closing with %s',
    async dismissal => {
      const user = userEvent.setup();
      const {playbackControls} = setupPlayback();
      await user.click(screen.getByRole('button', {name: 'Speed'}));
      const dialog = screen.getByRole('dialog', {name: 'Speed'});
      const input = within(dialog).getByRole('spinbutton', {name: 'Playback speed value'});
      await user.click(input);
      fireEvent.change(input, {target: {value: '2'}});
      expect(playbackControls.updateAnimationSpeed).not.toHaveBeenCalled();
      if (dismissal === 'Escape') {
        await user.keyboard('{Escape}');
      } else {
        await user.click(dialog.parentElement as HTMLElement);
      }
      expect(playbackControls.updateAnimationSpeed).toHaveBeenCalledWith(2);
      expect(playbackControls.updateAnimationSpeed).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await waitFor(() => expect(screen.getByRole('button', {name: 'Speed'})).toHaveFocus());
    }
  );

  test('exposes export and settings directly with keyboard access', async () => {
    const user = userEvent.setup();
    const {props, playbackControls} = setupPlayback();
    expect(screen.queryByRole('button', {name: 'Timeline options'})).not.toBeInTheDocument();
    await user.tab();
    const settings = screen.getByRole('button', {name: 'Settings'});
    expect(settings).toHaveFocus();
    await user.keyboard(' ');
    expect(props.onToggleSettings).toHaveBeenCalledTimes(1);
    expect(settings).toHaveFocus();
    await user.tab();
    const exportButton = screen.getByRole('button', {name: 'Video Export'});
    expect(exportButton).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(playbackControls.exportAnimation).toHaveBeenCalledTimes(1);
    expect(exportButton).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', {name: 'Edit animation JSON'})).toHaveFocus();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('repositions reopened popups immediately without animating from the old location', async () => {
    const user = userEvent.setup();
    let anchorLeft = 100;
    jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        const left = this.closest('.time-widget--top') ? anchorLeft : 0;
        return {left, right: left, top: 100, bottom: 100, width: 0, height: 0} as DOMRect;
      });
    setupPlayback();
    for (const [name, dialogName, left] of [
      ['Moving window', 'Animation mode', 100],
      ['Speed', 'Speed', 300],
      ['Moving window', 'Animation mode', 200]
    ] as const) {
      anchorLeft = left;
      const trigger = screen.getByRole('button', {name});
      await user.click(trigger);
      const dialog = screen.getByRole('dialog', {name: dialogName});
      const popup = dialog.querySelector('.portaled-content');
      await waitFor(() => expect(popup).toHaveStyle({left: `${left}px`, opacity: '1'}));
      // A transition on coordinates would visibly travel from the old anchor.
      expect(popup).toHaveStyle({transition: 'none'});
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await waitFor(() => expect(trigger).toHaveFocus());
    }
  });

  test('reflects the active playback mode when it overrides the filter mode', async () => {
    const user = userEvent.setup();
    setupPlayback({}, {animationWindow: 'interval'});
    const mode = screen.getByRole('button', {name: 'Single interval'});
    await expectTooltip(mode, 'Step by Interval');
    expect(mode.querySelector('.data-ex-icons-interval')).not.toBeNull();
    await user.click(mode);
    const dialog = screen.getByRole('dialog', {name: 'Animation mode'});
    expect(within(dialog).getByRole('button', {name: 'Step by Interval'})).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    for (const name of ['Moving Time Window', 'Incremental Time Window']) {
      expect(within(dialog).getByRole('button', {name})).toHaveAttribute('aria-pressed', 'false');
    }
  });

  test.each([
    ['Moving Time Window', 'free', 1, 'freewindow'],
    ['Incremental Time Window', 'incremental', 2, 'anchorwindow'],
    ['Step by Interval', 'interval', 3, 'interval']
  ] as const)(
    'selects %s from the keyboard mode menu and updates its trigger',
    async (label, id, tabs, icon) => {
      const user = userEvent.setup();
      const {props, playbackControls, rerender} = setupPlayback();
      for (let index = 0; index < 9; index++) {
        await user.tab();
      }
      const mode = screen.getByRole('button', {name: 'Moving window'});
      expect(mode).toHaveFocus();
      expect(mode.querySelector('.data-ex-icons-freewindow')).not.toBeNull();
      await user.keyboard('{Enter}');
      expect(mode).toHaveAttribute('aria-expanded', 'true');
      const dialog = screen.getByRole('dialog', {name: 'Animation mode'});
      expect(within(dialog).getAllByRole('button')).toHaveLength(3);
      expect(within(dialog).getByRole('button', {name: 'Moving Time Window'})).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      for (const name of ['Incremental Time Window', 'Step by Interval']) {
        expect(within(dialog).getByRole('button', {name})).toHaveAttribute('aria-pressed', 'false');
      }
      await waitFor(() => expect(dialog).toHaveFocus());
      for (let index = 0; index < tabs; index++) {
        await user.tab();
      }
      expect(within(dialog).getByRole('button', {name: label})).toHaveFocus();
      await user.keyboard('{Enter}');
      expect(playbackControls.setFilterAnimationWindow).toHaveBeenCalledTimes(1);
      expect(playbackControls.setFilterAnimationWindow).toHaveBeenCalledWith(id);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(mode).toHaveAttribute('aria-expanded', 'false');
      expect(mode).toHaveFocus();

      rerender(
        <CompactHeader {...props} playbackControls={{...playbackControls, animationWindow: id}} />
      );
      await expectTooltip(mode, label);
      expect(mode.querySelector(`.data-ex-icons-${icon}`)).not.toBeNull();
    }
  );

  test.each([
    ['Video Export', 'exportAnimation'],
    ['Settings', 'onToggleSettings']
  ] as const)('runs %s directly from its header icon', async (label, action) => {
    const user = userEvent.setup();
    const {props, playbackControls} = setupPlayback();
    const button = screen.getByRole('button', {name: label});
    await expectTooltip(button, label);
    await user.click(button.querySelector('svg') as SVGElement);
    const callback =
      action === 'onToggleSettings' ? props.onToggleSettings : playbackControls[action];
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  test('disables playback actions while keeping chart settings accessible', async () => {
    const user = userEvent.setup();
    const {props, playbackControls} = setupPlayback({}, {isAnimatable: false});
    expect(screen.getByRole('button', {name: 'Play'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Speed'})).toBeDisabled();
    const reset = screen.getByRole('button', {name: 'Reset'});
    const mode = screen.getByRole('button', {name: 'Moving window'});
    expect(reset).toBeDisabled();
    expect(mode).toBeDisabled();
    fireEvent.click(reset);
    fireEvent.click(mode);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    for (const name of ['Video Export', 'Edit animation JSON']) {
      const action = screen.getByRole('button', {name});
      expect(action).toBeDisabled();
      fireEvent.click(action);
    }
    expect(playbackControls.resetAnimation).not.toHaveBeenCalled();
    expect(playbackControls.setFilterAnimationWindow).not.toHaveBeenCalled();
    expect(playbackControls.exportAnimation).not.toHaveBeenCalled();
    expect(AnimationJsonEditor).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', {name: 'Settings'}));
    expect(props.onToggleSettings).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('retains direct playback and export controls while collapsed without chart settings', async () => {
    const user = userEvent.setup();
    const {playbackControls} = setupPlayback({isMinified: true});
    await user.click(screen.getByRole('button', {name: 'Play'}));
    expect(playbackControls.toggleAnimation).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', {name: 'Speed'})).toBeEnabled();
    await user.click(screen.getByRole('button', {name: 'Reset'}));
    expect(playbackControls.resetAnimation).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', {name: 'Moving window'}));
    const modes = screen.getByRole('dialog', {name: 'Animation mode'});
    expect(within(modes).getAllByRole('button')).toHaveLength(3);
    await user.click(within(modes).getByRole('button', {name: 'Step by Interval'}));
    expect(playbackControls.setFilterAnimationWindow).toHaveBeenCalledWith('interval');
    expect(screen.getByRole('button', {name: 'Expand timeline'})).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Settings'})).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Video Export'})).toBeEnabled();
    expect(screen.getByRole('button', {name: 'Edit animation JSON'})).toBeEnabled();
  });

  test('omits unavailable actions while retaining collapsed playback controls', () => {
    initApplicationConfig({enableJsonEditors: false});
    setupPlayback({isMinified: true}, {exportAnimation: undefined});
    expect(screen.queryByRole('button', {name: 'Timeline options'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Video Export'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: 'Edit animation JSON'})).not.toBeInTheDocument();
    for (const name of ['Play', 'Speed', 'Reset', 'Moving window']) {
      expect(screen.getByRole('button', {name})).toBeEnabled();
    }
  });

  test('opens JSON by keyboard for the actual time filter and restores focus on close', async () => {
    const user = userEvent.setup();
    const selectedFilter = {...filter, id: 'selected-time-filter'};
    const {container} = setupPlayback({filter: selectedFilter});
    const jsonButton = screen.getByRole('button', {name: 'Edit animation JSON'});
    const resetButton = screen.getByRole('button', {name: 'Reset'});
    const exportButton = screen.getByRole('button', {name: 'Video Export'});
    for (let index = 0; index < 3; index++) {
      await user.tab();
    }
    expect(jsonButton).toHaveFocus();
    await user.keyboard('{Enter}');
    const dialog = screen.getByRole('dialog', {name: 'Edit animation JSON'});
    await waitFor(() =>
      expect(within(dialog).getByRole('textbox', {name: 'Animation JSON'})).toHaveFocus()
    );
    expect(container).not.toContainElement(document.activeElement as HTMLElement);
    for (const button of [jsonButton, resetButton, exportButton]) {
      expect(button).toBeVisible();
    }
    expect(within(dialog).getByLabelText('JSON filter ID')).toHaveTextContent(selectedFilter.id);
    expect(AnimationJsonEditor.mock.calls[0][0].filterId).toBe(selectedFilter.id);
    expect(within(dialog).queryByRole('button', {name: 'Settings'})).not.toBeInTheDocument();
    await user.tab();
    expect(within(dialog).getByRole('button', {name: 'Close JSON editor'})).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(jsonButton).toHaveFocus();
    expect(jsonButton).toBeVisible();
  });

  test.each([FILTER_VIEW_TYPES.enlarged, FILTER_VIEW_TYPES.minified])(
    'dismisses JSON after applying a view change from %s without leaving a blocking popup',
    async initialView => {
      const user = userEvent.setup();
      const nextView =
        initialView === FILTER_VIEW_TYPES.enlarged
          ? FILTER_VIEW_TYPES.minified
          : FILTER_VIEW_TYPES.enlarged;
      const applyFilterConfig = jest.fn();
      const toggleAnimation = jest.fn();
      const EditorState = React.createContext<
        Pick<AnimationJsonEditorProps, 'visState' | 'applyFilterConfig'>
      >({});
      const Editor = (props: AnimationJsonEditorProps) => (
        <RealAnimationJsonEditor {...props} {...React.useContext(EditorState)} />
      );
      const Header = TimeWidgetTopFactory(AnimationSpeedSlider, Editor);
      function StatefulHeader() {
        const [currentFilter, setCurrentFilter] = React.useState({
          ...filter,
          name: ['time'],
          view: initialView
        });
        applyFilterConfig.mockImplementation((_id, nextFilter) => setCurrentFilter(nextFilter));
        return (
          <EditorState.Provider
            value={{
              visState: {...INITIAL_VIS_STATE, filters: [currentFilter]},
              applyFilterConfig
            }}
          >
            <Header
              filter={currentFilter}
              isMinified={currentFilter.view === FILTER_VIEW_TYPES.minified}
              readOnly={false}
              onClose={jest.fn()}
              onToggleMinify={jest.fn()}
              playbackControls={{
                isAnimatable: true,
                isAnimating: false,
                speed: 1,
                toggleAnimation,
                resetAnimation: jest.fn(),
                updateAnimationSpeed: jest.fn(),
                setFilterAnimationWindow: jest.fn()
              }}
            />
          </EditorState.Provider>
        );
      }

      render(<StatefulHeader />, {wrapper: HeaderWrapper});
      await user.click(screen.getByRole('button', {name: 'Edit animation JSON'}));
      const editor = screen.getByRole('textbox', {name: 'JSON configuration'});
      await waitFor(() => expect(editor).toBeVisible());
      fireEvent.change(editor, {target: {value: JSON.stringify({view: nextView})}});
      await user.click(screen.getByTestId('json-editor-apply'));

      expect(applyFilterConfig).toHaveBeenCalledWith(
        filter.id,
        expect.objectContaining({view: nextView})
      );
      expect(
        screen.getByRole('button', {
          name: nextView === FILTER_VIEW_TYPES.minified ? 'Expand timeline' : 'Collapse timeline'
        })
      ).toBeVisible();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const jsonButton = screen.getByRole('button', {name: 'Edit animation JSON'});
      expect(jsonButton).toHaveAttribute('aria-expanded', 'false');
      await user.click(screen.getByRole('button', {name: 'Play'}));
      expect(toggleAnimation).toHaveBeenCalledTimes(1);

      await user.click(jsonButton);
      await waitFor(() =>
        expect(screen.getByRole('textbox', {name: 'JSON configuration'})).toBeVisible()
      );
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(jsonButton).toHaveFocus();
    }
  );

  test.each([
    {enableJsonEditors: false, enableAnimationJsonEditor: true},
    {enableJsonEditors: true, enableAnimationJsonEditor: false}
  ])('hides JSON when either required feature flag is off: %p', config => {
    initApplicationConfig(config);
    setupPlayback();
    expect(screen.queryByRole('button', {name: 'Edit animation JSON'})).not.toBeInTheDocument();
    expect(AnimationJsonEditor).not.toHaveBeenCalled();
  });
});
