// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ReactElement, useMemo} from 'react';
import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {hcl} from 'd3-color';
import styled from 'styled-components';
import {HistogramBin} from '@kepler.gl/types';

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
  histogram: HistogramBin[];
  value: number[];
  brushComponent?: ReactElement;
}

function HistogramPlotFactory() {
  const HistogramPlot = ({
    width,
    height,
    margin,
    isRanged,
    histogram,
    value,
    brushComponent
  }: HistogramPlotProps) => {
    const undefinedToZero = (x: number | undefined) => (x ? x : 0);
    const domain = useMemo(
      () =>
        [histogram[0].x0, histogram[histogram.length - 1].x1].map(item => undefinedToZero(item)),
      [histogram]
    );
    const dataId = Object.keys(histogram[0]).filter(k => k !== 'x0' && k !== 'x1')[0];

    // use 1st for now
    const getValue = useMemo(() => d => d[dataId], [dataId]);

    const x = useMemo(
      () =>
        scaleLinear()
          .domain(domain)
          .range([0, width]),
      [domain, width]
    );

    const y = useMemo(
      () =>
        scaleLinear()
          .domain([0, Number(max(histogram, getValue))])
          .range([0, height]),
      [histogram, height, getValue]
    );

    const barWidth = width / histogram.length;

    return (
      <HistogramWrapper width={width} height={height} style={{marginTop: `${margin.top}px`}}>
        <g className="histogram-bars">
          {histogram.map(bar => {
            const inRange =
              undefinedToZero(bar.x1) <= value[1] && undefinedToZero(bar.x0) >= value[0];
            const wRatio = inRange ? histogramStyle.highlightW : histogramStyle.unHighlightedW;
            const startX = x(undefinedToZero(bar.x0)) + (barWidth * (1 - wRatio)) / 2;
            if (startX > 0 && startX + barWidth * histogramStyle.unHighlightedW <= width) {
              return (
                <Bar
                  inRange={inRange}
                  key={bar.x0}
                  height={y(getValue(bar))}
                  width={barWidth * wRatio}
                  x={startX}
                  rx={1}
                  ry={1}
                  y={height - y(getValue(bar))}
                />
              );
            }
            return null;
          })}
        </g>
        <g transform={`translate(${isRanged ? 0 : barWidth / 2}, 0)`}>{brushComponent}</g>
      </HistogramWrapper>
    );
  };

  const EmpptyOrPlot = props =>
    !props.histogram || !props.histogram.length ? null : <HistogramPlot {...props} />;

  return EmpptyOrPlot;
}
export default HistogramPlotFactory;
