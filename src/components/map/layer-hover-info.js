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

import React from 'react';
import styled from 'styled-components';
import {CenterFlexbox} from 'components/common/styled-components';
import {Layers} from 'components/common/icons';
import {FIELD_DISPLAY_FORMAT} from 'constants/default-settings';
import PropTypes from 'prop-types';

export const StyledLayerName = styled(CenterFlexbox)`
  color: ${props => props.theme.textColorHl};
  font-size: 12px;
  letter-spacing: 0.43px;
  text-transform: capitalize;
  padding-left: 14px;
  margin-top: 12px;

  svg {
    margin-right: 4px;
  }
`;

const Row = ({name, value, url}) => {
  // Set 'url' to 'value' if it looks like a url
  if (!url && value && typeof value === 'string' && value.match(/^http/)) {
    url = value;
  }

  const asImg = /<img>/.test(name);
  return (
    <tr className="row" key={name}>
      <td className="row__name">{name}</td>
      <td className="row__value">
        {asImg ? (
          <img src={value} />
        ) : url ? (
          <a target="_blank" rel="noopener noreferrer" href={url}>
            {value}
          </a>
        ) : (
          value
        )}
      </td>
    </tr>
  );
};

const EntryInfo = ({fieldsToShow, fields, data}) => (
  <tbody>
    {fieldsToShow.map(name => (
      <EntryInfoRow key={name} name={name} fields={fields} data={data} />
    ))}
  </tbody>
);

const EntryInfoRow = ({name, fields, data}) => {
  const field = fields.find(f => f.name === name);
  if (!field) {
    return null;
  }

  const valueIdx = field.tableFieldIndex - 1;
  const format = _getCellFormat(field.type);

  return (
    <Row name={name} value={format ? format(data[valueIdx]) : data[valueIdx]} />
  );
};

const CellInfo = ({data, layer}) => {
  const {colorField, sizeField} = layer.config;

  return (
    <tbody>
      <Row
        name={'total points'}
        key="count"
        value={data.points && data.points.length}
      />
      {colorField && layer.visualChannels.color ? (
        <Row
          name={layer.getVisualChannelDescription('color').measure}
          key="color"
          value={data.colorValue || 'N/A'}
        />
      ) : null}
      {sizeField && layer.visualChannels.size ? (
        <Row
          name={layer.getVisualChannelDescription('size').measure}
          key="size"
          value={data.elevationValue || 'N/A'}
        />
      ) : null}
    </tbody>
  );
};

function _getCellFormat(type) {
  return FIELD_DISPLAY_FORMAT[type];
}

const LayerHoverInfoFactory = () => {
  const LayerHoverInfo = props => {
    const {data, layer, fieldsToShow} = props;

    if (!data || !layer || !fieldsToShow.length) {
      return null;
    }

    return (
      <div>
        <StyledLayerName className="map-popover__layer-name">
          <Layers height="12px" />
          {props.layer.config.label}
        </StyledLayerName>
        <table className="map-popover__table">
          {props.layer.isAggregated ? (
            <CellInfo {...props} />
          ) : (
            <EntryInfo {...props} />
          )}
        </table>
      </div>
    );
  };

  LayerHoverInfo.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.any),
    fieldsToShow: PropTypes.arrayOf(PropTypes.any),
    layer: PropTypes.object,
    data: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.any),
      PropTypes.object
    ])
  }
  return LayerHoverInfo;
};

export default LayerHoverInfoFactory;
