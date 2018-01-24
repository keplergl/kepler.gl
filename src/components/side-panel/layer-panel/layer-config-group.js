import React, {Component} from 'react';
import styled from 'styled-components';

import {
  StyledLayerConfigGroupHeader,
  StyledLayerConfigGroup
} from 'components/common/styled-components';
const ConfigGroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

class LayerConfigGroup extends Component {
  render() {
    return (
      <StyledLayerConfigGroup>
        <ConfigGroupHeader>
          <StyledLayerConfigGroupHeader>{group}</StyledLayerConfigGroupHeader>
          {this.props.switchComponent ? <VisConfigSwitch
            {...LAYER_VIS_CONFIGS[property]}
            layer={layer}
            onChange={onChange}
          /> : null}
        </ConfigGroupHeader>
        {children}
      </StyledLayerConfigGroup>
    );
  }
}
export const LayerConfigGroup = ({group, children, switchComponent}) => (
  <StyledLayerConfigGroup>
    <ConfigGroupHeader>
      <StyledLayerConfigGroupHeader>{group}</StyledLayerConfigGroupHeader>
      {property ? <VisConfigSwitch
        {...LAYER_VIS_CONFIGS[property]}
        layer={layer}
        onChange={onChange}
      /> : null}
    </ConfigGroupHeader>
    {children}
  </StyledLayerConfigGroup>
);
