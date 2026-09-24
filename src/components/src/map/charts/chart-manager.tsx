// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useContext, useMemo, useState} from 'react';
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
import {ChartType, LayerChartType, createChart, toChartableDataset} from '@kepler.gl/charts';
import {VisState} from '@kepler.gl/schemas';
import {Datasets} from '@kepler.gl/table';
import {getApplicationConfig} from '@kepler.gl/utils';

import KeplerGlContext from '../../context';
import SidePanelTitleFactory from '../../effects/side-panel-title';
import ChartPanelContentFactory from './chart-panel';
import ChartTypeSelectorFactory from './chart-type-selector';

export type ChartManagerState = {
  visState: VisState;
  visStateActions: {
    addChart: ActionHandler<typeof addChart>;
    updateChart: ActionHandler<typeof updateChart>;
    removeChart: ActionHandler<typeof removeChart>;
    createOrUpdateFilter: ActionHandler<typeof createOrUpdateFilter>;
  };
  /** When false, only pinned charts are shown (panel control is inactive). */
  panelActive?: boolean;
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
  min-width: ${({theme}) => theme.effectPanelWidth}px;
`;

type StyledChartPanelContentProps = {
  $extended?: boolean;
};
const StyledChartPanelContent = styled.div<StyledChartPanelContentProps>`
  ${props => props.theme.sidePanelScrollBar};
  padding: ${props => (props.$extended ? '32px' : '3px 0')};
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
`;

ChartManagerFactory.deps = [
  ChartPanelContentFactory,
  SidePanelTitleFactory,
  ChartTypeSelectorFactory
];

export default function ChartManagerFactory(
  ChartPanelContent: ReturnType<typeof ChartPanelContentFactory>,
  SidePanelTitle: ReturnType<typeof SidePanelTitleFactory>,
  ChartTypeSelector: ReturnType<typeof ChartTypeSelectorFactory>
): React.FC<ChartManagerProps> {
  const ChartManager = (props: ChartManagerProps) => {
    const {intl, children, panelActive = true} = props;
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

    const charts = useMemo(() => {
      const allCharts = visState?.charts ?? [];
      return panelActive ? allCharts : allCharts.filter(chart => chart.pinned !== false);
    }, [visState?.charts, panelActive]);
    const datasets = useMemo<Datasets>(() => visState?.datasets ?? {}, [visState?.datasets]);
    const layers = useMemo(() => visState?.layers ?? [], [visState?.layers]);
    const [typeSelectorOpened, setTypeSelectorOpened] = useState(false);

    const onAddChart = useCallback(
      (type: ChartType | LayerChartType) => {
        const firstDataset = Object.values(datasets)[0];
        const isLayer =
          type === LayerChartType.BREAKDOWN_BY_CATEGORY || type === LayerChartType.TIME_SERIES;
        const layer = isLayer ? layers[0] : undefined;
        const dataId = layer?.config.dataId || firstDataset?.id;
        const dataset = dataId
          ? toChartableDataset(datasets[dataId])
          : toChartableDataset(firstDataset);
        const chart = createChart({
          type,
          dataId,
          dataset: dataset || undefined,
          layerId: layer?.id,
          options: {activateConfig: true}
        });
        if (chart) {
          visStateActions.addChart(chart);
        }
      },
      [datasets, layers, visStateActions]
    );

    const onTypeSelectOpen = useCallback(() => {
      setTypeSelectorOpened(true);
    }, []);

    const onTypeSelectClose = useCallback(() => {
      setTypeSelectorOpened(false);
    }, []);

    if (!getApplicationConfig().enableChartsPanel) {
      return null;
    }

    if (!panelActive && charts.length === 0) {
      return null;
    }

    return (
      <StyledChartPanelContainer className="chart-manager">
        <StyledChartPanel>
          {panelActive ? (
            <StyledChartPanelHeader className="chart-panel-header">
              <SidePanelTitle
                className="chart-manager-title"
                title={intl.formatMessage({id: 'header.charts'})}
              >
                <ChartTypeSelector
                  onSelect={onAddChart}
                  onOpen={onTypeSelectOpen}
                  onBlur={onTypeSelectClose}
                />
              </SidePanelTitle>
            </StyledChartPanelHeader>
          ) : null}
          <StyledChartPanelContent
            $extended={panelActive && typeSelectorOpened && charts.length === 0}
          >
            <ChartPanelContent
              charts={charts}
              datasets={datasets}
              layers={layers}
              visStateActions={visStateActions as typeof VisStateActions}
              readOnly={!panelActive}
            />
          </StyledChartPanelContent>
        </StyledChartPanel>
        {children}
      </StyledChartPanelContainer>
    );
  };

  return injectIntl(ChartManager) as React.FC<ChartManagerProps>;
}
