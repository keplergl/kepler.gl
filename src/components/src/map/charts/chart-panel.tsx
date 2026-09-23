// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';

import {VisStateActions} from '@kepler.gl/actions';
import {
  ChartConfig,
  ChartType,
  ChartRenderer,
  LayerChartType,
  computeChart,
  getCrossFilterField,
  isLayerChartConfig,
  toChartableDataset,
  ChartAxis,
  CHART_AGGREGATION_OPTIONS,
  CHART_COLOR_BY_OPTIONS,
  ChartColorBy,
  BinType,
  TIME_FIELD_TYPES,
  getDefaultChartColorRange,
  formatNumber
} from '@kepler.gl/charts';
import {DEFAULT_COLOR_UI, TOOLTIP_FORMATS, TOOLTIP_FORMAT_TYPES} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer} from '@kepler.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {ColorRange, ColorUI, NestedPartial, RGBColor} from '@kepler.gl/types';
import {generateHashId} from '@kepler.gl/common-utils';
import {applyDefaultFormat, runGpuFilterForPlot} from '@kepler.gl/utils';

import {Settings, Trash} from '../../common/icons';
import {Input, PanelLabel, Tooltip} from '../../common/styled-components';
import Switch from '../../common/switch';
import ItemSelector from '../../common/item-selector/item-selector';
import FieldSelectorFactory from '../../common/field-selector';
import SourceDataSelectorFactory from '../../side-panel/common/source-data-selector';
import ColorSelectorFactory, {ColorSet} from '../../side-panel/layer-panel/color-selector';
import {
  ChartConfigGroup,
  ChartConfigSection,
  ChartConfigSectionWrapper,
  ConfigUncollapsibleContent
} from './chart-config-group';

const DEFAULT_SINGLE_COLOR: RGBColor = [18, 147, 154];
const DEFAULT_BIG_NUMBER_FORMAT = TOOLTIP_FORMATS.DECIMAL_SHORT_COMMA.id;
const BIG_NUMBER_FORMAT_TYPES = [
  TOOLTIP_FORMAT_TYPES.NONE,
  TOOLTIP_FORMAT_TYPES.DECIMAL,
  TOOLTIP_FORMAT_TYPES.PERCENTAGE
];
const BIG_NUMBER_FORMAT_OPTIONS = Object.values(TOOLTIP_FORMATS).filter(fm =>
  BIG_NUMBER_FORMAT_TYPES.includes(fm.type)
);

function asRgbColor(value: unknown): RGBColor {
  if (Array.isArray(value) && value.length >= 3) {
    return [Number(value[0]), Number(value[1]), Number(value[2])];
  }
  return DEFAULT_SINGLE_COLOR;
}

function formatBigNumberTick(value: number, formatId?: string | null): string {
  const id = formatId || DEFAULT_BIG_NUMBER_FORMAT;
  const tooltipFormat = BIG_NUMBER_FORMAT_OPTIONS.find(fm => fm.id === id);
  if (!tooltipFormat || tooltipFormat.id === TOOLTIP_FORMATS.NONE.id || !tooltipFormat.format) {
    return formatNumber(value);
  }
  return applyDefaultFormat(tooltipFormat)(value);
}

/**
 * Charts should respect the same filters as the map. Kepler keeps range/time
 * filters on the GPU, so `dataset.filteredIndex` alone is not enough — apply
 * GPU filters on CPU the same way filter histograms do.
 */
function toMapFilteredChartDataset(dataset: Datasets[string] | undefined) {
  if (!dataset) {
    return null;
  }
  const filteredIndex =
    dataset.gpuFilter?.filterValueAccessor != null ? runGpuFilterForPlot(dataset) : undefined;
  return toChartableDataset(dataset, filteredIndex ? {filteredIndex} : undefined);
}

function binAggregationForField(field: {type: string} | null): ChartAxis['aggregation'] {
  if (!field) {
    return BinType.uniqueBin;
  }
  if (TIME_FIELD_TYPES.includes(field.type)) {
    return BinType.timeBin;
  }
  if (field.type === 'real') {
    return BinType.numericBin;
  }
  return BinType.uniqueBin;
}

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
  gap: 8px;
  padding: 8px 8px 0;
  min-width: 0;
`;

const ChartTitleInput = styled(Input)`
  flex: 1 1 auto;
  min-width: 0;
  width: auto;
`;

const ChartHeaderActions = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const ChartHeaderAction = styled.div<{
  $active?: boolean;
  $hoverColor?: string;
}>`
  margin-left: 8px;
  display: flex;
  align-items: center;
  color: ${props =>
    props.$active ? props.theme.panelHeaderIconActive : props.theme.panelHeaderIcon};
  cursor: pointer;

  &:hover {
    color: ${props =>
      props.$hoverColor ? props.theme[props.$hoverColor] : props.theme.panelHeaderIconHover};
  }
`;

const ConfigBlock = styled.div`
  padding: 6px 8px 8px;
  border-top: 1px solid ${props => props.theme.panelBorderColor};
  max-height: 70vh;
  overflow-y: auto;
`;

const SourceDataSelectorWrapper = styled.div`
  .side-panel-section {
    margin-bottom: 0;
  }
  label {
    display: none;
  }
`;

const CompactFieldSelector = styled.div`
  min-width: 0;

  .field-selector {
    margin-bottom: 0;
  }
`;

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

ChartPanelContentFactory.deps = [
  FieldSelectorFactory,
  SourceDataSelectorFactory,
  ColorSelectorFactory
];

export function ChartPanelContentFactory(
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  SourceDataSelector: ReturnType<typeof SourceDataSelectorFactory>,
  ColorSelector: ReturnType<typeof ColorSelectorFactory>
): React.FC<ChartPanelProps> {
  const ChartPanelContent: React.FC<ChartPanelProps> = ({
    charts = [],
    datasets,
    layers,
    visStateActions
  }) => {
    const [colorUIByChart, setColorUIByChart] = useState<Record<string, ColorUI>>({});

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
        {charts.map(chart => {
          const rawDataset = chart.dataId ? datasets[chart.dataId] : undefined;
          const dataset = chart.dataId
            ? chart.applyFilters
              ? toMapFilteredChartDataset(rawDataset)
              : toChartableDataset(rawDataset)
            : null;
          const fields = dataset?.fields || [];
          const rawView = computeChart(chart, dataset);
          const view =
            rawView.kind === 'bigNumber'
              ? {
                  ...rawView,
                  formattedValue: formatBigNumberTick(rawView.value, rawView.format)
                }
              : rawView;
          const selectedKey =
            chart.crossFilter?.enabled && chart.crossFilter.value?.x != null
              ? String(chart.crossFilter.value.x)
              : undefined;
          return (
            <ChartCard key={chart.id} className="chart-card">
              <ChartCardHeader>
                <ChartTitleInput
                  type="text"
                  value={chart.title}
                  onChange={event => onUpdate(chart.id, {title: event.target.value})}
                />
                <ChartHeaderActions>
                  <ChartHeaderAction
                    $active={Boolean(chart.display?.isConfigActive)}
                    data-tip
                    data-for={`chart-settings_${chart.id}`}
                    onClick={() =>
                      onUpdate(chart.id, {
                        display: {isConfigActive: !chart.display?.isConfigActive}
                      })
                    }
                  >
                    <Settings height="16px" />
                  </ChartHeaderAction>
                  <Tooltip id={`chart-settings_${chart.id}`} effect="solid" delayShow={500}>
                    <span>
                      <FormattedMessage
                        id="tooltip.chartSettings"
                        defaultMessage="Chart settings"
                      />
                    </span>
                  </Tooltip>
                  <ChartHeaderAction
                    aria-label="Remove chart"
                    data-tip
                    data-for={`chart-remove_${chart.id}`}
                    onClick={() => onRemove(chart.id)}
                  >
                    <Trash height="16px" />
                  </ChartHeaderAction>
                  <Tooltip id={`chart-remove_${chart.id}`} effect="solid" delayShow={500}>
                    <span>
                      <FormattedMessage id="tooltip.removeChart" defaultMessage="Remove chart" />
                    </span>
                  </Tooltip>
                </ChartHeaderActions>
              </ChartCardHeader>
              <ChartRenderer
                data={view}
                selectedKey={selectedKey}
                onSelect={key => onSelectBin(chart, key)}
              />
              {chart.display?.isConfigActive ? (
                <ConfigBlock>
                  <ChartConfigGroup
                    label="chartPanel.dataset"
                    defaultMessage="Dataset"
                    expanded={!chart.dataId && !isLayerChartConfig(chart)}
                  >
                    <ConfigUncollapsibleContent>
                      {!isLayerChartConfig(chart) ? (
                        <SourceDataSelectorWrapper>
                          <SourceDataSelector
                            datasets={datasets}
                            dataId={chart.dataId}
                            onSelect={dataId => onUpdate(chart.id, {dataId: String(dataId)})}
                          />
                        </SourceDataSelectorWrapper>
                      ) : (
                        <ChartConfigSectionWrapper>
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
                            size="small"
                            onChange={layerId => {
                              const layer = layers.find(l => l.id === layerId);
                              onUpdate(chart.id, {
                                layerId: String(layerId),
                                dataId: layer?.config.dataId ?? chart.dataId
                              } as Partial<ChartConfig>);
                            }}
                          />
                        </ChartConfigSectionWrapper>
                      )}
                    </ConfigUncollapsibleContent>
                    {chart.type === ChartType.bigNumber && !isLayerChartConfig(chart) ? (
                      <ChartConfigSectionWrapper>
                        <PanelLabel>
                          <FormattedMessage
                            id="chartPanel.applyFilters"
                            defaultMessage="Apply map filters"
                          />
                        </PanelLabel>
                        <Switch
                          id={`${chart.id}-apply-filters`}
                          checked={chart.applyFilters}
                          onChange={() => onUpdate(chart.id, {applyFilters: !chart.applyFilters})}
                        />
                      </ChartConfigSectionWrapper>
                    ) : null}
                  </ChartConfigGroup>

                  {chart.type === ChartType.bigNumber ||
                  (isLayerChartConfig(chart) &&
                    chart.layerChartType === LayerChartType.BREAKDOWN_BY_CATEGORY) ? (
                    <ChartConfigGroup label="chartPanel.field" defaultMessage="Field">
                      <ConfigUncollapsibleContent>
                        <ChartConfigSection>
                          <CompactFieldSelector>
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
                          </CompactFieldSelector>
                        </ChartConfigSection>
                      </ConfigUncollapsibleContent>
                      {chart.type === ChartType.bigNumber ? (
                        <ChartConfigSectionWrapper>
                          <PanelLabel>
                            <FormattedMessage
                              id="chartPanel.aggregation"
                              defaultMessage="Aggregation"
                            />
                          </PanelLabel>
                          <ItemSelector
                            selectedItems={
                              CHART_AGGREGATION_OPTIONS.find(
                                option => option.id === chart.axis?.aggregation
                              ) || CHART_AGGREGATION_OPTIONS[0]
                            }
                            options={CHART_AGGREGATION_OPTIONS}
                            displayOption={(d: {label: string}) => d.label}
                            getOptionValue={(d: {id: string}) => d.id}
                            multiSelect={false}
                            searchable={false}
                            size="small"
                            onChange={aggregation =>
                              onUpdate(chart.id, {
                                axis: {
                                  ...(chart.axis as ChartAxis),
                                  aggregation: aggregation as ChartAxis['aggregation']
                                }
                              })
                            }
                          />
                        </ChartConfigSectionWrapper>
                      ) : null}
                    </ChartConfigGroup>
                  ) : null}

                  {chart.type !== ChartType.bigNumber &&
                  !(
                    isLayerChartConfig(chart) &&
                    chart.layerChartType === LayerChartType.BREAKDOWN_BY_CATEGORY
                  ) ? (
                    <ChartConfigGroup label="chartPanel.xAxis" defaultMessage="X axis" expanded>
                      <ConfigUncollapsibleContent>
                        <ChartConfigSection>
                          <CompactFieldSelector>
                            <FieldSelector
                              fields={fields as any}
                              value={chart.xAxis?.field?.name}
                              erasable
                              onSelect={item =>
                                onUpdate(chart.id, {
                                  xAxis: axisFromField(
                                    (item as any) || null,
                                    chart.type === ChartType.horizontalBar
                                      ? chart.xAxis?.aggregation || 'count'
                                      : binAggregationForField((item as any) || null)
                                  )
                                })
                              }
                            />
                          </CompactFieldSelector>
                        </ChartConfigSection>
                        {chart.type === ChartType.horizontalBar ? (
                          <ChartConfigSectionWrapper>
                            <PanelLabel>
                              <FormattedMessage
                                id="chartPanel.aggregation"
                                defaultMessage="Aggregation"
                              />
                            </PanelLabel>
                            <ItemSelector
                              selectedItems={
                                CHART_AGGREGATION_OPTIONS.find(
                                  option => option.id === chart.xAxis?.aggregation
                                ) || CHART_AGGREGATION_OPTIONS[0]
                              }
                              options={CHART_AGGREGATION_OPTIONS}
                              displayOption={(d: {label: string}) => d.label}
                              getOptionValue={(d: {id: string}) => d.id}
                              multiSelect={false}
                              searchable={false}
                              size="small"
                              onChange={aggregation =>
                                onUpdate(chart.id, {
                                  xAxis: {
                                    ...(chart.xAxis as ChartAxis),
                                    aggregation: aggregation as ChartAxis['aggregation']
                                  }
                                })
                              }
                            />
                          </ChartConfigSectionWrapper>
                        ) : null}
                      </ConfigUncollapsibleContent>
                    </ChartConfigGroup>
                  ) : null}

                  {chart.type === ChartType.barChart ||
                  chart.type === ChartType.horizontalBar ||
                  chart.type === ChartType.lineChart ||
                  (isLayerChartConfig(chart) &&
                    chart.layerChartType === LayerChartType.TIME_SERIES) ? (
                    <ChartConfigGroup label="chartPanel.yAxis" defaultMessage="Y axis" expanded>
                      <ConfigUncollapsibleContent>
                        <ChartConfigSection>
                          <CompactFieldSelector>
                            <FieldSelector
                              fields={fields as any}
                              value={chart.yAxis?.field?.name}
                              erasable
                              onSelect={item =>
                                onUpdate(chart.id, {
                                  yAxis: axisFromField(
                                    (item as any) || null,
                                    chart.type === ChartType.horizontalBar
                                      ? binAggregationForField((item as any) || null)
                                      : chart.yAxis?.aggregation || 'count'
                                  )
                                })
                              }
                            />
                          </CompactFieldSelector>
                        </ChartConfigSection>
                        {chart.type !== ChartType.horizontalBar ? (
                          <ChartConfigSectionWrapper>
                            <PanelLabel>
                              <FormattedMessage
                                id="chartPanel.aggregation"
                                defaultMessage="Aggregation"
                              />
                            </PanelLabel>
                            <ItemSelector
                              selectedItems={
                                CHART_AGGREGATION_OPTIONS.find(
                                  option => option.id === chart.yAxis?.aggregation
                                ) || CHART_AGGREGATION_OPTIONS[0]
                              }
                              options={CHART_AGGREGATION_OPTIONS}
                              displayOption={(d: {label: string}) => d.label}
                              getOptionValue={(d: {id: string}) => d.id}
                              multiSelect={false}
                              searchable={false}
                              size="small"
                              onChange={aggregation =>
                                onUpdate(chart.id, {
                                  yAxis: {
                                    ...(chart.yAxis as ChartAxis),
                                    aggregation: aggregation as ChartAxis['aggregation']
                                  }
                                })
                              }
                            />
                          </ChartConfigSectionWrapper>
                        ) : null}
                      </ConfigUncollapsibleContent>
                    </ChartConfigGroup>
                  ) : null}

                  {chart.type === ChartType.heatmapChart || chart.type === ChartType.pivotTable ? (
                    <>
                      <ChartConfigGroup label="chartPanel.yAxis" defaultMessage="Y axis" expanded>
                        <ConfigUncollapsibleContent>
                          <ChartConfigSection>
                            <CompactFieldSelector>
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
                            </CompactFieldSelector>
                          </ChartConfigSection>
                        </ConfigUncollapsibleContent>
                      </ChartConfigGroup>
                      <ChartConfigGroup label="chartPanel.value" defaultMessage="Value" expanded>
                        <ConfigUncollapsibleContent>
                          <ChartConfigSection>
                            <CompactFieldSelector>
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
                            </CompactFieldSelector>
                          </ChartConfigSection>
                          <ChartConfigSectionWrapper>
                            <PanelLabel>
                              <FormattedMessage
                                id="chartPanel.aggregation"
                                defaultMessage="Aggregation"
                              />
                            </PanelLabel>
                            <ItemSelector
                              selectedItems={
                                CHART_AGGREGATION_OPTIONS.find(
                                  option => option.id === chart.value?.aggregation
                                ) || CHART_AGGREGATION_OPTIONS[0]
                              }
                              options={CHART_AGGREGATION_OPTIONS}
                              displayOption={(d: {label: string}) => d.label}
                              getOptionValue={(d: {id: string}) => d.id}
                              multiSelect={false}
                              searchable={false}
                              size="small"
                              onChange={aggregation =>
                                onUpdate(chart.id, {
                                  value: {
                                    ...(chart.value as ChartAxis),
                                    aggregation: aggregation as ChartAxis['aggregation']
                                  }
                                })
                              }
                            />
                          </ChartConfigSectionWrapper>
                        </ConfigUncollapsibleContent>
                      </ChartConfigGroup>
                    </>
                  ) : null}

                  {isLayerChartConfig(chart) ? (
                    <ChartConfigGroup label="chartPanel.idField" defaultMessage="Feature id field">
                      <ConfigUncollapsibleContent>
                        <ChartConfigSection>
                          <CompactFieldSelector>
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
                          </CompactFieldSelector>
                        </ChartConfigSection>
                      </ConfigUncollapsibleContent>
                    </ChartConfigGroup>
                  ) : null}

                  {chart.type === ChartType.barChart || chart.type === ChartType.horizontalBar ? (
                    <ChartConfigGroup label="chartPanel.color" defaultMessage="Color">
                      <ConfigUncollapsibleContent>
                        <ChartConfigSection>
                          <ColorSelector
                            colorSets={[
                              ((chart.colorBy ?? ChartColorBy.category) === ChartColorBy.none
                                ? {
                                    selectedColor: asRgbColor(chart.chartDisplay?.color),
                                    setColor: color =>
                                      onUpdate(chart.id, {
                                        chartDisplay: {
                                          ...chart.chartDisplay,
                                          color: color as RGBColor
                                        }
                                      })
                                  }
                                : {
                                    selectedColor: (chart.chartDisplay?.colorRange ||
                                      getDefaultChartColorRange(
                                        chart.numGroups || 10
                                      )) as ColorRange,
                                    isRange: true,
                                    setColor: colorRange =>
                                      onUpdate(chart.id, {
                                        chartDisplay: {
                                          ...chart.chartDisplay,
                                          colorRange: colorRange as ColorRange
                                        }
                                      })
                                  }) as ColorSet
                            ]}
                            colorUI={colorUIByChart[chart.id] || DEFAULT_COLOR_UI}
                            setColorUI={(next: NestedPartial<ColorUI>) => {
                              setColorUIByChart(prev => {
                                const current = prev[chart.id] || DEFAULT_COLOR_UI;
                                return {
                                  ...prev,
                                  [chart.id]: {
                                    ...current,
                                    ...next,
                                    colorRangeConfig: {
                                      ...current.colorRangeConfig,
                                      ...(next.colorRangeConfig || {})
                                    }
                                  } as ColorUI
                                };
                              });
                            }}
                          />
                        </ChartConfigSection>
                        <ChartConfigSectionWrapper>
                          <PanelLabel>
                            <FormattedMessage id="chartPanel.colorBy" defaultMessage="Color by" />
                          </PanelLabel>
                          <ItemSelector
                            selectedItems={
                              CHART_COLOR_BY_OPTIONS.find(
                                option => option.id === (chart.colorBy ?? ChartColorBy.category)
                              ) || CHART_COLOR_BY_OPTIONS[1]
                            }
                            options={CHART_COLOR_BY_OPTIONS}
                            displayOption={(d: {label: string}) => d.label}
                            getOptionValue={(d: {id: string}) => d.id}
                            multiSelect={false}
                            searchable={false}
                            size="small"
                            onChange={value =>
                              onUpdate(chart.id, {
                                colorBy: String(value) as ChartColorBy
                              })
                            }
                          />
                        </ChartConfigSectionWrapper>
                      </ConfigUncollapsibleContent>
                    </ChartConfigGroup>
                  ) : null}

                  {!isLayerChartConfig(chart) ? (
                    chart.type === ChartType.bigNumber ? (
                      <ChartConfigGroup label="chartPanel.options" defaultMessage="Options">
                        <ChartConfigSectionWrapper>
                          <PanelLabel>
                            <FormattedMessage
                              id="chartPanel.formatTicks"
                              defaultMessage="Format Ticks"
                            />
                          </PanelLabel>
                          <ItemSelector
                            selectedItems={
                              BIG_NUMBER_FORMAT_OPTIONS.find(
                                option =>
                                  option.id ===
                                  (chart.chartDisplay?.format || DEFAULT_BIG_NUMBER_FORMAT)
                              ) || BIG_NUMBER_FORMAT_OPTIONS[0]
                            }
                            options={BIG_NUMBER_FORMAT_OPTIONS}
                            displayOption="label"
                            getOptionValue="id"
                            multiSelect={false}
                            searchable={false}
                            size="small"
                            onChange={format =>
                              onUpdate(chart.id, {
                                chartDisplay: {
                                  ...chart.chartDisplay,
                                  format: String(format)
                                }
                              })
                            }
                          />
                        </ChartConfigSectionWrapper>
                      </ChartConfigGroup>
                    ) : (
                      <ChartConfigGroup label="chartPanel.options" defaultMessage="Options">
                        <ConfigUncollapsibleContent>
                          <ChartConfigSectionWrapper>
                            <PanelLabel>
                              <FormattedMessage
                                id="chartPanel.applyFilters"
                                defaultMessage="Apply map filters"
                              />
                            </PanelLabel>
                            <Switch
                              id={`${chart.id}-apply-filters`}
                              checked={chart.applyFilters}
                              onChange={() =>
                                onUpdate(chart.id, {applyFilters: !chart.applyFilters})
                              }
                            />
                          </ChartConfigSectionWrapper>
                          {chart.type === ChartType.barChart ||
                          chart.type === ChartType.horizontalBar ||
                          chart.type === ChartType.heatmapChart ? (
                            <ChartConfigSectionWrapper>
                              <PanelLabel>
                                <FormattedMessage
                                  id="chartPanel.crossFilter"
                                  defaultMessage="Cross-filter map"
                                />
                              </PanelLabel>
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
                            </ChartConfigSectionWrapper>
                          ) : null}
                        </ConfigUncollapsibleContent>
                      </ChartConfigGroup>
                    )
                  ) : null}
                </ConfigBlock>
              ) : null}
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
