// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {DonutCategory, DonutComposition, DonutLayer} from '@kepler.gl/layers';

const StyledDonutLegend = styled.div`
  color: ${props => props.theme.textColor};
`;

function Swatch({color}: {color: number[]}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 12,
        height: 12,
        marginRight: 6,
        background: `rgb(${color.join(',')})`
      }}
    />
  );
}

export function DonutLegend({layer}: {layer: DonutLayer; width: number}) {
  return (
    <StyledDonutLegend>
      {layer.getCategories().map(category => (
        <div key={category.field}>
          <Swatch color={category.color} />
          {category.label}
        </div>
      ))}
    </StyledDonutLegend>
  );
}

export function DonutTooltip({
  composition
}: {
  composition: DonutComposition & {
    categories: DonutCategory[];
    pointCount?: number;
    ignoredValueCount?: number;
  };
}) {
  const intl = useIntl();
  return (
    <tbody>
      {composition.pointCount !== undefined ? (
        <tr>
          <td className="row__name">
            <FormattedMessage id="layerVisConfigs.donut.pointCount" />
          </td>
          <td className="row__value" colSpan={2}>
            {intl.formatNumber(composition.pointCount)}
          </td>
        </tr>
      ) : null}
      {composition.categories.map((category, index) => (
        <tr key={category.field}>
          <td className="row__name">
            <Swatch color={category.color} />
            {category.label}
          </td>
          <td className="row__value">
            {composition.values[index] === null
              ? '—'
              : intl.formatNumber(composition.values[index])}
          </td>
          <td className="row__value">
            {composition.status === 'valid'
              ? intl.formatNumber(composition.shares[index], {
                  style: 'percent',
                  maximumFractionDigits: 1
                })
              : '—'}
          </td>
        </tr>
      ))}
      <tr>
        <td className="row__name">
          <FormattedMessage id="layerVisConfigs.donut.total" />
        </td>
        <td className="row__value" colSpan={2}>
          {composition.total === null ? '—' : intl.formatNumber(composition.total)}
        </td>
      </tr>
      {composition.ignoredValueCount ? (
        <tr>
          <td colSpan={3}>
            <FormattedMessage
              id="layerVisConfigs.donut.ignoredValues"
              values={{count: composition.ignoredValueCount}}
            />
          </td>
        </tr>
      ) : null}
      {composition.status !== 'valid' ? (
        <tr>
          <td colSpan={3}>
            <FormattedMessage id={`layerVisConfigs.donut.${composition.status}`} />
          </td>
        </tr>
      ) : null}
    </tbody>
  );
}
