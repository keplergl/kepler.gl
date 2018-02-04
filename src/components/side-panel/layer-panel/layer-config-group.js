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
