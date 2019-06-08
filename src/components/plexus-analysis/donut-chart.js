// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
import {RadialChart} from 'react-vis';

const getTimeLabelFormat = domain => {
  const formatter = getTimeWidgetHintFormatter(domain);
  return val => moment.utc(val).format(formatter);
};

const getNumericLabelFormat = domain => {
  const diff = domain[1] - domain[0];

  if (diff < 10) {
    return format('.2f');
  }

  return format('.1f');
};

const getQuantLabelFormat = (domain, fieldType) => {
  // quant scale can only be assigned to linear Fields: real, timestamp, integer
  return fieldType === ALL_FIELD_TYPES.timestamp
    ? getTimeLabelFormat(domain)
    : !fieldType
    ? defaultFormat
    : getNumericLabelFormat(domain);
};

const getQuantLegends = (scale, labelFormat) => {
  const labels = scale.range().map(d => {
    const invert = scale.invertExtent(d);
    return {
        low: invert[0],
        high: invert[1],
    }
    // return `${labelFormat(invert[0])} to ${labelFormat(invert[1])}`;
  });

  return {
    data: scale.range(),
    labels
  };
};

const DonutPanel = styled.div `
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

  .control-panel__title{
    font-weight: 500;
    color: ${props => props.theme.textColorHl};    
  }
`;

export class DonutChart extends Component {
  constructor(props) {
    super(props);
  }

  domainSelector = props => props.domain;
  rangeSelector = props => props.range;
  labelFormatSelector = props => props.labelFormat;
  scaleTypeSelector = props => props.scaleType;
  fieldTypeSelector = props => props.fieldType;

  legendsSelector = createSelector(
    this.domainSelector,
    this.rangeSelector,
    this.scaleTypeSelector,
    this.labelFormatSelector,
    this.fieldTypeSelector,
    (domain, range, scaleType, labelFormat, fieldType) => {
      const scaleFunction = SCALE_FUNC[scaleType];
      // color scale can only be quantize, quantile or ordinal
      const scale = scaleFunction()
        .domain(domain)
        .range(range);
      console.log(scaleType);
      // console.log('ordinal');
      if (scaleType === SCALE_TYPES.ordinal) {
        return getOrdinalLegends(scale);
      }

      const formatLabel =
        labelFormat || getQuantLabelFormat(scale.domain(), fieldType);

      // console.log('quant');
      return getQuantLegends(scale, formatLabel);
    }
  );

  render() {
    const {
      data, 
      activeIndicator,
      title
    } = this.props;

    const legends = this.legendsSelector(this.props);

    let pData;
    let aData = [0,0,0,0,0,0];
    
    console.log('donut-chart data ' + activeIndicator);
    console.log(pData);
    console.log(aData);
    console.log(data);
    console.log(activeIndicator);
    
    pData = legends.data.map((d, idx) => ({
      angle: 0,
      color: d,
    })) ;

    console.log('donut-chart data 2 ' + activeIndicator);
    console.log(pData);
    console.log(aData);

    for(var i=0; i<data.length; i++) {
        for(var j=0; j<legends.data.length; j++) {
            if(data[i][activeIndicator] >= legends.labels[j].low && data[i][activeIndicator] <= legends.labels[j].high) {
                pData[j].angle = pData[j].angle+1;
                aData[j]++;
                break;
            }
        }
    }

    console.log('donut-chart data 3 ' + activeIndicator);
    console.log(pData);
    console.log(aData);

    return (
      <DonutPanel>
        <ControlPanel>
          <div className="control-panel-item">
            <p className="control-panel__title">{title}</p>            
          </div>
        </ControlPanel>
        <RadialChart 
          animation
          data={pData} 
          innerRadius={50}
          radius={70}
          width={280} 
          height={170} 
          colorType="literal"
          />
      </DonutPanel>
    );
  }
}

const DonutChartFactory = () => DonutChart;
export default DonutChartFactory;
