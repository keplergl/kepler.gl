import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {createSelector} from 'reselect';
import {format} from 'd3-format';

import {
  SCALE_TYPES,
  SCALE_FUNC,
  ALL_FIELD_TYPES
} from 'constants/default-settings';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  ChartLabel,
  LineSeries,
  // HorizontalBarSeries,
  Hint
} from 'react-vis';

const ScatterPlotPanel = styled.div`
  display: flex;
  flex-direction: column;
`;

const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;

  .control-panel-item {
    margin-top: 12px 0 8px 0;
  }

  .control-panel-item:nth-child(2) {
    display: flex;
    justify-content: flex-end;
  }

  p {
    color: ${props => props.theme.labelColor};
    margin: 0;
  }

  .control-panel__title {
    font-weight: 500;
    color: ${props => props.theme.textColorHl};
  }
`;

export class ScatterPlot extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      data,
      // activeIndicator,
      title,
      xKey,
      yKey
      // legends,
      // values
    } = this.props;

    let pData = [];
    let bfLine;

    if (xKey && yKey) {
      pData = data.map(d => ({
        x: d[xKey],
        y: d[yKey],
        size: 1
      }));
    }

    let xMean = 0,
      yMean = 0,
      xSum = 0,
      ySum = 0,
      xySum = 0,
      xSq = 0,
      ySq = 0,
      a = 0,
      b = 0;
    pData.forEach(d => {
      xSum += d.x;
      xSq += d.x ^ 2;
      (xySum += d.x * d.y), (ySum += d.y);
      ySq += d.y ^ 2;
    });
    // console.error(pData);
    xMean = xSum / pData.length;
    yMean = ySum / pData.length;

    // console.error(pData);
    // console.error(xSum + ' ' + ySum + ' ' + xySum + ' ' + xSq + ' ' + ySq);
    // a = ((ySum*xSq)-(xSum*xySum))/((pData.length*xSq)-(xSum^2));
    a =
      (xySum - (xSum * ySum) / pData.length) /
      (xSq - (xSum ^ 2) / pData.length);
    // b = ((pData.length*xySum)-(xSum*ySum))/((pData.length*xSq)-(xSum^2));
    b = yMean - a * xMean;

    bfLine = [{x: (0 - b) / a, y: 0}, {x: (100 - b) / a, y: 100}];

    // console.error('bfLine ' + a + ' ' + b);
    // console.error(bfLine);

    return (
      <ScatterPlotPanel>
        <ControlPanel>
          <div className="control-panel-item">
            <p className="control-panel__title">{title}</p>
          </div>
        </ControlPanel>
        <XYPlot
          // {this.props.xDomain ? null : xDomain={[0,100]}}
          xDomain={[0, 100]}
          yDomain={[0, 100]}
          width={290}
          margin={{left: 30, right: 25, top: 10, bottom: 25}}
          height={250}
          //   stackBy="x"
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          {this.props.xLabel ? (
            <ChartLabel
              text={this.props.xLabel}
              className="alt-x-label"
              includeMargin={false}
              xPercent={0.025}
              yPercent={1.01}
            />
          ) : null}
          <LineSeries data={bfLine} />
          {this.props.yLabel ? (
            <ChartLabel
              text={this.props.yLabel}
              className="alt-y-label"
              includeMargin={false}
              xPercent={0.06}
              yPercent={0.06}
              style={{
                transform: 'rotate(-90)',
                textAnchor: 'end'
              }}
            />
          ) : null}

          <MarkSeries
            className="mark-series-example"
            strokeWidth={2}
            opacity="0.8"
            sizeRange={[1, 2]}
            data={pData}
          />
        </XYPlot>
      </ScatterPlotPanel>
    );
  }
}

const ScatterPlotFactory = () => ScatterPlot;
export default ScatterPlotFactory;
