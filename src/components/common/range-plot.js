import React from 'react';
import {scaleLinear} from 'd3-scale';
import moment from 'moment';
import {max} from 'd3-array';
import {createSelector} from 'reselect';
import {LineSeries, XYPlot, CustomSVGSeries, Hint, MarkSeries} from 'react-vis';
import styled from 'styled-components';

import {COLORS} from '../../styles/styles';
import RangeBrush from './range-brush';
import {ReactBaseComponent} from '../../utils/react-utils';
import {getTimeWidgetHintFormatter} from '../../utils/filter-utils';

const propTypes = {
  value: React.PropTypes.array.isRequired,
  histogram: React.PropTypes.array,
  lineChart: React.PropTypes.object,
  plotType: React.PropTypes.string,
  isEnlarged: React.PropTypes.bool,
  onBlur: React.PropTypes.func,
  width: React.PropTypes.number.isRequired
};

const chartMargin = {top: 18, bottom: 0, left: 0, right: 0};
const chartH = 52;
const containerH = 78;

export default class RangePlot extends ReactBaseComponent {
  domainSelector = props => props.lineChart && props.lineChart.xDomain;
  hintFormatter = createSelector(
    this.domainSelector,
    domain => getTimeWidgetHintFormatter(domain)
  );

  state = {
    hoveredDP: null
  };

  onMouseMove(hoveredDP) {
    this.setState({hoveredDP});
  }

  render() {
    const {onBrush, range, value, width, plotType, lineChart, histogram} = this.props;
    const domain = [histogram[0].x0, histogram[histogram.length - 1].x1];

    const brushComponent = (
      <RangeBrush
        domain={domain}
        onBrush={onBrush}
        range={range}
        value={value}
        width={width}
      />
    );

    return (
      <div style={{
        height: `${containerH}px`,
        position: 'relative'
      }}>
        {plotType === 'lineChart' ?
          <LineChart
            hoveredDP={this.state.hoveredDP}
            width={width}
            height={containerH}
            margin={chartMargin}
            children={brushComponent}
            onMouseMove={this.onMouseMove}
            yDomain={lineChart.yDomain}
            hintFormat={this.hintFormatter(this.props)}
            data={lineChart.series}
          /> :
          <Histogram
            width={width}
            height={chartH}
            value={value}
            margin={chartMargin}
            histogram={histogram}
            brushComponent={brushComponent}
          />
        }
      </div>
    );
  }
};

RangePlot.propTypes = propTypes;

const Histogram = ({width, height, margin, histogram, value, brushComponent}) => {
  const domain = [histogram[0].x0, histogram[histogram.length - 1].x1];

  const highlightedPadding = histogram.length / 40;
  const unHighlightedPadding = histogram.length / 20;

  const highlightedColor = COLORS['uber-blue'];
  const unHighlightedColor = COLORS['uber-black-40'];

  const barWidth = width / histogram.length;

  const x = scaleLinear()
    .domain(domain)
    .range([0, width]);

  const y = scaleLinear()
    .domain([0, max(histogram, d => d.count)])
    .range([0, height]);

  return (
    <svg width={width} height={height} style={{marginTop: `${margin.top}px`}}>
      <g className='histogram-bars'>
        {histogram.map(bar => {
          const inRange = bar.x0 >= value[0] && bar.x1 <= value[1];
          const fill = inRange ? highlightedColor : unHighlightedColor;
          const padding = inRange ? highlightedPadding : unHighlightedPadding;

          return (
            <rect
              key={bar.x0}
              fill={fill}
              height={y(bar.count)}
              width={barWidth - padding}
              x={x(bar.x0)}
              rx={1}
              ry={1}
              y={height - y(bar.count)}
            />
          );
        })}
      </g>
      {brushComponent}
    </svg>
  )
};

const LineChartWrapper = styled.div`
  .rv-xy-plot__inner path {
    fill: none;
    stroke-width: 1.5;
  }
`;

const LineChart = ({width, height, yDomain, hintFormat, hoveredDP, margin, color, data, onMouseMove, children}) => {
  const brushData = [
    {x: data[0].x, y: yDomain[1], customComponent: () => children}
  ];

  return (
    <LineChartWrapper>
      <XYPlot
        width={width}
        height={height}
        margin={{...margin, bottom: 12}}>
        <LineSeries
          strokeWidth={2}
          color={color}
          data={data}
          onNearestX={onMouseMove}
        />
        <MarkSeries
          data={hoveredDP ? [hoveredDP] : []}
          color={color}
          size={3}
        />
        <CustomSVGSeries data={brushData}/>
        {hoveredDP ? (<Hint value={hoveredDP}>
          <HintContent {...hoveredDP} format={val => moment.utc(val).format(hintFormat)}/>
        </Hint>) : null}
      </XYPlot>
    </LineChartWrapper>
  );
};

const StyledHint = styled.div`
  background-color: #D3D8E0;
  border-radius: 2px;
  color: ${props => props.theme.textColorLT};
  font-size: 9px;
  margin: 4px;
  padding: 3px 6px;
  pointer-events: none;
  user-select: none;
`;
const HintContent = ({x, y, format}) => (
  <StyledHint>
    <div className="hint--x">{format(x)}</div>
    <div className="row">{y}</div>
  </StyledHint>
);
