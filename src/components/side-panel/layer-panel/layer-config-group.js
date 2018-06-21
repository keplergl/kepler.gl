// Copyright (c) 2018 Uber Technologies, Inc.
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
import classnames from 'classnames';
import Switch from 'components/common/switch';

export const StyledLayerConfigGroupLabel = styled.div`
  border-left: 2px solid ${props => props.theme.labelColor};
  color: ${props => props.theme.textColor};
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  margin-left: -12px;
  padding-left: 10px;
  text-transform: capitalize;
  letter-spacing: 0.2px;
`;

export const StyledLayerConfigGroup = styled.div`
  padding-left: 18px;
  margin-bottom: 18px;

`;

export const StyledConfigGroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ConfigGroupContent = styled.div`
  &.disabled {
    opacity: 0.3;
    pointer-events: none;
    * {
      pointer-events: none;
    }
  }
`;

const LayerConfigGroup = ({
  group,
  label,
  children,
  property,
  layer,
  onChange
}) => (
  <StyledLayerConfigGroup className="layer-config-group">
    <StyledConfigGroupHeader className="layer-config-group__header">
      <StyledLayerConfigGroupLabel className="layer-config-group__label">
        {label}
      </StyledLayerConfigGroupLabel>
      {property ? (
        <Switch
          checked={layer.config.visConfig[property]}
          id={`${layer.id}-${property}`}
          onChange={() =>
            onChange({[property]: !layer.config.visConfig[property]})
          }
        />
      ) : null}
    </StyledConfigGroupHeader>
    <ConfigGroupContent
      className={classnames('layer-config-group__content', {
        disabled: property && !layer.config.visConfig[property]
      })}
    >
      {children}
    </ConfigGroupContent>
  </StyledLayerConfigGroup>
);

export default LayerConfigGroup;
