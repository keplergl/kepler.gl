import React, {PureComponent} from 'react';
import ActionPanel, {ActionPanelItem} from 'components/common/action-panel';
import styled from 'styled-components';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import {
  Trash,
  Layers
} from 'components/common/icons';

const LAYOVER_OFFSET = 4;

const StyledActionsLayer = styled.div`
  position: absolute;
  top: ${props => props.position.y + LAYOVER_OFFSET}px;
  left: ${props => props.position.x + LAYOVER_OFFSET}px;
`;

class FeatureActionPanel extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    datasets: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired,
    layers: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
    onDeleteFeature: PropTypes.func.isRequired,
    onToggleLayer: PropTypes.func.isRequired
  };

  handleClickOutside = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClose();
  };

  render() {
    const {
      className,
      datasets,
      position,
      layers,
      onToggleLayer,
      onDeleteFeature
    } = this.props;

    return (
      <StyledActionsLayer className={className} position={position}>
        <ActionPanel>
          <ActionPanelItem label="layer" Icon={Layers}>
            {layers.map((layer, index) => (
              <ActionPanelItem
                key={index}
                label={layer.config.label}
                color={datasets[layer.config.dataId].color}
                isSelection
                onClick={() => onToggleLayer(layer)}
              />
            ))}
          </ActionPanelItem>
          <ActionPanelItem
            label="delete"
            Icon={Trash}
            onClick={onDeleteFeature}
          />
        </ActionPanel>
      </StyledActionsLayer>
    )
  }
}

export default onClickOutside(FeatureActionPanel);
