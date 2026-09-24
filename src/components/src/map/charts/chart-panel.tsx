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
  getCrossFilterFields,
  isLayerChartConfig,
  toChartableDataset,
  ChartAxis,
  CHART_AGGREGATION_OPTIONS,
  CHART_COLOR_BY_OPTIONS,
  ChartColorBy,
  BinType,
  TIME_FIELD_TYPES,
  TIME_INTERVAL_OPTIONS,
  getDefaultChartColorRange,
  HEATMAP_COLOR_STEPS,
  formatNumber
} from '@kepler.gl/charts';
import {
  DEFAULT_COLOR_UI,
  TOOLTIP_FORMATS,
  TOOLTIP_FORMAT_TYPES,
  KEPLER_COLOR_PALETTES,
  colorPaletteToColorRange
} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer} from '@kepler.gl/layers';
import {Datasets} from '@kepler.gl/table';
import {ColorRange, ColorUI, NestedPartial, RGBColor} from '@kepler.gl/types';
import {generateHashId} from '@kepler.gl/common-utils';
import {
  applyDefaultFormat,
  runGpuFilterForPlot,
  updateColorRangeByMatchingPalette,
  updateCustomColorRangeByColorUI
} from '@kepler.gl/utils';

import {Settings, Trash, Pin, EyeSeen, EyeUnseen} from '../../common/icons';
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

/** Third sequential palette (Uber Viz Sequential, Global Warming, Sunrise, …) at 20 steps. */
function defaultHeatmapColorRange(): ColorRange {
  const sequential = KEPLER_COLOR_PALETTES.filter(palette => palette.type === 'sequential');
  const palette = sequential[2] || sequential[0];
  return colorPaletteToColorRange(palette, {
    steps: HEATMAP_COLOR_STEPS,
    reversed: false
  }) as ColorRange;
}

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

const COLOR_RANGE_UI_KEYS = ['reversed', 'steps', 'colorBlindSafe', 'type'] as const;

function shouldUpdateChartColorRange(next: NestedPartial<ColorUI>, current: ColorUI): boolean {
  const config = next.colorRangeConfig;
  if (!config) {
    return false;
  }
  return COLOR_RANGE_UI_KEYS.some(
    key =>
      Object.prototype.hasOwnProperty.call(config, key) &&
      config[key] !== current.colorRangeConfig?.[key]
  );
}

function colorRangeFromColorUI(
  currentRange: ColorRange,
  colorRangeConfig: ColorUI['colorRangeConfig'],
  next: NestedPartial<ColorUI>
): ColorRange {
  const isCustomReversed =
    currentRange.category === 'Custom' &&
    Boolean(next.colorRangeConfig) &&
    Object.prototype.hasOwnProperty.call(next.colorRangeConfig, 'reversed');
  if (isCustomReversed) {
    return updateCustomColorRangeByColorUI(currentRange, colorRangeConfig);
  }

  const updated = updateColorRangeByMatchingPalette(currentRange, colorRangeConfig);
  if (updated !== currentRange) {
    return updated;
  }

  // Fallback for custom chart palettes that are not in KEPLER_COLOR_PALETTES.
  const baseColors = currentRange.colors?.length
    ? currentRange.colors
    : getDefaultChartColorRange(colorRangeConfig.steps || 10).colors;
  const steps = Math.max(2, colorRangeConfig.steps || baseColors.length);
  const colors = Array.from({length: steps}, (_, i) => baseColors[i % baseColors.length]);
  if (colorRangeConfig.reversed) {
    colors.reverse();
  }
  return {
    ...currentRange,
    colors,
    ...(colorRangeConfig.reversed ? {reversed: true} : {reversed: false})
  };
}

/** Resize / rematch a chart color range to a target step count. */
function colorRangeWithSteps(currentRange: ColorRange | undefined, steps: number): ColorRange {
  const stepsClamped = Math.max(2, steps);
  const range = (currentRange || getDefaultChartColorRange(stepsClamped)) as ColorRange;
  if ((range.colors?.length || 0) === stepsClamped) {
    return range;
  }
  const colorRangeConfig = {
    type: (range.type as ColorUI['colorRangeConfig']['type']) || 'all',
    steps: stepsClamped,
    reversed: Boolean(range.reversed),
    custom: false,
    customBreaks: false,
    colorBlindSafe: false
  };
  return colorRangeFromColorUI(range, colorRangeConfig, {colorRangeConfig: {steps: stepsClamped}});
}

/**
 * After a bar chart bin-axis change, sync palette steps to the resulting bin count.
 */
function withColorRangeSyncedToBins(
  chart: ChartConfig,
  dataset: ReturnType<typeof toChartableDataset> | null,
  axisUpdate: Partial<ChartConfig>
): Partial<ChartConfig> {
  if (chart.type !== ChartType.barChart && chart.type !== ChartType.horizontalBar) {
    return axisUpdate;
  }
  const nextChart = {...chart, ...axisUpdate} as ChartConfig;
  const view = computeChart(nextChart, dataset);
  if (view.kind !== 'bars' || view.bins.length < 2) {
    return axisUpdate;
  }
  return {
    ...axisUpdate,
    chartDisplay: {
      ...chart.chartDisplay,
      colorRange: colorRangeWithSteps(chart.chartDisplay?.colorRange, view.bins.length)
    }
  };
}

/**
 * Charts should respect the same filters as the map. Kepler keeps range/time
 * filters on the GPU, so `dataset.filteredIndex` alone is not enough — apply
 * GPU filters on CPU the same way filter histograms do.
 * When `skipFieldName` is set, that GPU channel is ignored so a chart's own
 * cross-filter does not empty its bins (map still filters).
 */
function toMapFilteredChartDataset(
  dataset: Datasets[string] | undefined,
  options?: {
    dataId?: string | null;
    skipFieldName?: string | null;
    skipFieldNames?: string[] | null;
  }
) {
  if (!dataset) {
    return null;
  }
  const skipNames = (options?.skipFieldNames || []).filter(Boolean) as string[];
  if (options?.skipFieldName) {
    skipNames.push(options.skipFieldName);
  }
  const uniqueSkip = Array.from(new Set(skipNames));
  const skipFilter =
    options?.dataId && uniqueSkip.length
      ? ({
          dataId: [options.dataId],
          name: uniqueSkip
        } as Parameters<typeof runGpuFilterForPlot>[1])
      : undefined;
  const filteredIndex =
    dataset.gpuFilter?.filterValueAccessor != null
      ? runGpuFilterForPlot(dataset, skipFilter)
      : undefined;
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

function isTimeAxis(axis?: ChartAxis | null): boolean {
  if (!axis) {
    return false;
  }
  if (axis.aggregation === BinType.timeBin) {
    return true;
  }
  return Boolean(axis.field?.type && TIME_FIELD_TYPES.includes(axis.field.type));
}

function resolveTimeInterval(chart: ChartConfig): string | null {
  return chart.xAxis?.interval || chart.chartDisplay?.interval || null;
}

const ChartList = styled.div`
  width: 100%;
  padding: 4px 8px;
`;

const ChartCard = styled.div<{
  $showPinOnHover?: boolean;
}>`
  border: 1px solid ${props => props.theme.panelBorderColor};
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: ${props => props.theme.panelBackground};
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  ${props =>
    props.$showPinOnHover
      ? `
    .chart-card__pin-action {
      position: absolute;
      top: 6px;
      right: 6px;
      z-index: 2;
      margin-left: 0;
      padding: 4px;
      border-radius: 2px;
      background-color: ${props.theme.panelBackground};
      box-shadow: 0 0 0 1px ${props.theme.panelBorderColor};
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s ease;
    }
    &:hover .chart-card__pin-action,
    &:focus-within .chart-card__pin-action {
      opacity: 1;
      pointer-events: auto;
    }
  `
      : ''}
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

const ChartTitleText = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.textColor};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 6px 0;
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

/** Keep the palette panel compact inside the chart settings column. */
const ChartColorSelectorWrapper = styled.div`
  .color-selector__dropdown {
    max-height: 220px;
    overflow-y: auto;
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
  /** When true, hide edit chrome and only render chart views (pinned overlay). */
  readOnly?: boolean;
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
    visStateActions,
    readOnly = false
  }) => {
    const [colorUIByChart, setColorUIByChart] = useState<Record<string, ColorUI>>({});

    const onUpdate = useCallback(
      (id: string, props: Partial<ChartConfig>) => {
        visStateActions?.updateChart(id, props);
      },
      [visStateActions]
    );

    const syncColorUISteps = useCallback((chartId: string, colorRange?: ColorRange) => {
      if (!colorRange?.colors?.length) {
        return;
      }
      setColorUIByChart(prev => {
        const current = prev[chartId] || DEFAULT_COLOR_UI;
        return {
          ...prev,
          [chartId]: {
            ...current,
            colorRangeConfig: {
              ...current.colorRangeConfig,
              steps: colorRange.colors.length,
              reversed: Boolean(colorRange.reversed)
            }
          }
        };
      });
    }, []);

    const updateBarBinAxis = useCallback(
      (
        chart: ChartConfig,
        dataset: ReturnType<typeof toChartableDataset> | null,
        axisUpdate: Partial<ChartConfig>
      ) => {
        const updates = withColorRangeSyncedToBins(chart, dataset, axisUpdate);
        onUpdate(chart.id, updates);
        const colorRange = (updates.chartDisplay as {colorRange?: ColorRange} | undefined)
          ?.colorRange;
        syncColorUISteps(chart.id, colorRange);
      },
      [onUpdate, syncColorUISteps]
    );

    const onRemove = useCallback(
      (id: string) => {
        visStateActions?.removeChart(id);
      },
      [visStateActions]
    );

    const onSelectBin = useCallback(
      (
        chart: ChartConfig,
        key: string,
        extra?: {
          filterValue?: Array<string | number>;
          filterValueY?: Array<string | number>;
          x?: string;
          y?: string;
        }
      ) => {
        if (isLayerChartConfig(chart) || !chart.dataId) {
          return;
        }
        const fields = getCrossFilterFields(chart);
        if (!fields.length) {
          return;
        }
        const filterId = chart.crossFilter?.filterId || `chart-${chart.id}-${generateHashId(4)}`;
        const alreadySelected =
          chart.crossFilter?.enabled && String(chart.crossFilter.value?.x) === key;
        if (alreadySelected) {
          // Disable and drop owned filters (heatmap uses filterId-x / filterId-y).
          visStateActions?.updateChart(chart.id, {
            crossFilter: {
              enabled: false,
              filterId,
              fieldNames: Object.fromEntries(fields.map((name, i) => [i === 0 ? 'x' : 'y', name])),
              value: {}
            }
          });
          return;
        }

        const filterValueX = extra?.filterValue?.length ? extra.filterValue : [key];
        const xField = fields[0];
        const yField = fields[1];

        if (chart.type === ChartType.heatmapChart && yField && extra?.y != null) {
          const filterValueY = extra.filterValueY?.length ? extra.filterValueY : [extra.y];
          visStateActions?.createOrUpdateFilter(
            `${filterId}-x`,
            chart.dataId,
            xField,
            filterValueX
          );
          visStateActions?.createOrUpdateFilter(
            `${filterId}-y`,
            chart.dataId,
            yField,
            filterValueY
          );
          visStateActions?.updateChart(chart.id, {
            crossFilter: {
              enabled: true,
              filterId,
              fieldNames: {x: xField, y: yField},
              value: {x: key, y: extra.y}
            }
          });
          return;
        }

        // Numeric/time bins pass [min, max]; categories pass [key]. Never pass the
        // display label alone when a numeric filterValue is available.
        visStateActions?.createOrUpdateFilter(filterId, chart.dataId, xField, filterValueX);
        visStateActions?.updateChart(chart.id, {
          crossFilter: {
            enabled: true,
            filterId,
            fieldNames: {x: xField},
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
          const crossFilterFields = getCrossFilterFields(chart);
          const dataset = chart.dataId
            ? chart.applyFilters
              ? toMapFilteredChartDataset(rawDataset, {
                  dataId: chart.dataId,
                  // Keep this chart's bins stable while its own cross-filter drives the map.
                  skipFieldNames: chart.crossFilter?.enabled ? crossFilterFields : null
                })
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
            <ChartCard key={chart.id} className="chart-card" $showPinOnHover={readOnly}>
              {readOnly ? (
                <>
                  <ChartHeaderAction
                    className="chart-card__pin-action"
                    $active
                    data-tip
                    data-for={`chart-pin_${chart.id}`}
                    aria-label="Unpin chart"
                    onClick={() => onUpdate(chart.id, {pinned: false})}
                  >
                    <Pin height="16px" filled />
                  </ChartHeaderAction>
                  <Tooltip id={`chart-pin_${chart.id}`} effect="solid" delayShow={500}>
                    <span>
                      <FormattedMessage id="tooltip.unpinChart" defaultMessage="Unpin chart" />
                    </span>
                  </Tooltip>
                </>
              ) : null}
              <ChartCardHeader>
                {readOnly ? (
                  <ChartTitleText>{chart.title}</ChartTitleText>
                ) : (
                  <ChartTitleInput
                    type="text"
                    value={chart.title}
                    onChange={event => onUpdate(chart.id, {title: event.target.value})}
                  />
                )}
                {readOnly ? null : (
                  <ChartHeaderActions>
                    <ChartHeaderAction
                      className="chart-card__pin-action"
                      $active={chart.pinned !== false}
                      data-tip
                      data-for={`chart-pin_${chart.id}`}
                      aria-label={chart.pinned !== false ? 'Unpin chart' : 'Pin chart'}
                      onClick={() =>
                        onUpdate(chart.id, {
                          pinned: chart.pinned === false
                        })
                      }
                    >
                      <Pin height="16px" filled={chart.pinned !== false} />
                    </ChartHeaderAction>
                    <Tooltip id={`chart-pin_${chart.id}`} effect="solid" delayShow={500}>
                      <span>
                        <FormattedMessage
                          id={chart.pinned !== false ? 'tooltip.unpinChart' : 'tooltip.pinChart'}
                          defaultMessage={chart.pinned !== false ? 'Unpin chart' : 'Pin chart'}
                        />
                      </span>
                    </Tooltip>
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
                )}
              </ChartCardHeader>
              <ChartRenderer
                data={view}
                selectedKey={selectedKey}
                onSelect={(key, extra) => onSelectBin(chart, key, extra)}
                showCaption={
                  chart.type === ChartType.bigNumber
                    ? // While editing, always show the caption; hide only applies in pinned mode.
                      readOnly
                      ? chart.chartDisplay?.showCaption !== false
                      : true
                    : undefined
                }
                onToggleCaption={
                  !readOnly && chart.type === ChartType.bigNumber && !isLayerChartConfig(chart)
                    ? () =>
                        onUpdate(chart.id, {
                          chartDisplay: {
                            ...chart.chartDisplay,
                            showCaption: chart.chartDisplay?.showCaption === false
                          }
                        })
                    : undefined
                }
                captionToggleIcon={
                  !readOnly && chart.type === ChartType.bigNumber ? (
                    chart.chartDisplay?.showCaption === false ? (
                      <EyeUnseen height="12px" />
                    ) : (
                      <EyeSeen height="12px" />
                    )
                  ) : undefined
                }
                captionToggleLabel={
                  !readOnly && chart.type === ChartType.bigNumber
                    ? chart.chartDisplay?.showCaption === false
                      ? 'Show caption when pinned'
                      : 'Hide caption when pinned'
                    : undefined
                }
              />
              {!readOnly && chart.display?.isConfigActive ? (
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
                    <ChartConfigGroup label="chartPanel.xAxis" defaultMessage="X axis">
                      <ConfigUncollapsibleContent>
                        <ChartConfigSection>
                          <CompactFieldSelector>
                            <FieldSelector
                              fields={fields as any}
                              value={chart.xAxis?.field?.name}
                              erasable
                              onSelect={item => {
                                const field = (item as any) || null;
                                const xAxis = axisFromField(
                                  field,
                                  chart.type === ChartType.horizontalBar
                                    ? chart.xAxis?.aggregation || 'count'
                                    : binAggregationForField(field)
                                );
                                // Keep period when switching between time fields.
                                if (field && TIME_FIELD_TYPES.includes(field.type)) {
                                  xAxis.interval = resolveTimeInterval(chart);
                                }
                                // Vertical bar: X is the bin axis — sync palette steps to bins.
                                if (chart.type === ChartType.barChart) {
                                  updateBarBinAxis(chart, dataset, {xAxis});
                                  return;
                                }
                                onUpdate(chart.id, {xAxis});
                              }}
                            />
                          </CompactFieldSelector>
                        </ChartConfigSection>
                      </ConfigUncollapsibleContent>
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
                      {(chart.type === ChartType.lineChart ||
                        (isLayerChartConfig(chart) &&
                          chart.layerChartType === LayerChartType.TIME_SERIES)) &&
                      isTimeAxis(chart.xAxis) ? (
                        <ChartConfigSectionWrapper>
                          <PanelLabel>
                            <FormattedMessage id="chartPanel.period" defaultMessage="Period" />
                          </PanelLabel>
                          <ItemSelector
                            selectedItems={
                              TIME_INTERVAL_OPTIONS.find(
                                option => option.id === (resolveTimeInterval(chart) || 'auto')
                              ) || TIME_INTERVAL_OPTIONS[0]
                            }
                            options={TIME_INTERVAL_OPTIONS}
                            displayOption={(d: {label: string}) => d.label}
                            getOptionValue={(d: {id: string}) => d.id}
                            multiSelect={false}
                            searchable={false}
                            size="small"
                            onChange={period => {
                              const interval = !period || period === 'auto' ? null : String(period);
                              onUpdate(chart.id, {
                                xAxis: {
                                  ...(chart.xAxis as ChartAxis),
                                  interval
                                },
                                chartDisplay: {
                                  ...chart.chartDisplay,
                                  // Keep in sync so compute / layer time series both see it.
                                  interval: interval || undefined
                                }
                              });
                            }}
                          />
                        </ChartConfigSectionWrapper>
                      ) : null}
                    </ChartConfigGroup>
                  ) : null}

                  {chart.type === ChartType.barChart ||
                  chart.type === ChartType.horizontalBar ||
                  chart.type === ChartType.lineChart ||
                  (isLayerChartConfig(chart) &&
                    chart.layerChartType === LayerChartType.TIME_SERIES) ? (
                    <ChartConfigGroup label="chartPanel.yAxis" defaultMessage="Y axis">
                      <ConfigUncollapsibleContent>
                        <ChartConfigSection>
                          <CompactFieldSelector>
                            <FieldSelector
                              fields={fields as any}
                              value={chart.yAxis?.field?.name}
                              erasable
                              onSelect={item => {
                                const yAxis = axisFromField(
                                  (item as any) || null,
                                  chart.type === ChartType.horizontalBar
                                    ? binAggregationForField((item as any) || null)
                                    : chart.yAxis?.aggregation || 'count'
                                );
                                // Horizontal bar: Y is the bin axis — sync palette steps to bins.
                                if (chart.type === ChartType.horizontalBar) {
                                  updateBarBinAxis(chart, dataset, {yAxis});
                                  return;
                                }
                                onUpdate(chart.id, {yAxis});
                              }}
                            />
                          </CompactFieldSelector>
                        </ChartConfigSection>
                      </ConfigUncollapsibleContent>
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
                    </ChartConfigGroup>
                  ) : null}

                  {chart.type === ChartType.heatmapChart || chart.type === ChartType.pivotTable ? (
                    <>
                      <ChartConfigGroup label="chartPanel.yAxis" defaultMessage="Y axis">
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
                      <ChartConfigGroup label="chartPanel.value" defaultMessage="Value">
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
                        </ConfigUncollapsibleContent>
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
                      <ChartConfigSection>
                        <ChartColorSelectorWrapper>
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
                              const current = colorUIByChart[chart.id] || DEFAULT_COLOR_UI;
                              const merged = {
                                ...current,
                                ...next,
                                colorRangeConfig: {
                                  ...current.colorRangeConfig,
                                  ...(next.colorRangeConfig || {})
                                }
                              } as ColorUI;
                              setColorUIByChart(prev => ({
                                ...prev,
                                [chart.id]: merged
                              }));

                              // Steps / reversed / type changes should refresh bar colors
                              // immediately (same as layer color UI), not only after picking
                              // another palette.
                              if (shouldUpdateChartColorRange(next, current)) {
                                const currentRange = (chart.chartDisplay?.colorRange ||
                                  getDefaultChartColorRange(chart.numGroups || 10)) as ColorRange;
                                const colorRange = colorRangeFromColorUI(
                                  currentRange,
                                  merged.colorRangeConfig,
                                  next
                                );
                                onUpdate(chart.id, {
                                  chartDisplay: {
                                    ...chart.chartDisplay,
                                    colorRange
                                  }
                                });
                              }
                            }}
                          />
                        </ChartColorSelectorWrapper>
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
                    </ChartConfigGroup>
                  ) : null}

                  {chart.type === ChartType.heatmapChart ? (
                    <ChartConfigGroup label="chartPanel.color" defaultMessage="Color">
                      <ChartConfigSection>
                        <ChartColorSelectorWrapper>
                          <ColorSelector
                            colorSets={[
                              {
                                selectedColor: (chart.chartDisplay?.colorRange ||
                                  defaultHeatmapColorRange()) as ColorRange,
                                isRange: true,
                                setColor: colorRange => {
                                  const nextRange = colorRange as ColorRange;
                                  onUpdate(chart.id, {
                                    chartDisplay: {
                                      ...chart.chartDisplay,
                                      colorRange: nextRange
                                    }
                                  });
                                  syncColorUISteps(chart.id, nextRange);
                                }
                              } as ColorSet
                            ]}
                            colorUI={
                              colorUIByChart[chart.id] || {
                                ...DEFAULT_COLOR_UI,
                                colorRangeConfig: {
                                  ...DEFAULT_COLOR_UI.colorRangeConfig,
                                  type: 'sequential',
                                  steps: HEATMAP_COLOR_STEPS
                                }
                              }
                            }
                            setColorUI={(next: NestedPartial<ColorUI>) => {
                              const current =
                                colorUIByChart[chart.id] ||
                                ({
                                  ...DEFAULT_COLOR_UI,
                                  colorRangeConfig: {
                                    ...DEFAULT_COLOR_UI.colorRangeConfig,
                                    type: 'sequential',
                                    steps: HEATMAP_COLOR_STEPS
                                  }
                                } as ColorUI);
                              const merged = {
                                ...current,
                                ...next,
                                colorRangeConfig: {
                                  ...current.colorRangeConfig,
                                  ...(next.colorRangeConfig || {})
                                }
                              } as ColorUI;
                              setColorUIByChart(prev => ({
                                ...prev,
                                [chart.id]: merged
                              }));

                              if (shouldUpdateChartColorRange(next, current)) {
                                const currentRange = (chart.chartDisplay?.colorRange ||
                                  defaultHeatmapColorRange()) as ColorRange;
                                const colorRange = colorRangeFromColorUI(
                                  currentRange,
                                  merged.colorRangeConfig,
                                  next
                                );
                                onUpdate(chart.id, {
                                  chartDisplay: {
                                    ...chart.chartDisplay,
                                    colorRange
                                  }
                                });
                              }
                            }}
                          />
                        </ChartColorSelectorWrapper>
                      </ChartConfigSection>
                    </ChartConfigGroup>
                  ) : null}

                  {!isLayerChartConfig(chart) ? (
                    chart.type === ChartType.bigNumber ? (
                      <ChartConfigGroup label="chartPanel.options" defaultMessage="Options">
                        <ChartConfigSectionWrapper>
                          <PanelLabel>
                            <FormattedMessage id="chartPanel.pinned" defaultMessage="Pinned" />
                          </PanelLabel>
                          <Switch
                            id={`${chart.id}-pinned`}
                            checked={chart.pinned !== false}
                            onChange={() => onUpdate(chart.id, {pinned: chart.pinned === false})}
                          />
                        </ChartConfigSectionWrapper>
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
                        <ChartConfigSectionWrapper>
                          <PanelLabel>
                            <FormattedMessage id="chartPanel.pinned" defaultMessage="Pinned" />
                          </PanelLabel>
                          <Switch
                            id={`${chart.id}-pinned`}
                            checked={chart.pinned !== false}
                            onChange={() => onUpdate(chart.id, {pinned: chart.pinned === false})}
                          />
                        </ChartConfigSectionWrapper>
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
                                const fieldNames = getCrossFilterFields(chart);
                                const filterId =
                                  chart.crossFilter?.filterId ||
                                  `chart-${chart.id}-${generateHashId(4)}`;
                                onUpdate(chart.id, {
                                  crossFilter: {
                                    enabled: !chart.crossFilter?.enabled,
                                    filterId,
                                    fieldNames: Object.fromEntries(
                                      fieldNames.map((name, i) => [i === 0 ? 'x' : 'y', name])
                                    ),
                                    value: {}
                                  }
                                });
                              }}
                            />
                          </ChartConfigSectionWrapper>
                        ) : null}
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
