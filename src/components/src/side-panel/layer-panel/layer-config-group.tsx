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

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {FormattedMessage} from 'react-intl';
import Switch from '../../common/switch';
import InfoHelperFactory from '../../common/info-helper';
import {VertThreeDots} from '../../common/icons';
import {Layer} from '@kepler.gl/layers';
import {LayerVisConfig} from '@kepler.gl/types';

type LayerConfigGroupLabelProps = {
  label?: string;
  description?: string;
};

type LayerConfigGroupProps = {
  layer?: Layer;
  label: string;
  property?: string;
  description?: string;
  collapsible?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  onChange?: (newVisConfig: Partial<LayerVisConfig>) => void;
};

export const StyledLayerConfigGroupAction = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textColor};
`;

export const ConfigGroupCollapsibleContent = styled.div.attrs({
  className: 'layer-config-group__content__collapsible'
})`
  overflow: visible;
  transition: max-height 0.3s ease-out;
  height: max-content;
  max-height: 600px;
`;

export const ConfigGroupCollapsibleHeader = styled.div.attrs({
  className: 'layer-config-group__header__collapsible'
})`
  overflow: visible;
  overflow: hidden;
  max-height: 0;
`;

export const StyledLayerConfigGroup = styled.div`
  padding-left: ${props => props.theme.layerConfigGroupPaddingLeft}px;
  margin-bottom: ${props => props.theme.layerConfigGroupMarginBottom}px;

  &.disabled {
    opacity: 0.3;
    pointer-events: none;
  }
  &.collapsed {
    .layer-config-group__header__collapsible {
      overflow: visible;
      max-height: 600px;
    }
    .layer-config-group__content {
      .layer-config-group__content__collapsible {
        overflow: hidden;
        max-height: 0;
      }
    }
  }
`;

const StyledConfigGroupHeader = styled.div.attrs({
  className: 'layer-config-group__header'
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  :hover {
    cursor: pointer;
    .layer-config-group__label {
      color: ${props => props.theme.textColorHl};
    }

    .layer-config-group__action {
      color: ${props => props.theme.textColorHl};
    }
  }
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

LayerConfigGroupLabelFactory.deps = [InfoHelperFactory];

export function LayerConfigGroupLabelFactory(InfoHelper: ReturnType<typeof InfoHelperFactory>) {
  const StyledLayerConfigGroupLabel = styled.div`
    border-left: ${props => props.theme.layerConfigGroupLabelBorderLeft} solid
      ${props => props.theme.labelColor};
    line-height: 12px;
    margin-left: ${props => props.theme.layerConfigGroupLabelMargin};
    padding-left: ${props => props.theme.layerConfigGroupLabelPadding};

    display: flex;
    align-items: center;

    span {
      color: ${props => props.theme.textColor};
      font-weight: 500;
      letter-spacing: 0.2px;
      text-transform: capitalize;
      margin-left: ${props => props.theme.layerConfigGroupLabelLabelMargin};
      font-size: ${props => props.theme.layerConfigGroupLabelLabelFontSize};
    }
  `;

  const LayerConfigGroupLabel: React.FC<LayerConfigGroupLabelProps> = ({label, description}) => (
    <StyledLayerConfigGroupLabel className="layer-config-group__label">
      <span>
        <FormattedMessage id={label || 'misc.empty'} defaultMessage={label} />
      </span>
      {description && <InfoHelper description={description} id={label} />}
    </StyledLayerConfigGroupLabel>
  );

  return LayerConfigGroupLabel;
}

LayerConfigGroupFactory.deps = [LayerConfigGroupLabelFactory];

function LayerConfigGroupFactory(
  LayerConfigGroupLabel: ReturnType<typeof LayerConfigGroupLabelFactory>
) {
  const LayerConfigGroup: React.FC<LayerConfigGroupProps> = ({
    label,
    children,
    property,
    layer,
    onChange,
    collapsible,
    description,
    disabled,
    expanded
  }) => {
    const [collapsed, toggleCollapsed] = useState(!expanded);
    const onToggleCollapsed = useCallback(() => {
      toggleCollapsed(!collapsed);
    }, [collapsed, toggleCollapsed]);

    return (
      <StyledLayerConfigGroup className={classnames('layer-config-group', {collapsed, disabled})}>
        <StyledConfigGroupHeader onClick={onToggleCollapsed}>
          <LayerConfigGroupLabel label={label} description={description} />
          <StyledLayerConfigGroupAction className="layer-config-group__action">
            {property ? (
              <Switch
                checked={layer?.config.visConfig[property]}
                id={`${layer?.id}-${property}`}
                onChange={() => onChange?.({[property]: !layer?.config.visConfig[property]})}
              />
            ) : null}
            {collapsible ? <VertThreeDots height="18px" /> : null}
          </StyledLayerConfigGroupAction>
        </StyledConfigGroupHeader>
        <ConfigGroupContent
          className={classnames('layer-config-group__content', {
            disabled: property && !layer?.config.visConfig[property]
          })}
        >
          {children}
        </ConfigGroupContent>
      </StyledLayerConfigGroup>
    );
  };

  LayerConfigGroup.defaultProps = {
    collapsible: false,
    expanded: false,
    onChange: () => {},
    description: '',
    disabled: false
  };
  return LayerConfigGroup;
}

export default LayerConfigGroupFactory;
