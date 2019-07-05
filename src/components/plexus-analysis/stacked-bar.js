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
import {XYPlot, YAxis, HorizontalBarSeries, Hint} from 'react-vis';


const StackedBarChartPanel = styled.div`
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

export class StackedBarChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data, activeIndicator, title, legends, values} = this.props;

    let pData;
      let sbBars = [];

    if(legends) {
      pData = legends.data.map((d, idx) => ({
        angle: 0,
        color: d
      }));

      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < legends.data.length; j++) {
          if (
            data[i][activeIndicator] >= legends.labels[j].low &&
            data[i][activeIndicator] <= legends.labels[j].high
          ) {
            pData[j].angle = pData[j].angle + 1;
            break;
          }
        }
      }

      pData.forEach(d => {
        let obj = {
          y: 0,
          x: d.angle
        };
        sbBars.push(
          <HorizontalBarSeries data={[obj]} color={d.color}>
            <Hint data={obj} />
          </HorizontalBarSeries>
        );
      });
    } else if(values && this.props.xLabel) {
      values.forEach(d => {
        let obj = {
          y: 0,
          x: d[this.props.xLabel]
        };
        sbBars.push(
          <HorizontalBarSeries data={[obj]} color={d.color}>
            <Hint data={obj} />
          </HorizontalBarSeries>
        );
      });
    } else if(values) {
      values.forEach(d => {
        let obj = {
          y: 0,
          x: d
        };
        sbBars.push(
          <HorizontalBarSeries data={[obj]} color={d.color}>
            <Hint data={obj} />
          </HorizontalBarSeries>
        );
      });
    }
    
    return (
      <StackedBarChartPanel>
        <ControlPanel>
          <div className="control-panel-item">
            <p className="control-panel__title">{title}</p>
          </div>
        </ControlPanel>
        <XYPlot
          width={280}
          margin={{left: 0, right: 0, top: 25, bottom: 15}}
          height={80}
          stackBy="x"
        >
          { sbBars }
        </XYPlot>

      </StackedBarChartPanel>
    );
  }
}

const StackedBarChartFactory = () => StackedBarChart;
export default StackedBarChartFactory;
