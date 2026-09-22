// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {injectIntl, IntlShape} from 'react-intl';

import {
  addChart,
  updateChart,
  removeChart,
  createOrUpdateFilter,
  ActionHandler,
  VisStateActions
} from '@kepler.gl/actions';
import {VisState} from '@kepler.gl/schemas';
import {getApplicationConfig} from '@kepler.gl/utils';

import KeplerGlContext from '../../context';
import SidePanelTitleFactory from '../../effects/side-panel-title';
import ChartPanelContentFactory from './chart-panel';

export type ChartManagerState = {
  visState: VisState;
  visStateActions: {
    addChart: ActionHandler<typeof addChart>;
    updateChart: ActionHandler<typeof updateChart>;
    removeChart: ActionHandler<typeof removeChart>;
    createOrUpdateFilter: ActionHandler<typeof createOrUpdateFilter>;
  };
  children?: React.ReactNode;
};

export type ChartManagerProps = {intl: IntlShape} & Partial<ChartManagerState>;

const StyledChartPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none !important;
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
  width: ${({theme}) => theme.effectPanelWidth}px;
  min-width: 0;

  & > * {
    pointer-events: all;
  }
`;

const StyledChartPanel = styled.div`
  top: 0;
  background-color: ${props => props.theme.sidePanelBg};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  min-width: 0;
`;

const StyledChartPanelHeader = styled.div`
  padding: ${({theme}) =>
    `${theme.effectPanelPaddingTop || 8}px ${theme.effectPanelPaddingSide || 16}px 4px ${
      theme.effectPanelPaddingSide || 16
    }px`};
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const StyledChartPanelContent = styled.div`
  ${props => props.theme.sidePanelScrollBar};
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
`;

ChartManagerFactory.deps = [ChartPanelContentFactory, SidePanelTitleFactory];

export default function ChartManagerFactory(
  ChartPanelContent: ReturnType<typeof ChartPanelContentFactory>,
  SidePanelTitle: ReturnType<typeof SidePanelTitleFactory>
): React.FC<ChartManagerProps> {
  const ChartManager = (props: ChartManagerProps) => {
    const {intl, children} = props;
    const dispatch = useDispatch();
    const {selector} = useContext(KeplerGlContext);
    const visStateFromStore = useSelector(state => selector(state)?.visState);
    const visState = props.visState ?? visStateFromStore;
    const visStateActions = useMemo(
      () =>
        props.visStateActions ?? {
          addChart: chart => dispatch(addChart(chart)),
          updateChart: (id, next) => dispatch(updateChart(id, next)),
          removeChart: id => dispatch(removeChart(id)),
          createOrUpdateFilter: (id, dataId, field, value) =>
            dispatch(createOrUpdateFilter(id, dataId, field, value))
        },
      [dispatch, props.visStateActions]
    );

    if (!getApplicationConfig().enableChartsPanel) {
      return null;
    }

    return (
      <StyledChartPanelContainer className="chart-manager">
        <StyledChartPanel>
          <StyledChartPanelHeader className="chart-panel-header">
            <SidePanelTitle
              className="chart-manager-title"
              title={intl.formatMessage({id: 'header.charts'})}
            />
          </StyledChartPanelHeader>
          <StyledChartPanelContent>
            <ChartPanelContent
              charts={visState?.charts}
              datasets={visState?.datasets ?? {}}
              layers={visState?.layers ?? []}
              visStateActions={visStateActions as typeof VisStateActions}
            />
          </StyledChartPanelContent>
        </StyledChartPanel>
        {children}
      </StyledChartPanelContainer>
    );
  };

  return injectIntl(ChartManager) as React.FC<ChartManagerProps>;
}
