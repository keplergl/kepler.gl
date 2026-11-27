// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState} from 'react';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {IntlProvider} from 'react-intl';
import {FILTER_TYPES, FILTER_VIEW_TYPES} from '@kepler.gl/constants';
import {messages} from '@kepler.gl/localization';
import {visStateUpdaters} from '@kepler.gl/reducers';
import {theme} from '@kepler.gl/styles';
import type {Filter} from '@kepler.gl/types';
import {renderWithTheme} from 'test/helpers/component-jest-utils';
import BottomWidgetFactory from './bottom-widget';
import type TimeWidgetFactory from './filters/time-widget';
import MultiSelectFilterFactory from './filters/multi-select-filter';
import MultiSelectFilterPanelFactory from './filters/filter-panels/multi-select-filter-panel';
import FieldPanelWithFieldSelectFactory from './filters/filter-panels/filter-panel-with-field-select';
import PanelHeaderActionFactory from './side-panel/panel-header-action';

// Keep the filter and its actual header-action path, without loading unrelated sidebar editors.
jest.mock('./side-panel/filter-panel/filter-panel-header', () => () => null);
jest.mock('./filters/filter-panels/filter-synced-dataset-panel', () => () => null);
jest.mock('./filters/filter-panels/time-synced-field-selector', () => () => null);
jest.mock('./filters/filter-panels/new-filter-panel', () => ({
  getSupportedFilterFields: (_types, fields) => fields
}));

const MultiSelectFilter = MultiSelectFilterFactory();
const MultiSelectFilterPanel = MultiSelectFilterPanelFactory(
  FieldPanelWithFieldSelectFactory(
    ({children}) => <>{children}</>,
    () => null,
    PanelHeaderActionFactory(),
    Object.assign(() => <></>, {displayName: 'EmptySyncedDatasetPanel'}),
    () => <></>
  ),
  MultiSelectFilter
);

const timelineController = jest.fn();
const BottomWidget = BottomWidgetFactory(
  React.memo(({filter}: React.ComponentProps<ReturnType<typeof TimeWidgetFactory>>) => (
    <div>{filter.id} timeline</div>
  )),
  () => null,
  props => {
    timelineController(props.filterIdx);
    return props.children?.(true, jest.fn(), jest.fn(), jest.fn(), {} as any, jest.fn()) ?? null;
  },
  () => null,
  () => null,
  MultiSelectFilter
);

beforeAll(() => {
  window.IntersectionObserver = class {
    observe() {
      return undefined;
    }
    unobserve() {
      return undefined;
    }
    disconnect() {
      return undefined;
    }
  } as unknown as typeof IntersectionObserver;
});

test('pauses displaced playback when floating a category and preserves category selections on close', async () => {
  const user = userEvent.setup();
  const onValue = jest.fn();
  const onView = jest.fn();
  const filters = [
    {
      id: 'time',
      type: FILTER_TYPES.timeRange,
      view: FILTER_VIEW_TYPES.enlarged,
      isAnimating: true
    },
    {
      id: 'categories',
      type: FILTER_TYPES.multiSelect,
      dataId: ['dataset'],
      name: ['category'],
      view: FILTER_VIEW_TYPES.side,
      domain: ['Alpha', 'Beta'],
      value: []
    }
  ];
  const Example = () => {
    const [currentFilters, setFilters] = useState<Filter[]>(filters as unknown as Filter[]);
    const [sidebar, setSidebar] = useState(true);
    const datasets = {dataset: {type: 'csv', fields: []}} as any;
    const setFilter = (idx, prop, value) => {
      onValue(idx, prop, value);
      setFilters(current =>
        current.map((filter, i) => (i === idx ? {...filter, [prop]: value} : filter))
      );
    };
    const setFilterView = (idx, view) => {
      onView(idx, view);
      setFilters(
        current =>
          visStateUpdaters.setFilterViewUpdater({filters: current} as any, {idx, view}).filters
      );
    };
    return (
      <>
        <output aria-label="Time filter playback">
          {currentFilters[0].isAnimating ? 'Playing' : 'Paused'}
        </output>
        <button onClick={() => setSidebar(!sidebar)}>Toggle sidebar</button>
        {sidebar ? (
          <MultiSelectFilterPanel
            idx={1}
            allAvailableFields={[]}
            datasets={datasets}
            filter={currentFilters[1] as any}
            setFilter={setFilter}
            setFilterPlot={jest.fn()}
            removeFilter={jest.fn()}
            enlargeFilter={() =>
              setFilterView(
                1,
                currentFilters[1].view === FILTER_VIEW_TYPES.side
                  ? FILTER_VIEW_TYPES.enlarged
                  : FILTER_VIEW_TYPES.side
              )
            }
          />
        ) : null}
        <BottomWidget
          rootRef={null}
          theme={theme}
          containerW={900}
          sidePanelWidth={300}
          datasets={datasets}
          filters={currentFilters}
          layers={[]}
          animationConfig={{} as any}
          uiState={{activeSidePanel: sidebar ? 'filter' : null} as any}
          toggleModal={jest.fn()}
          visStateActions={{setFilter, setFilterView} as any}
        />
      </>
    );
  };
  renderWithTheme(
    <IntlProvider locale="en" messages={messages.en}>
      <Example />
    </IntlProvider>
  );
  expect(screen.getByText('time timeline')).toBeInTheDocument();
  expect(timelineController).toHaveBeenLastCalledWith(0);
  expect(screen.getByLabelText('Time filter playback')).toHaveTextContent('Playing');
  expect(screen.getByText('Enter a value')).toBeInTheDocument();
  const toggle = screen.getByRole('button', {name: 'Toggle floating filter', pressed: false});
  await user.tab(); // Sidebar visibility control.
  await user.tab();
  expect(toggle).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect(onView).toHaveBeenLastCalledWith(1, FILTER_VIEW_TYPES.enlarged);
  expect(screen.queryByText('time timeline')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Time filter playback')).toHaveTextContent('Paused');
  await user.click(screen.getByRole('button', {name: 'Toggle sidebar'}));
  const categoryWidget = screen.getByRole('group', {name: 'category'});
  await user.click(within(categoryWidget).getByText('Enter a value'));
  await user.click(screen.getByTitle('Alpha'));
  expect(onValue).toHaveBeenLastCalledWith(1, 'value', ['Alpha']);
  await user.keyboard('{Escape}');
  await user.click(within(categoryWidget).getByRole('button', {name: 'Close current panel'}));
  expect(onView).toHaveBeenLastCalledWith(1, FILTER_VIEW_TYPES.side);
  expect(screen.queryByRole('group', {name: 'category'})).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', {name: 'Toggle sidebar'}));
  expect(screen.getByText('Alpha')).toBeInTheDocument();
  expect(screen.getByLabelText('Time filter playback')).toHaveTextContent('Paused');
});
