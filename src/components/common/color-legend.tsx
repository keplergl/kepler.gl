// Copyright (c) 2022 Uber Technologies, Inc.
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
import styled from 'styled-components';
import {createSelector} from 'reselect';
import {format} from 'd3-format';
import moment from 'moment';
import {SCALE_TYPES, SCALE_FUNC, ALL_FIELD_TYPES} from '@kepler.gl/constants';
import {getTimeWidgetHintFormatter} from '../../utils';

const ROW_H = 10;
const GAP = 4;
const RECT_W = 20;

const StyledLegend = styled.div`
  ${props => props.theme.sidePanelScrollBar};

  max-height: 150px;
  overflow-y: auto;

  svg {
    text {
      font-size: 9px;
      fill: ${props => props.theme.textColor};
    }
  }
`;

const defaultFormat = d => d;

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

const getOrdinalLegends = scale => {
  const domain = scale.domain();
  return {
    data: domain.map(scale),
    labels: domain
  };
};

const getQuantLegends = (scale, labelFormat) => {
  if (typeof scale.invertExtent !== 'function') {
    // only quantile, quantize, threshold scale has invertExtent method
    return {
      data: [],
      labels: []
    };
  }

  const labels = scale.range().map(d => {
    const invert = scale.invertExtent(d);
    return `${labelFormat(invert[0])} to ${labelFormat(invert[1])}`;
  });

  return {
    data: scale.range(),
    labels
  };
};

type RangeType = {
  colorMap?: [string, string][];
  colorLegends?: {[key: string]: string};
  colors: string[];
};

interface ColorLegendProps {
  width: number;
  scaleType?: string;
  domain?: any[] | object;
  fieldType?: string | null;
  range?: RangeType;
  labelFormat?: Function;
  displayLabel?: boolean;
}

export default class ColorLegend extends Component<ColorLegendProps> {
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
      const empty = {
        data: [],
        labels: []
      };
      if (!range) {
        return empty;
      }
      if (range.colorLegends) {
        return {
          data: Object.keys(range.colorLegends),
          labels: Object.values(range.colorLegends)
        };
      } else if (Array.isArray(range.colorMap)) {
        return {
          data: range.colorMap.map(cm => cm[1]),
          labels: range.colorMap.map(cm => cm[0])
        };
      } else if (Array.isArray(range.colors)) {
        if (!domain || !scaleType) {
          return empty;
        }

        const scaleFunction = SCALE_FUNC[scaleType];
        // color scale can only be quantize, quantile or ordinal
        // @ts-ignore fix d3 scale
        const scale = scaleFunction()
          .domain(domain)
          .range(range.colors);

        if (scaleType === SCALE_TYPES.ordinal) {
          return getOrdinalLegends(scale);
        }

        const formatLabel = labelFormat || getQuantLabelFormat(scale.domain(), fieldType);

        return getQuantLegends(scale, formatLabel);
      }
      return empty;
    }
  );

  render() {
    const {width, displayLabel = true} = this.props;

    const legends = this.legendsSelector(this.props);
    const height = legends.data.length * (ROW_H + GAP);

    return (
      <StyledLegend>
        <svg width={width} height={height}>
          {legends.data.map((color, idx) => (
            <LegendRow
              key={idx}
              label={legends.labels[idx]}
              displayLabel={displayLabel}
              color={color}
              idx={idx}
            />
          ))}
        </svg>
      </StyledLegend>
    );
  }
}

export const LegendRow = ({label = '', displayLabel, color, idx}) => (
  <g transform={`translate(0, ${idx * (ROW_H + GAP)})`}>
    <rect width={RECT_W} height={ROW_H} style={{fill: color}} />
    <text x={RECT_W + 8} y={ROW_H - 1}>
      {displayLabel ? label.toString() : ''}
    </text>
  </g>
);
