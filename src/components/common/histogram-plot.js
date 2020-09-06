import React, {useMemo} from 'react';
import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import styled from 'styled-components';
import classnames from 'classnames';

const histogramStyle = {
  highlightW: 0.7,
  unHighlightedW: 0.4
};

const HistogramWrapper = styled.svg`
  overflow: visible;
  .histogram-bars {
    rect {
      fill: ${props => props.theme.histogramFillOutRange};
    }
    rect.in-range {
      fill: ${props => props.theme.histogramFillInRange};
    }
  }
`;
function HistogramPlotFactory() {
  const HistogramPlot = ({width, height, margin, isRanged, histogram, value, brushComponent}) => {
    const domain = useMemo(() => [histogram[0].x0, histogram[histogram.length - 1].x1], [
      histogram
    ]);
    const barWidth = width / histogram.length;
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
          .domain([0, max(histogram, getValue)])
          .range([0, height]),
      [histogram, height, getValue]
    );

    return (
      <HistogramWrapper width={width} height={height} style={{marginTop: `${margin.top}px`}}>
        <g className="histogram-bars">
          {histogram.map(bar => {
            const inRange = bar.x1 <= value[1] + 1 && bar.x0 >= value[0];
            const wRatio = inRange ? histogramStyle.highlightW : histogramStyle.unHighlightedW;
            return (
              <rect
                className={classnames({'in-range': inRange})}
                key={bar.x0}
                height={y(getValue(bar))}
                width={barWidth * wRatio}
                x={x(bar.x0) + (barWidth * (1 - wRatio)) / 2}
                rx={1}
                ry={1}
                y={height - y(getValue(bar))}
              />
            );
          })}
        </g>
        <g transform={`translate(${isRanged ? 0 : barWidth / 2}, 0)`}>{brushComponent}</g>
      </HistogramWrapper>
    );
  };
  return HistogramPlot;
}
export default HistogramPlotFactory;
