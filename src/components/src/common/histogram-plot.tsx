// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ReactElement, useMemo} from 'react';
import {scaleLinear} from 'd3-scale';
import {hcl} from 'd3-color';
import {min, max} from 'd3-array';
import styled from 'styled-components';

const histogramStyle = {
  highlightW: 0.7,
  unHighlightedW: 0.4
};

const HistogramWrapper = styled.svg`
  overflow: visible;
`;

type BarType = {
  inRange: boolean;
};
const BarUnmemoized = styled.rect<BarType>(
  ({theme, inRange, color}) => `
  ${
    inRange
      ? `fill: ${color ?? theme.histogramFillInRange};`
      : `fill: ${color ? hcl(color).darker() : theme.histogramFillOutRange};`
  }
`
);
const Bar = React.memo(BarUnmemoized);
Bar.displayName = 'Bar';

interface HistogramPlotProps {
  width: number;
  height: number;
  margin: {top: number; bottom: number; left: number; right: number};
  isRanged?: boolean;
  value: number[];
  brushComponent?: ReactElement;
  histogramsByGroup: any;
  colorsByGroup: any;
  countProp: any;
  range: any;
}

function HistogramPlotFactory() {
  const HistogramPlot = ({
    width,
    height,
    histogramsByGroup,
    colorsByGroup,
    countProp = 'count',
    margin,
    isRanged,
    range,
    value,
    brushComponent
  }: HistogramPlotProps) => {
    const undefinedToZero = (x: number | undefined) => (x ? x : 0);
    const groupKeys = useMemo(
      () =>
        Object.keys(histogramsByGroup)
          // only keep non-empty groups
          .filter(key => histogramsByGroup[key]?.length > 0),
      [histogramsByGroup]
    );

    const domain = useMemo(
      () =>
        range ?? [
          min(groupKeys, key => histogramsByGroup[key][0].x0),
          max(groupKeys, key => histogramsByGroup[key][histogramsByGroup[key].length - 1].x1)
        ],
      [range, histogramsByGroup, groupKeys]
    );

    const x = useMemo(() => scaleLinear().domain(domain).range([0, width]), [domain, width]);

    const y = useMemo(
      () =>
        scaleLinear()
          .domain([
            0,
            Math.max(
              Number(
                max(groupKeys, key => max(histogramsByGroup[key], (d: number[]) => d[countProp]))
              ),
              1
            )
          ])
          .range([0, height]),
      [histogramsByGroup, groupKeys, height, countProp]
    );

    const barWidth = useMemo(() => {
      if (groupKeys.length === 0) return 0;
      // find histogramsByGroup with max number of bins
      const maxGroup = groupKeys.reduce((accu, key, idx) => {
        if (histogramsByGroup[key].length > accu.length) {
          return histogramsByGroup[key];
        }
        return accu;
      }, histogramsByGroup[groupKeys[0]]);

      // find the bin for measuring step
      const stdBinIdx = maxGroup.length > 1 ? 1 : 0;
      const xStep = maxGroup[stdBinIdx].x1 - maxGroup[stdBinIdx].x0;
      const maxBins = (domain[1] - domain[0]) / xStep;
      if (!maxBins) return 0;
      return width / maxBins / groupKeys.length;
    }, [histogramsByGroup, domain, groupKeys, width]);

    if (groupKeys.length === 0) {
      return null;
    }
    return (
      <HistogramWrapper width={width} height={height} style={{marginTop: `${margin.top}px`}}>
        {groupKeys.map((key, i) => (
          <g key={key} className="histogram-bars">
            {histogramsByGroup[key].map(bar => {
              const inRange =
                undefinedToZero(bar.x1) <= value[1] && undefinedToZero(bar.x0) >= value[0];
              const wRatio = inRange ? histogramStyle.highlightW : histogramStyle.unHighlightedW;
              const startX =
                x(undefinedToZero(bar.x0)) + barWidth * i + (barWidth * (1 - wRatio)) / 2;
              if (startX > 0 && startX + barWidth * histogramStyle.unHighlightedW <= width) {
                return (
                  <Bar
                    inRange={inRange}
                    color={colorsByGroup ? colorsByGroup[key] : undefined}
                    key={bar.x0}
                    height={y(bar[countProp])}
                    width={barWidth * wRatio}
                    x={startX}
                    rx={1}
                    ry={1}
                    y={height - y(bar[countProp])}
                  />
                );
              }
              return null;
            })}
          </g>
        ))}
        <g transform={`translate(${isRanged ? 0 : barWidth / 2}, 0)`}>{brushComponent}</g>
      </HistogramWrapper>
    );
  };

  const HistogramPlotWithGroups = props => {
    const groups = useMemo(
      () => (props.histogramsByGroup ? Object.keys(props.histogramsByGroup) : null),
      [props.histogramsByGroup]
    );

    if (!groups?.length) {
      return null;
    }

    return <HistogramPlot {...props} />;
  };

  return HistogramPlotWithGroups;
}
export default HistogramPlotFactory;
