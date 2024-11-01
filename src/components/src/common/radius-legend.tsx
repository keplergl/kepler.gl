// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, FC} from 'react';
import styled from 'styled-components';
import {scaleSqrt} from 'd3-scale';
import {SCALE_TYPES} from '@kepler.gl/constants';
import {formatNumber} from '@kepler.gl/utils';
import {max} from 'd3-array';
import {console as Console} from 'global/window';

const StyledLegend = styled.div<{width: number; height: number}>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
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

const LabelsOuter = styled.div<{width: number; height: number}>`
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

const margin = {left: 1, top: 5, right: 2, bottom: 5};

type Props = {
  width: number;
  scaleType: string;
  domain: [number, number];
  fieldType: string;
  range: [number, number];
};

const RadiusLegend: FC<Props> = ({scaleType, width, domain, range, fieldType}) => {
  const radiusScale = useMemo(() => {
    if (scaleType !== SCALE_TYPES.sqrt) {
      Console.warn(`Unsupported radius scale type: ${scaleType}`);
      return undefined;
    }
    if (!Array.isArray(domain) || !domain.every(Number.isFinite)) {
      return undefined;
    }
    return scaleSqrt().domain(domain).range(range);
  }, [domain, range, scaleType]);

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
    }, new Array<number>());
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
            {formatNumber(v, fieldType)}
          </ValueLabel>
        ))}
      </LabelsOuter>
    </StyledLegend>
  );
};

export default RadiusLegend;
