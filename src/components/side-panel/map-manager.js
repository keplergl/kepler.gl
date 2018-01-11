/** @jsx createElement */
import createElement from 'react-stylematic';

import React from 'react';
import {rgb} from 'd3-color';
import {Switch} from '@uber/react-switch';
import classnames from 'classnames';

import InfoHelper from '../common/info-helper';
import {PanelLabel, Tooltip} from '../common/styled-components';

import {ReactBaseComponent} from '../../utils/react-utils';
import {hexToRgb} from '../../utils/color-utils';

import {mapStyleSelector} from '../../styles/side-panel';
import {EnableConfig} from '../common/layer-panel-item';
import ColorSingleSelector from './layer-panel/color-single-selector';
import {VisConfigSlider} from './layer-panel/layer-configurator';

import {LAYER_VIS_CONFIGS} from '../../keplergl-layers/layer-factory';

export default class MapManager extends ReactBaseComponent {

  static propTypes = {
    mapStyle: React.PropTypes.object.isRequired,
    onConfigChange: React.PropTypes.func.isRequired,
    onStyleChange: React.PropTypes.func.isRequired,
    onBuildingChange: React.PropTypes.func.isRequired
  };

  state = {
    isSelecting: false
  };

  _updateConfig(newProp) {
    const newConfig = {...this.props.mapStyle, ...newProp};
    this.props.onConfigChange(newConfig);
  }

  _toggleSelecting() {
    this.setState({isSelecting: !this.state.isSelecting});
  }

  _selectStyle(val) {
    this.props.onStyleChange(val);
    this._toggleSelecting();
  }

  render() {
    const {mapStyle} = this.props;
    const {editableLayers} = mapStyle.mapStyles[mapStyle.styleType];

    return (
      <div className="map-style__panel">
        <div className="layer-panel active" style={mapStyleSelector}>
          <MapStyleSelector
            mapStyle={mapStyle}
            isSelecting={this.state.isSelecting}
            onChange={this._selectStyle}
            toggleActive={this._toggleSelecting}/>
          {!mapStyle.isSatellite && <LayerGroupSelector
            layers={mapStyle.visibleLayerGroups}
            editableLayers={editableLayers}
            topLayers={mapStyle.topLayerGroups}
            onChange={this._updateConfig}/>}
        </div>
        <BuildingLayer
          buildingLayer={mapStyle.buildingLayer}
          onChange={this.props.onBuildingChange}/>
      </div>
    );
  }
}

const MapStyleSelector = ({mapStyle, onChange, toggleActive, isSelecting}) => (
  <div>
    <PanelLabel>Base map style</PanelLabel>
    {Object.keys(mapStyle.mapStyles).map(op => (
      <div className={classnames('map-dropdown-option',
        {collapsed: !isSelecting && mapStyle.styleType !== op})}
        key={op}
        onClick={isSelecting ? () => onChange(op) : toggleActive}>
        <div className="map-title-block">
          <img className="map-preview" src={mapStyle.mapStyles[op].icon}/>
          <span className="map-preview-name">{mapStyle.mapStyles[op].label}</span>
        </div>
        {!isSelecting && <EnableConfig
          disableTooltip={true}
          isActive={false}
          onClick={toggleActive}/>}
      </div>
    ))}
  </div>
);

const LayerGroupSelector = ({layers, editableLayers, onChange, topLayers}) => (
  <div>
    <div className="layer-group__header">
      <PanelLabel>Map Layers</PanelLabel>
    </div>
    <div className="panel">
      <div className="panel__content">
        {Object.keys(editableLayers).filter(key => editableLayers[key]).map(slug => (
          <div className="layer-group__select" key={slug}>
            <PanelLabel>{slug}</PanelLabel>
            <div className="layer-group__switch">
              <Switch
                checked={layers[slug]}
                style={{marginBottom: 0, marginRight: '-10px'}}
                id={`${slug}-toggle`}
                label={''}
                size="small"
                onChange={() => onChange({visibleLayerGroups: {
                  ...layers,
                  [slug]: !layers[slug]
                }})}/>
              <BringToTopToggle
                slug={slug}
                disabled={!layers[slug]}
                topLayers={topLayers}
                onChange={onChange}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BringToTopToggle = ({topLayers, onChange, slug, disabled}) => (
  <span className="layer--toggle">
    <a className="hover" data-tip data-for={`${slug}-top`}
       onClick={() => onChange({topLayerGroups: {
         ...topLayers,
         [slug]: !topLayers[slug]
       }})}>
      <i className={classnames('icon icon_upload', {
        active: topLayers[slug],
        disabled
      })}/>
      <Tooltip id={`${slug}-top`} effect="solid">
        <span>Move to top of data layers</span>
      </Tooltip>
    </a>
  </span>
);

const BuildingLayer = ({buildingLayer, onChange}) => (
  <div className="layer-panel active">
    <div className="layer-panel__header no-highlight">
      <span>
        <PanelLabel>3D Buildings</PanelLabel>
        <InfoHelper id="building-info"
                    description="3D building only visible when zoom in to an area of the map"/>
      </span>
      <Switch
        checked={buildingLayer.isVisible}
        style={{marginBottom: 0, marginRight: '-10px'}}
        id={`3d-building-toggle`}
        label={''}
        size="small"
        onChange={() => onChange({isVisible: !buildingLayer.isVisible})}/>
    </div>
    {buildingLayer.isVisible ? <div className="soft-tiny layer-panel__config">
      <PanelLabel>Color</PanelLabel>
      <ColorSingleSelector
        width={268}
        setColor={hex => onChange({color: hexToRgb(hex)})}
        selectedColor={rgb(...buildingLayer.color).toString().toUpperCase()}/>
      <VisConfigSlider
        {...LAYER_VIS_CONFIGS.opacity}
        layer={{config: {visConfig: buildingLayer}}}
        onChange={onChange}
      />
    </div> : null}
  </div>
);
