// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';

import {VisStateActions} from '@kepler.gl/actions';
import {
  ChartConfig,
  ChartType,
  ChartRenderer,
  DEFAULT_CHART_TYPE_OPTIONS,
  LayerChartType,
  computeChart,
  createChart,
  getCrossFilterField,
  isLayerChartConfig,
  toChartableDataset,
  ChartAxis
} from '@kepler.gl/charts';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer} from '@kepler.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {generateHashId} from '@kepler.gl/common-utils';

import {Trash} from '../../common/icons';
import {Button, Input, PanelLabel, SidePanelSection} from '../../common/styled-components';
import Switch from '../../common/switch';
import ItemSelector from '../../common/item-selector/item-selector';
import FieldSelectorFactory from '../../common/field-selector';
import SourceDataSelectorFactory from '../../side-panel/common/source-data-selector';

const ChartList = styled.div`
  width: 100%;
  padding: 8px;
`;

const ChartCard = styled.div`
  border: 1px solid ${props => props.theme.panelBorderColor};
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: ${props => props.theme.panelBackground};
`;

const ChartCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 8px 0;
`;

const EmptyCopy = styled.div`
  color: ${props => props.theme.subtextColor};
  font-size: 11px;
  padding: 12px 4px;
`;

const ConfigBlock = styled.div`
  padding: 8px;
  border-top: 1px solid ${props => props.theme.panelBorderColor};
`;

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: ${props => props.theme.textColor};
  margin: 6px 0;
`;

const AGGREGATION_OPTIONS = [
  {id: 'count', label: 'Count'},
  {id: 'sum', label: 'Sum'},
  {id: 'average', label: 'Average'},
  {id: 'maximum', label: 'Maximum'},
  {id: 'minimum', label: 'Minimum'},
  {id: 'median', label: 'Median'}
];

function axisFromField(
  field: {name: string; type: string} | null,
  aggregation: ChartAxis['aggregation']
): ChartAxis {
  return {
    field: field ? {name: field.name, type: field.type} : null,
    aggregation,
    title: field?.name ?? null
  };
}

export type ChartPanelProps = {
  charts?: ChartConfig[];
  datasets: Datasets;
  layers: Layer[];
  visStateActions?: typeof VisStateActions;
};

ChartPanelContentFactory.deps = [FieldSelectorFactory, SourceDataSelectorFactory];

export function ChartPanelContentFactory(
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>
): React.FC<ChartPanelProps> {
  const ChartPanelContent: React.FC<ChartPanelProps> = ({
    charts = [],
    datasets,
    layers,
    visStateActions
  }) => {
    const datasetList = Object.values(datasets || {});
    const firstDataset = datasetList[0];

    const onAdd = useCallback(
      (type: ChartType | LayerChartType) => {
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
          visStateActions?.addChart(chart);
        }
      },
      [datasets, firstDataset, layers, visStateActions]
    );

    const onUpdate = useCallback(
      (id: string, props: Partial<ChartConfig>) => {
        visStateActions?.updateChart(id, props);
      },
      [visStateActions]
    );

    const onRemove = useCallback(
      (id: string) => {
        visStateActions?.removeChart(id);
      },
      [visStateActions]
    );

    const onSelectBin = useCallback(
      (chart: ChartConfig, key: string) => {
        if (isLayerChartConfig(chart) || !chart.dataId) {
          return;
        }
        const fieldName = getCrossFilterField(chart);
        if (!fieldName) {
          return;
        }
        const filterId = chart.crossFilter?.filterId || `chart-${chart.id}-${generateHashId(4)}`;
        const alreadySelected =
          chart.crossFilter?.enabled && String(chart.crossFilter.value?.x) === key;
        if (alreadySelected) {
          visStateActions?.updateChart(chart.id, {
            crossFilter: {enabled: false, filterId, fieldNames: {x: fieldName}, value: {}}
          });
          return;
        }
        visStateActions?.createOrUpdateFilter(filterId, chart.dataId, fieldName, [key]);
        visStateActions?.updateChart(chart.id, {
          crossFilter: {
            enabled: true,
            filterId,
            fieldNames: {x: fieldName},
            value: {x: key}
          }
        });
      },
      [visStateActions]
    );

    return (
      <ChartList className="chart-panel">
        <SidePanelSection>
          <PanelLabel>
            <FormattedMessage id="chartPanel.addChart" defaultMessage="Add chart" />
          </PanelLabel>
          <ItemSelector
            selectedItems={null}
            options={DEFAULT_CHART_TYPE_OPTIONS}
            displayOption={(d: {label: string}) => d.label}
            getOptionValue={(d: {id: string}) => d.id}
            multiSelect={false}
            searchable={false}
            placeholder="chartPanel.selectType"
            onChange={value => {
              const type = typeof value === 'string' ? value : (value as {id?: string})?.id;
              if (type) {
                onAdd(type as ChartType | LayerChartType);
              }
            }}
          />
        </SidePanelSection>
        {!charts.length ? (
          <EmptyCopy>
            <FormattedMessage
              id="chartPanel.empty"
              defaultMessage="Add a chart to summarize the current map data. Charts stay optional and are not dashboards."
            />
          </EmptyCopy>
        ) : null}
        {charts.map(chart => {
          const dataset = chart.dataId ? toChartableDataset(datasets[chart.dataId]) : null;
          const fields = dataset?.fields || [];
          const view = computeChart(chart, dataset);
          const selectedKey =
            chart.crossFilter?.enabled && chart.crossFilter.value?.x != null
              ? String(chart.crossFilter.value.x)
              : undefined;
          return (
            <ChartCard key={chart.id} className="chart-card">
              <ChartCardHeader>
                <Input
                  type="text"
                  value={chart.title}
                  onChange={event => onUpdate(chart.id, {title: event.target.value})}
                />
                <Button link small negative onClick={() => onRemove(chart.id)}>
                  <Trash height="14px" />
                </Button>
              </ChartCardHeader>
              <ChartRenderer
                data={view}
                selectedKey={selectedKey}
                onSelect={key => onSelectBin(chart, key)}
              />
              {chart.display?.isConfigActive ? (
                <ConfigBlock>
                  {!isLayerChartConfig(chart) ? (
                    <SourceDataSelector
                      datasets={datasets}
                      dataId={chart.dataId}
                      onSelect={dataId => onUpdate(chart.id, {dataId: String(dataId)})}
                    />
                  ) : (
                    <SidePanelSection>
                      <PanelLabel>
                        <FormattedMessage id="chartPanel.layer" defaultMessage="Layer" />
                      </PanelLabel>
                      <ItemSelector
                        selectedItems={layers.find(layer => layer.id === chart.layerId) || null}
                        options={layers}
                        displayOption={(layer: Layer) => layer.config.label || layer.id}
                        getOptionValue={(layer: Layer) => layer.id}
                        multiSelect={false}
                        searchable={false}
                        onChange={layerId => {
                          const layer = layers.find(l => l.id === layerId);
                          onUpdate(chart.id, {
                            layerId: String(layerId),
                            dataId: layer?.config.dataId ?? chart.dataId
                          } as Partial<ChartConfig>);
                        }}
                      />
                    </SidePanelSection>
                  )}
                  {chart.type === ChartType.bigNumber ||
                  (isLayerChartConfig(chart) &&
                    chart.layerChartType === LayerChartType.BREAKDOWN_BY_CATEGORY) ? (
                    <SidePanelSection>
                      <PanelLabel>
                        <FormattedMessage id="chartPanel.field" defaultMessage="Field" />
                      </PanelLabel>
                      <FieldSelector
                        fields={fields as any}
                        value={chart.axis?.field?.name}
                        erasable
                        onSelect={item =>
                          onUpdate(chart.id, {
                            axis: axisFromField(
                              (item as any) || null,
                              chart.type === ChartType.bigNumber
                                ? chart.axis?.aggregation || 'count'
                                : chart.axis?.aggregation ?? null
                            )
                          })
                        }
                      />
                    </SidePanelSection>
                  ) : null}
                  {chart.type !== ChartType.bigNumber &&
                  !(
                    isLayerChartConfig(chart) &&
                    chart.layerChartType === LayerChartType.BREAKDOWN_BY_CATEGORY
                  ) ? (
                    <SidePanelSection>
                      <PanelLabel>
                        <FormattedMessage id="chartPanel.xAxis" defaultMessage="X axis" />
                      </PanelLabel>
                      <FieldSelector
                        fields={fields as any}
                        value={chart.xAxis?.field?.name}
                        erasable
                        onSelect={item =>
                          onUpdate(chart.id, {
                            xAxis: axisFromField(
                              (item as any) || null,
                              chart.xAxis?.aggregation || null
                            )
                          })
                        }
                      />
                    </SidePanelSection>
                  ) : null}
                  {chart.type === ChartType.barChart ||
                  chart.type === ChartType.horizontalBar ||
                  chart.type === ChartType.lineChart ||
                  (isLayerChartConfig(chart) &&
                    chart.layerChartType === LayerChartType.TIME_SERIES) ? (
                    <SidePanelSection>
                      <PanelLabel>
                        <FormattedMessage id="chartPanel.yAxis" defaultMessage="Y axis" />
                      </PanelLabel>
                      <FieldSelector
                        fields={fields as any}
                        value={chart.yAxis?.field?.name}
                        erasable
                        onSelect={item =>
                          onUpdate(chart.id, {
                            yAxis: axisFromField(
                              (item as any) || null,
                              chart.yAxis?.aggregation || 'count'
                            )
                          })
                        }
                      />
                    </SidePanelSection>
                  ) : null}
                  {chart.type === ChartType.heatmapChart || chart.type === ChartType.pivotTable ? (
                    <>
                      <SidePanelSection>
                        <PanelLabel>
                          <FormattedMessage id="chartPanel.yAxis" defaultMessage="Y axis" />
                        </PanelLabel>
                        <FieldSelector
                          fields={fields as any}
                          value={chart.yAxis?.field?.name}
                          erasable
                          onSelect={item =>
                            onUpdate(chart.id, {
                              yAxis: axisFromField(
                                (item as any) || null,
                                chart.yAxis?.aggregation || null
                              )
                            })
                          }
                        />
                      </SidePanelSection>
                      <SidePanelSection>
                        <PanelLabel>
                          <FormattedMessage id="chartPanel.value" defaultMessage="Value" />
                        </PanelLabel>
                        <FieldSelector
                          fields={fields as any}
                          value={chart.value?.field?.name}
                          erasable
                          onSelect={item =>
                            onUpdate(chart.id, {
                              value: axisFromField(
                                (item as any) || null,
                                chart.value?.aggregation || 'count'
                              )
                            })
                          }
                        />
                      </SidePanelSection>
                    </>
                  ) : null}
                  {isLayerChartConfig(chart) ? (
                    <SidePanelSection>
                      <PanelLabel>
                        <FormattedMessage
                          id="chartPanel.idField"
                          defaultMessage="Feature id field"
                        />
                      </PanelLabel>
                      <FieldSelector
                        fields={fields as any}
                        value={chart.chartDisplay?.idField}
                        erasable
                        onSelect={item =>
                          onUpdate(chart.id, {
                            chartDisplay: {
                              ...chart.chartDisplay,
                              idField: (item as any)?.name ?? null
                            }
                          } as Partial<ChartConfig>)
                        }
                      />
                    </SidePanelSection>
                  ) : null}
                  {chart.type === ChartType.bigNumber ||
                  chart.type === ChartType.barChart ||
                  chart.type === ChartType.horizontalBar ||
                  chart.type === ChartType.lineChart ||
                  chart.type === ChartType.heatmapChart ||
                  chart.type === ChartType.pivotTable ? (
                    <SidePanelSection>
                      <PanelLabel>
                        <FormattedMessage
                          id="chartPanel.aggregation"
                          defaultMessage="Aggregation"
                        />
                      </PanelLabel>
                      <ItemSelector
                        selectedItems={
                          AGGREGATION_OPTIONS.find(option => {
                            const agg =
                              chart.type === ChartType.bigNumber
                                ? chart.axis?.aggregation
                                : chart.type === ChartType.heatmapChart ||
                                  chart.type === ChartType.pivotTable
                                ? chart.value?.aggregation
                                : chart.type === ChartType.horizontalBar
                                ? chart.xAxis?.aggregation
                                : chart.yAxis?.aggregation;
                            return option.id === agg;
                          }) || AGGREGATION_OPTIONS[0]
                        }
                        options={AGGREGATION_OPTIONS}
                        displayOption={(d: {label: string}) => d.label}
                        getOptionValue={(d: {id: string}) => d.id}
                        multiSelect={false}
                        searchable={false}
                        onChange={aggregation => {
                          const next = aggregation as ChartAxis['aggregation'];
                          if (chart.type === ChartType.bigNumber) {
                            onUpdate(chart.id, {
                              axis: {...(chart.axis as ChartAxis), aggregation: next}
                            });
                          } else if (chart.type === ChartType.horizontalBar) {
                            onUpdate(chart.id, {
                              xAxis: {...(chart.xAxis as ChartAxis), aggregation: next}
                            });
                          } else if (
                            chart.type === ChartType.heatmapChart ||
                            chart.type === ChartType.pivotTable
                          ) {
                            onUpdate(chart.id, {
                              value: {...(chart.value as ChartAxis), aggregation: next}
                            });
                          } else {
                            onUpdate(chart.id, {
                              yAxis: {...(chart.yAxis as ChartAxis), aggregation: next}
                            });
                          }
                        }}
                      />
                    </SidePanelSection>
                  ) : null}
                  {!isLayerChartConfig(chart) ? (
                    <>
                      <ToggleRow>
                        <FormattedMessage
                          id="chartPanel.applyFilters"
                          defaultMessage="Apply map filters"
                        />
                        <Switch
                          id={`${chart.id}-apply-filters`}
                          checked={chart.applyFilters}
                          onChange={() => onUpdate(chart.id, {applyFilters: !chart.applyFilters})}
                        />
                      </ToggleRow>
                      {chart.type === ChartType.barChart ||
                      chart.type === ChartType.horizontalBar ||
                      chart.type === ChartType.heatmapChart ? (
                        <ToggleRow>
                          <FormattedMessage
                            id="chartPanel.crossFilter"
                            defaultMessage="Cross-filter map"
                          />
                          <Switch
                            id={`${chart.id}-cross-filter`}
                            checked={Boolean(chart.crossFilter?.enabled)}
                            onChange={() => {
                              const fieldName = getCrossFilterField(chart);
                              const filterId =
                                chart.crossFilter?.filterId ||
                                `chart-${chart.id}-${generateHashId(4)}`;
                              onUpdate(chart.id, {
                                crossFilter: {
                                  enabled: !chart.crossFilter?.enabled,
                                  filterId,
                                  fieldNames: fieldName ? {x: fieldName} : {},
                                  value: {}
                                }
                              });
                            }}
                          />
                        </ToggleRow>
                      ) : null}
                    </>
                  ) : null}
                </ConfigBlock>
              ) : (
                <Button
                  link
                  small
                  width="100%"
                  onClick={() => onUpdate(chart.id, {display: {isConfigActive: true}})}
                >
                  <FormattedMessage id="chartPanel.configure" defaultMessage="Configure" />
                </Button>
              )}
            </ChartCard>
          );
        })}
      </ChartList>
    );
  };

  ChartPanelContent.displayName = 'ChartPanelContent';
  return ChartPanelContent;
}

export default ChartPanelContentFactory;
