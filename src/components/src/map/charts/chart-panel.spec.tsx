// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {IntlProvider} from 'react-intl';

import {createBigNumberChart} from '@kepler.gl/charts';
import {messages} from '@kepler.gl/localization';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import {ChartPanelContentFactory} from './chart-panel';

jest.mock('../../side-panel/common/source-data-selector', () => {
  const SourceDataSelectorFactory = () => () => null;
  SourceDataSelectorFactory.deps = [];
  return {__esModule: true, default: SourceDataSelectorFactory};
});

const EmptyControl = () => null;
const ChartPanelContent = ChartPanelContentFactory(
  EmptyControl as any,
  EmptyControl as any,
  EmptyControl as any,
  EmptyControl as any
);
const chart = createBigNumberChart({id: 'chart-1', title: 'Rows', pinned: true});

function renderChartPanel(hidePinAction: boolean) {
  return renderWithTheme(
    <IntlProvider locale="en" messages={messages.en}>
      <ChartPanelContent
        charts={[chart]}
        datasets={{}}
        layers={[]}
        readOnly
        hidePinAction={hidePinAction}
      />
    </IntlProvider>
  );
}

describe('ChartPanelContent', () => {
  test('keeps ordinary pinned charts dismissible', () => {
    const {getByLabelText, getByText} = renderChartPanel(false);

    expect(getByLabelText('Unpin chart')).toBeInTheDocument();
    expect(getByText('Select a dataset to plot this chart.')).toBeInTheDocument();
  });

  test('renders immutable export charts without pin actions', () => {
    const {queryByLabelText, getByText} = renderChartPanel(true);

    expect(queryByLabelText('Unpin chart')).toBeNull();
    expect(getByText('Select a dataset to plot this chart.')).toBeInTheDocument();
  });
});
