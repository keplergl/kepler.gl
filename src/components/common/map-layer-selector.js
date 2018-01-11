import React, {Component} from 'react';
import styled from 'styled-components';
import {Switch} from '@uber/react-switch';
import {StyledSwitch} from './styled-components';
import {generateHashId} from '../../utils/utils';

const basicSearcher = (items, query) => {
  try {
    const results = items.filter(function filterResults(item) {
      return new RegExp(query, 'i').test(item.name);
    });
    return results;
  } catch (e) {
    // TODO: keep track of this one
  }

  return items
};

const StyledListItem = styled.div`
  min-height: 25px;
  color: ${props => props.theme.selectColorLight};
  text-align: left;
  padding: 6px;
`;

const propTypes = {
  // Required
  layers: React.PropTypes.array.isRequired,
  onMapToggleLayer: React.PropTypes.func.isRequired
};

class MapLayerSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: props.query || ''
    };
  }

  render() {
    const {query} = this.state;
    const {layers} = this.props;

    const availableItems = basicSearcher(layers, query);
    const {onMapToggleLayer} = this.props;

    return (
      <div>
        {availableItems.map((layer, index) => (
          <StyledListItem
            key={index}>
            <CustomSwitch
              checked={layer.isVisible}
              id={`${layer.id}-toggle-${generateHashId(4)}`}
              label={layer.name}
              onChange={e => {e.preventDefault(); onMapToggleLayer(layer.id);}}
              size="small"
              style={{
                marginBottom: 0
              }}
            />
          </StyledListItem>
        ))}
      </div>
    );
  }
}

MapLayerSelector.displayName = 'LayerSelector';
MapLayerSelector.propTypes = propTypes;

export default MapLayerSelector;

const CustomSwitch = (props) => (
  <StyledSwitch>
    <Switch {...props}/>
  </StyledSwitch>
);
