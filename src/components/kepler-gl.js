import React, {Component} from 'react';
import {console as Console} from 'global/window'
import {bindActionCreators} from 'redux'
import request from 'd3-request';
import {connect as keplerGlConnect} from '../connect/keplergl-connect';

import {ThemeProvider} from 'styled-components';

import * as VisStateActions from 'actions/vis-state-actions';
import * as MapStateActions from 'actions/map-state-actions';
import * as MapStyleActions from 'actions/map-style-actions';
import * as BuildingDataActions from 'actions/building-data-actions';
import * as UIStateActions from 'actions/ui-state-actions';

import {DIMENSIONS, DEFAULT_MAP_STYLES} from 'constants/default-settings';

import SidePanel from './side-panel';
import MapContainer from './map-container';
import BottomWidget from './bottom-widget';
import {theme} from '../styles/base';

// webpack css-loader handles css loading
import '../stylesheets/kepler.gl.scss';

const defaultProps = {
  mapStyles: [],
  width: 800,
  height: 800
};

class KeplerGL extends Component {
  componentDidMount() {
    this._loadMapStyle(this.props.mapStyles);
    this._handleResize(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
      this._handleResize(nextProps);
    }
  }

  _handleResize({width, height}) {
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      Console.warn('width and height is required');
      return;
    }
    this.props.mapStateActions.updateMap({
      width: width / (1 + Number(this.props.mapState.isSplit)),
      height
    });
  }

  _loadMapStyle() {
    [...this.props.mapStyles, ...Object.values(DEFAULT_MAP_STYLES)]
      .forEach(style => {
        console.log(style)
      if (style.style) {
        this.props.dispatch(MapStyleActions.loadMapStyles({
          [style.id]: style
        }));
      } else {
        this._requestMapStyle(style);
      }
    })
  }

  _requestMapStyle(mapStyle) {
    const {url, id} = mapStyle;
    request.json(url, (error, result) => {
      if (error) {
        Console.warn(`Error loading map style ${mapStyle.url}`);
      }
      this.props.dispatch(MapStyleActions.loadMapStyles({
        [id]: {...mapStyle, style: result}
      }));
    });
  }

  render() {
    const {
      // props
      id,
      buildingData,
      editingDataset,
      filters,
      layers,
      splitMaps, // this will store support for split map view is necessary
      layerOrder,
      layerBlending,
      interactionConfig,
      datasets,
      mapStyle,
      mapState,
      layerData,
      hoverInfo,
      clicked,
      uiState,

      // actions,
      buildingDataActions,
      visStateActions,
      mapStateActions,
      mapStyleActions,
      uiStateActions
    } = this.props;

    const sideFields = {
      datasets,
      editingDataset,
      filters,
      layers,
      layerOrder,
      interactionConfig,
      mapStyle,
      layerBlending,
      uiState,
      mapStyleActions,
      visStateActions,
      uiStateActions
    };

    const mapFields = {
      buildingData,
      datasets,
      mapState,
      mapStyle,
      layers,
      layerOrder,
      layerData,
      layerBlending,
      interactionConfig,
      hoverInfo,
      clicked,
      visStateActions,
      mapStateActions,
      buildingDataActions
    };

    const isSplit = splitMaps && splitMaps.length > 1;

    const mapContainers = !isSplit ? [
      (
        <MapContainer
          key={0}
          index={0}
          {...mapFields}
          mapLayers={isSplit ? splitMaps[0].layers : null}
          popoverOffset={{left: 0, top: 0}}
        />
      )
    ] : splitMaps.map((settings, index) => (
      <MapContainer
        key={index}
        index={index}
        {...mapFields}
        mapLayers={splitMaps[index].layers}
        popoverOffset={{left: 0, top: 0}}
      />
    ));

    const containerW = mapState.width * (Number(isSplit) + 1);
    return (
      <ThemeProvider theme={theme}>
        <div style={{position: 'relative'}} className="kepler-gl" id={`kepler-gl__${id}`}
             ref={node => {
               this.root = node;
             }}>
          {!mapState.isFullScreen && (
            <SidePanel
              {...sideFields}
              width={DIMENSIONS.sideBarWidth}
              containerW={containerW}
              containerH={mapState.height}
              height={mapState.height}
              rootNode={this.root}
            />
          )}
          <div className="maps" style={{display: 'flex'}}>
            {mapContainers}
          </div>
          <BottomWidget
            filters={filters}
            datasets={datasets}
            uiState={uiState}
            visStateActions={visStateActions}
            sidePanelWidth={DIMENSIONS.sideBarWidth}
            sideNavWidth={DIMENSIONS.sideNavC}
            containerW={containerW}
          />
        </div>
      </ThemeProvider>
    );
  }
}

KeplerGL.defaultProps = defaultProps;

function mapStateToProps(state, props) {
  return {
    ...props,
    ...state.visState,
    buildingData: state.buildingData.buildingData,
    mapStyle: state.mapStyle,
    mapState: state.mapState,
    uiState: state.uiState
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const userActions = ownProps.actions || {};

  const [
    visStateActions,
    mapStateActions,
    mapStyleActions,
    buildingDataActions,
    uiStateActions
  ] = [
    VisStateActions,
    MapStateActions,
    MapStyleActions,
    BuildingDataActions,
    UIStateActions
  ].map(actions =>
    bindActionCreators(mergeActions(actions, userActions), dispatch));

  return {
    visStateActions,
    mapStateActions,
    mapStyleActions,
    buildingDataActions,
    uiStateActions,
    dispatch
  };
}

/**
 * Override default maps-gl actions with user defined actions using the same key
 */
function mergeActions(actions, userActions) {
  const overrides = {};
  for (const key in userActions) {
    if (userActions.hasOwnProperty(key) && actions.hasOwnProperty(key)) {
      overrides[key] = userActions[key];
    }
  }

  return {...actions, ...overrides};
}

export default keplerGlConnect(
  mapStateToProps,
  mapDispatchToProps
)(KeplerGL);
