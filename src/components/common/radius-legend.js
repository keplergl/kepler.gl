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

import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {scaleSqrt} from 'd3-scale';
import {SCALE_TYPES} from '../../constants';
import {max} from 'd3-array';
import {format} from 'd3-format';

const StyledLegend = styled.div`
  position: relative;
  svg {
    circle {
      stroke: ${props => props.theme.borderColorLT};
      fill: none;
    }
    line {
      stroke: ${props => props.theme.borderColor};
      stroke-dasharray: 2, 1;
    }
  }
`;

const LabelsOuter = styled.div`
  text-align: right;
  position: absolute;
  left: 0;
  top: 0;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

const tickHeight = 9;

const ValueLabel = styled.div`
  position: absolute;
  font-size: ${tickHeight}px;
  height: ${tickHeight}px;
  line-height: ${tickHeight}px;
  margin-top: -${tickHeight / 2}px;
  color: ${props => props.theme.textColor};
  background-color: ${props => props.theme.mapPanelBackgroundColor};
  padding: 0 2px;
  border-radius: 2px;
`;

const formatValue = format('.2~f');

const margin = {left: 1, top: 5, right: 2, bottom: 5};

const RadiusLegend = ({scaleType, width, domain, range}) => {
  if (scaleType !== SCALE_TYPES.sqrt) {
    throw new Error(`Unsupported radius scale type: ${scaleType}`);
  }

  const radiusScale = useMemo(() => {
    if (!Array.isArray(domain) || !domain.every(Number.isFinite)) {
      return undefined;
    }
    return scaleSqrt()
      .domain(domain)
      .range(range);
  }, [domain, range]);

  const radiusTicks = useMemo(() => {
    if (radiusScale === undefined) return [];
    const numTicksToFit = Math.min(10, ((range[1] - range[0]) * 2) / tickHeight);
    const ticks = radiusScale.ticks(numTicksToFit);
    // Add min and max values
    if (ticks[0] > domain[0]) {
      ticks.unshift(domain[0]);
    }
    if (ticks[ticks.length - 1] < domain[1]) {
      ticks.push(domain[1]);
    }
    // Make sure there is no overlap
    return ticks.reduceRight((acc, v) => {
      if (acc.length === 0 || Math.abs(radiusScale(acc[0]) - radiusScale(v)) * 2 > tickHeight) {
        // @ts-ignore
        acc.unshift(v);
      }
      return acc;
    }, []);
  }, [radiusScale, domain, range]);

  if (!radiusScale || !radiusTicks.length) {
    return null;
  }
  const maxR = Math.ceil(radiusScale(max(radiusTicks) || 0));
  const w = width - margin.left - margin.right;
  const h = maxR * 2;
  const height = h + margin.top + margin.bottom;

  return (
    <StyledLegend width={width} height={height}>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g>
            {radiusTicks.map((v, i) => (
              <g key={i}>
                <g transform={`translate(${w},${h - radiusScale(v) * 2})`}>
                  <line x1={0} x2={maxR - w} />
                </g>
              </g>
            ))}
          </g>
          <g>
            {radiusTicks.map((v, i) => {
              const r = radiusScale(v);
              return (
                <g key={i}>
                  <g transform={`translate(0,${h - r * 2})`}>
                    <circle
                      cx={maxR}
                      cy={r}
                      r={Math.max(0, r - 1)} /* stroke is drawn outside, hence r-1 */
                    />
                  </g>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
      <LabelsOuter width={width} height={height}>
        {radiusTicks.map((v, i) => (
          <ValueLabel
            key={i}
            style={{
              right: margin.right,
              top: margin.top + h - radiusScale(v) * 2
            }}
          >
            {formatValue(v)}
          </ValueLabel>
        ))}
      </LabelsOuter>
    </StyledLegend>
  );
};

RadiusLegend.propTypes = {
  width: PropTypes.number.isRequired,
  scaleType: PropTypes.string,
  domain: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.object]),
  fieldType: PropTypes.string,
  range: PropTypes.arrayOf(PropTypes.number)
};

export default RadiusLegend;
