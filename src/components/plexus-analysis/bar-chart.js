import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {scaleLinear} from 'd3-scale';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeries,
  makeWidthFlexible,
  LabelSeries,
  ChartLabel
} from 'react-vis';

import './../bottom-widget.scss';

const propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  datasets: PropTypes.object,
  uiState: PropTypes.object,
  visStateActions: PropTypes.object,
  uiStateActions: PropTypes.object,
  sidePanelWidth: PropTypes.number,
  containerW: PropTypes.number
};

export class BarChart extends Component {
  render() {

    const {
      data,
      title
    } = this.props;

    const dataLabels = data.map((d, idx) => ({
      x: d.x,
      y: d.y,
      label: d.x,
      xOffset: 20,
      yOffset: 7,
      style: { fill: '#6A7485' }
    })); 

    const FlexibleXYPlot = makeWidthFlexible(XYPlot);
    const width = 400;

    return (
      <XYPlot
        xDomain={[0.0, 1.0]}
        margin={{left: 100, right: 10, top: 25, bottom: 25}}
        height={160}
        width={width}
        yType="ordinal"
      >
        <XAxis
          orientation={'top'}
          tickValues={[0, 0.5, 1.0]}
          style={{
            ticks: {stroke: '#6A7485'},
            text: {fill: '#6A7485'},
            fontWeight: 100,
            marginBottom: 50,
          }}
        />
        {/* TODO: use props */}
        <YAxis
          style={{
            ticks: {stroke: '#6A7485'},
            color: '#6A7485',
            fontWeight: 100
          }}
        />
        <HorizontalBarSeries data={data} barWidth={0.5} />
        {/* TODO: fix offscreen label close to 1.0 */}
        <LabelSeries
          data={dataLabels}
          labelAnchorX="middle"
          labelAnchorY="text-after-edge"
        />
        {/* TODO: fix off-center bug */}
        {title ? (<ChartLabel text={title} xPercent={0.5} yPercent={0.32}/>) : null }
        
      </XYPlot>
    );
  }
}

const BarChartFactory = () => BarChart;
export default BarChartFactory;
