import React from 'react';
import styled from 'styled-components';
import {rgb} from 'd3-color';
import ColorLegend from './common/color-legend';
import {DIMENSIONS} from '../constants/default-settings';

const StyledMapControlLegend = styled.div`
  padding: 10px ${props => props.theme.mapControlPadding}px;
  font-size: 11px;
  border-bottom-color: ${props => props.theme.panelBorderColor};
  border-bottom-style: solid;
  border-bottom-width: ${props => props.last ? 0 : '1px'};

  .legend--layer_name {
    font-size: 12px;
    color: ${props => props.theme.textColorHl};
    font-weight: 500;
  }
  .legend--layer_type {
    color: ${props => props.theme.subtextColor};
    font-weight: 500;
    font-size: 11px;
  }

  .legend--layer_by {
    color: ${props => props.theme.subtextColor};
  }

  .legend--layer_color_field {
    color: ${props => props.theme.textColor};
    font-weight: 500;
  }
  
  .legend--layer_color-legend {
    margin-top: 6px;
  }
`;

const VisualChannelMetric = ({name}) => (
  <div>
    <span className="legend--layer_by">by </span>
    <span className="legend--layer_color_field">{name}</span>
  </div>
);

const LayerSize = ({label, name}) => (
  <div className="legend--layer_size-schema">
    <p>
      <span className="legend--layer_by">{label}</span>
    </p>
    <VisualChannelMetric name={name}/>
  </div>
);

const propTypes = {
  layers: React.PropTypes.array
};

const MapLegend = ({layers}) => (
  <div>
    {layers.map((layer, index) => {
      const enableColorBy = layer.config.colorField ? layer.config.colorField.name :
        layer.visualChannels.color.defaultMeasure;
      return (
        <StyledMapControlLegend
          className="legend--layer"
          last={index === layers.length - 1}
          key={index}>
          <div className="legend--layer_name">{layer.config.label}</div>
          <div className="legend--layer_type">{`${layer.type.capitalizeFirstLetter()} color`}</div>
          <div className="legend--layer_color-schema">
            <div>
              {enableColorBy ? <VisualChannelMetric name={enableColorBy}/> : null}
              <div className="legend--layer_color-legend">
                <ColorLegend
                  scaleType={enableColorBy ? layer.config.colorScale : 'ordinal'}
                  displayLabel={enableColorBy}
                  domain={enableColorBy ? layer.config.colorDomain : ['']}
                  fieldType={enableColorBy ? (layer.config.colorField && layer.config.colorField.type) || 'real' : null}
                  range={enableColorBy ? layer.config.visConfig.colorRange.colors : [
                    rgb(...layer.config.color).toString()
                  ]}
                  width={DIMENSIONS.mapControlWidth - 2 * (DIMENSIONS.mapControlPadding)}
                />
              </div>
            </div>
          </div>
          {Object.keys(layer.visualChannels).filter(k => k !== 'color').map(key => {
            const matchCondition = !layer.visualChannels[key].condition || layer.visualChannels[key].condition(layer.config);
            const enabled = layer.config[layer.visualChannels[key].field] || layer.visualChannels[key].defaultMeasure;
            if (matchCondition && enabled) {
              return (
                <LayerSize
                  key={key}
                  label={layer.visConfigSettings[layer.visualChannels[key].range].label}
                  name={layer.config[layer.visualChannels[key].field] ?
                    layer.config[layer.visualChannels[key].field].name :
                    layer.visualChannels[key].defaultMeasure}
                />
              );
            }
            return null;
          })}
        </StyledMapControlLegend>
      )
    })}
  </div>
);

MapLegend.propTypes = propTypes;

export default MapLegend;
