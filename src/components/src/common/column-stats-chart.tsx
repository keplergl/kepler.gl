// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {format as d3Format} from 'd3-format';
import {scaleLinear} from 'd3-scale';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';

import {KeplerTable} from '@kepler.gl/table';
import {Bin, Field} from '@kepler.gl/types';
import {
  ColorBreak,
  ColorBreakOrdinal,
  isNumber,
  isNumericColorBreaks,
  useDimensions
} from '@kepler.gl/utils';

import ColorPalette from '../side-panel/layer-panel/color-palette';
import HistogramPlotFactory, {HISTOGRAM_MASK_MODE} from './histogram-plot';
import LoadingSpinner from './loading-spinner';

export const HISTOGRAM_WIDTH = 210;
export const HISTOGRAM_HEIGHT = 80;
const HISTOGRAM_MARGIN = {top: 10, bottom: 8, left: 10, right: 20};
const COLOR_CHART_TICK_WRAPPER_HEIGHT = 10;
const COLOR_CHART_TICK_HEIGHT = 8;
const COLOR_CHART_TICK_WIDTH = 4;
const COLOR_CHART_TICK_BORDER_COLOR = '#999999';

const StyledContainer = styled.div.attrs({
  className: 'color-chart-loading'
})`
  height: ${HISTOGRAM_HEIGHT}px;
`;

// height 142 = 18 + 110 + 10
const ColorChartContainer = styled.div.attrs({
  className: 'color-chart-container'
})`
  margin-top: 8px;
`;

const ColorChartHeaderWrapper = styled.div.attrs({
  className: 'color-chart-header'
})`
  display: flex;
  justify-content: space-around;
  color: ${props => props.theme.textColor};
  margin-left: ${HISTOGRAM_MARGIN.left}px;
  margin-right: ${HISTOGRAM_MARGIN.right}px;
  font-size: 9px;
`;

const ColorChartHeaderItem = styled.div`
  width: 33%;
  overflow: hidden;
  white-space: nowrap;
`;

const ColorChartWrapper = styled.div.attrs({
  className: 'color-chart-wrapper'
})`
  position: relative;
  height: ${HISTOGRAM_HEIGHT + 30}px;
`;

const ColorPaletteWrapper = styled.div.attrs({
  className: 'color-chart-palette'
})`
  position: absolute;
  margin-top: ${HISTOGRAM_MARGIN.top}px;
  margin-left: ${HISTOGRAM_MARGIN.left}px;
  margin-right: ${HISTOGRAM_MARGIN.right}px;
`;

const HistogramWrapper = styled.div.attrs({
  className: 'color-chart-histogram'
})`
  position: absolute;
`;

const ColorChartTickContainer = styled.div.attrs({
  className: 'color-chart-tick-container'
})`
  height: ${COLOR_CHART_TICK_WRAPPER_HEIGHT}px;
  position: relative;
  margin-left: ${HISTOGRAM_MARGIN.left}px;
  margin-right: ${HISTOGRAM_MARGIN.right}px;
`;

export const ColorChartHeader = ({minVal, meanVal, maxVal}) => {
  return (
    <ColorChartHeaderWrapper>
      <ColorChartHeaderItem title={minVal}>MIN: {minVal}</ColorChartHeaderItem>
      <ColorChartHeaderItem title={meanVal}>MEAN: {d3Format('.4~r')(meanVal)}</ColorChartHeaderItem>
      <ColorChartHeaderItem title={maxVal} style={{textAlign: 'right'}}>
        MAX: {maxVal}
      </ColorChartHeaderItem>
    </ColorChartHeaderWrapper>
  );
};

export type ColorChartTickProps = {
  colors: string[];
  positions: number[];
  onTickMoving: (positions: number[], dragTick: number) => void;
  onTickChanged: () => void;
  histogramWidth: number;
};

export const ColorChartTick: React.FC<ColorChartTickProps> = ({
  colors,
  positions,
  histogramWidth,
  onTickMoving,
  onTickChanged
}) => {
  const [statePositions, setPositions] = useState(positions);
  const [dragTick, setDragTick] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPositions(positions);
    setDragTick(dragTick);
  }, [positions, dragTick]);

  const onMouseMove = useCallback(
    e => {
      if (dragTick >= 0) {
        // @ts-ignore
        const offsetX = containerRef.current.getBoundingClientRect().x;
        statePositions[dragTick] = e.clientX - (offsetX ?? 0);
        const leftBound = dragTick === 0 ? 0 : statePositions[dragTick - 1] + 1;
        const rightBound =
          dragTick === positions.length - 1 ? histogramWidth : statePositions[dragTick + 1] - 1;

        // restrict user drag-n-move between left and right neighboring ticks
        if (statePositions[dragTick] < leftBound) {
          statePositions[dragTick] = leftBound;
        }
        if (statePositions[dragTick] > rightBound) {
          statePositions[dragTick] = rightBound;
        }
        setPositions([...statePositions]);
        onTickMoving(statePositions, dragTick);
      }
    },
    [dragTick, onTickMoving, positions.length, statePositions, histogramWidth]
  );

  const onMouseUp = useCallback(
    e => {
      if (dragTick >= 0) {
        onTickChanged();
        setDragTick(-1);
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [dragTick, onTickChanged]
  );

  const onMouseDown = useCallback((e, tickIndex) => {
    if (isNumber(tickIndex)) {
      setDragTick(tickIndex);
      e.stopPropagation();
      e.preventDefault();
    }
  }, []);

  return (
    <ColorChartTickContainer
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {colors.map((color, index) => (
        <div
          draggable={true}
          key={`color-chart-tick-${color}-${index}`}
          onMouseDown={e => onMouseDown(e, index)}
          style={{
            backgroundColor: color,
            left: `${statePositions[index] - COLOR_CHART_TICK_WIDTH / 2 - 1}px`,
            borderWidth: `1px`,
            borderStyle: 'solid',
            borderColor: COLOR_CHART_TICK_BORDER_COLOR,
            position: 'absolute',
            width: `${COLOR_CHART_TICK_WIDTH}px`,
            height: `${COLOR_CHART_TICK_HEIGHT}px`,
            cursor: 'pointer'
          }}
        />
      ))}
    </ColorChartTickContainer>
  );
};

// only for numetic field
ColumnStatsChartFactory.deps = [HistogramPlotFactory];

export type ColumnStatsChartWLoadingProps = {
  colorField: Field;
  dataset: KeplerTable;
  colorBreaks: ColorBreak[] | ColorBreakOrdinal[] | null;
  allBins: Bin[];
  filteredBins: Bin[];
  isFiltered: boolean;
  histogramDomain: number[];
  onChangedUpdater: (ticks: ColorBreak[]) => void;
};

export type ColumnStatsChartProps = {
  allBins: Bin[];
  filteredBins: Bin[];
  isFiltered: boolean;
  histogramDomain: number[];
  colorBreaks: ColorBreak[];
  onChangedUpdater: (ticks: ColorBreak[]) => void;
};
function ColumnStatsChartFactory(
  HistogramPlot: ReturnType<typeof HistogramPlotFactory>
): React.FC<ColumnStatsChartWLoadingProps> {
  const ColumnStatsChart: React.FC<ColumnStatsChartProps> = ({
    allBins,
    filteredBins,
    isFiltered,
    histogramDomain,
    colorBreaks,
    onChangedUpdater
  }) => {
    const [ticks, setTicks] = useState(colorBreaks);
    const [ref, size] = useDimensions<HTMLDivElement>();
    const histogramWidth = size
      ? size.width - HISTOGRAM_MARGIN.left - HISTOGRAM_MARGIN.right
      : HISTOGRAM_WIDTH;

    // distinguish between props.colorBreaks and states.ticks
    const isTickChangingRef = React.useRef(false);

    useEffect(() => {
      setTicks(ticks);
      // reset isTickChanging once histogram domain is recomputed
      isTickChangingRef.current = false;
    }, [ticks]);

    // histograms used by histogram-plot.js
    const histogramsByGroup = useMemo(
      () => ({
        bins: allBins,
        filteredBins
      }),
      [allBins, filteredBins]
    );

    // get colors from colorBreaks
    const domainColors = useMemo(
      () => (colorBreaks ? colorBreaks.map(c => c.data) : []),
      [colorBreaks]
    );

    const tickPositions = useMemo(() => {
      if (!isTickChangingRef.current) {
        setTicks(colorBreaks);
      }

      const [valueMin, valueMax] = histogramDomain;
      const widthScale = scaleLinear().domain([valueMin, valueMax]).range([0, histogramWidth]);
      return ticks.slice(0, -1).map(cb => {
        const pos = widthScale(cb.range[1]);
        if (pos < 0) return 0;
        else if (pos > histogramWidth) return histogramWidth;
        return pos;
      });
    }, [histogramDomain, ticks, colorBreaks, histogramWidth]);

    const domainColorWidths = useMemo(() => {
      const n = tickPositions.length;
      const widths = [tickPositions[0]];
      for (let i = 1; i < n; ++i) {
        widths.push(tickPositions[i] - tickPositions[i - 1]);
      }
      widths.push(histogramWidth - tickPositions[n - 1]);
      return widths;
    }, [tickPositions, histogramWidth]);

    // handle tick drag-n-move
    const onTickMovingHandler = useCallback(
      (newTickPositions, tickIndex) => {
        const [valueMin, valueMax] = histogramDomain;
        const valueRange = valueMax - valueMin;
        const breaks = [valueMin];
        newTickPositions.forEach(element => {
          breaks.push(valueMin + (valueRange * element) / histogramWidth);
        });
        breaks.push(valueMax);

        for (let i = 0; i < ticks.length; ++i) {
          const leftValue = i === tickIndex + 1 ? breaks[i] : ticks[i].range[0];
          const rightValue = i + 1 === tickIndex + 1 ? breaks[i + 1] : ticks[i].range[1];

          ticks[i] = {
            ...ticks[i],
            range: [leftValue, rightValue],
            inputs: [leftValue, rightValue],
            label: `${d3Format('.2f')(breaks[i])} to ${d3Format('.2f')(breaks[i + 1])}`
          };
        }
        isTickChangingRef.current = true;
        setTicks([...ticks]);
      },
      [histogramDomain, ticks, histogramWidth]
    );

    // update parent and sibling components when tick dragging ended
    const onTickChangedHandler = useCallback(() => {
      onChangedUpdater(ticks);
    }, [onChangedUpdater, ticks]);

    return (
      <ColorChartContainer ref={ref}>
        <ColorChartHeader
          minVal={histogramDomain[0]}
          maxVal={histogramDomain[1]}
          meanVal={histogramDomain[2]}
        />
        <ColorChartWrapper>
          <ColorPaletteWrapper>
            <ColorPalette
              colors={domainColors}
              colorWidths={domainColorWidths}
              height={HISTOGRAM_HEIGHT + 16}
            />
          </ColorPaletteWrapper>
          <HistogramWrapper>
            <HistogramPlot
              histogramsByGroup={histogramsByGroup}
              colorsByGroup={null}
              isMasked={isFiltered ? HISTOGRAM_MASK_MODE.MaskWithOverlay : HISTOGRAM_MASK_MODE.Mask}
              value={histogramDomain}
              width={histogramWidth}
              height={HISTOGRAM_HEIGHT}
              margin={HISTOGRAM_MARGIN}
              breakLines={tickPositions}
            />
          </HistogramWrapper>
        </ColorChartWrapper>
        <ColorChartTick
          colors={domainColors.slice(0, -1)}
          positions={tickPositions}
          histogramWidth={histogramWidth}
          onTickMoving={onTickMovingHandler}
          onTickChanged={onTickChangedHandler}
        />
      </ColorChartContainer>
    );
  };

  const ColumnStatsChartWLoading: React.FC<ColumnStatsChartWLoadingProps> = ({
    colorField,
    dataset,
    colorBreaks,
    allBins,
    filteredBins,
    isFiltered,
    histogramDomain,
    onChangedUpdater
  }) => {
    const fieldName = colorField?.name;
    const field = useMemo(
      () => (fieldName ? dataset.getColumnField(fieldName) : null),
      [dataset, fieldName]
    );

    if (!isNumericColorBreaks(colorBreaks)) {
      // TODO: implement display for ordinal breaks
      return null;
    }

    if (field?.isLoadingStats) {
      return (
        <StyledContainer>
          <LoadingSpinner />
        </StyledContainer>
      );
    }

    return (
      <ColumnStatsChart
        colorBreaks={colorBreaks}
        allBins={allBins}
        filteredBins={filteredBins}
        isFiltered={isFiltered}
        histogramDomain={histogramDomain}
        onChangedUpdater={onChangedUpdater}
      />
    );
  };

  return ColumnStatsChartWLoading;
}

export default ColumnStatsChartFactory;
