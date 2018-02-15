import React, {Component} from 'react';
import {console as Console} from 'global/window';
import {bindActionCreators} from 'redux';
import request from 'd3-request';
import styled from 'styled-components';
import {connect as keplerGlConnect} from '../connect/keplergl-connect';

import {ThemeProvider} from 'styled-components';

import * as VisStateActions from 'actions/vis-state-actions';
import * as MapStateActions from 'actions/map-state-actions';
import * as MapStyleActions from 'actions/map-style-actions';
import * as BuildingDataActions from 'actions/building-data-actions';
import * as UIStateActions from 'actions/ui-state-actions';

import {DIMENSIONS, DEFAULT_MAP_STYLES} from 'constants/default-settings';

import {sidePanelFactory} from './side-panel';
import {mapContainerFactory} from './map-container';
import {bottomWidgetFactory} from './bottom-widget';
import {modalWrapperFactory} from './modal-wrapper';

import {theme} from 'styles/base';

const defaultProps = {
  mapStyles: [],
  width: 800,
  height: 800,
  appName: 'Kepler.Gl',
  version: 'v1.0'
};

const GlobalStyle = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
  }

  a {
    text-decoration: none;
  }
`;

keplerGlFactory.deps = [
  bottomWidgetFactory,
  mapContainerFactory,
  modalWrapperFactory,
  sidePanelFactory
];

export const keplerGlChildDeps = [
  ...bottomWidgetFactory.deps,
  ...sidePanelFactory.deps,
  ...modalWrapperFactory.deps,
  ...mapContainerFactory.deps
];

export function keplerGlFactory(
  BottomWidget,
  MapContainer,
  ModalWrapper,
  SidePanel
) {
  class KeplerGL extends Component {
    componentDidMount() {
      this._loadMapStyle(this.props.mapStyles);
      this._handleResize(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (
        this.props.width !== nextProps.width ||
        this.props.height !== nextProps.height
      ) {
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
      [...this.props.mapStyles, ...Object.values(DEFAULT_MAP_STYLES)].forEach(
        style => {
          if (style.style) {
            this.props.dispatch(
              MapStyleActions.loadMapStyles({
                [style.id]: style
              })
            );
          } else {
            this._requestMapStyle(style);
          }
        }
      );
    }

    _requestMapStyle(mapStyle) {
      const {url, id} = mapStyle;
      request.json(url, (error, result) => {
        if (error) {
          Console.warn(`Error loading map style ${mapStyle.url}`);
        }
        this.props.dispatch(
          MapStyleActions.loadMapStyles({
            [id]: {...mapStyle, style: result}
          })
        );
      });
    }

    render() {
      const {
        // props
        id,
        appName,
        version,
        onSaveMap,

        // redux state
        buildingData,
        mapStyle,
        mapState,
        uiState,
        visState,

        // actions,
        buildingDataActions,
        visStateActions,
        mapStateActions,
        mapStyleActions,
        uiStateActions
      } = this.props;

      const {
        filters,
        layers,
        splitMaps, // this will store support for split map view is necessary
        layerOrder,
        layerBlending,
        interactionConfig,
        datasets,
        layerData,
        hoverInfo,
        clicked
      } = visState;

      const sideFields = {
        appName,
        version,
        datasets,
        filters,
        layers,
        layerOrder,
        interactionConfig,
        mapStyle,
        layerBlending,
        onSaveMap,
        uiState,
        mapStyleActions,
        visStateActions,
        uiStateActions,
        width: DIMENSIONS.sidePanel.width
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
      const containerW = mapState.width * (Number(isSplit) + 1);

      const mapContainers = !isSplit
        ? [
            <MapContainer
              key={0}
              index={0}
              {...mapFields}
              mapLayers={isSplit ? splitMaps[0].layers : null}
            />
          ]
        : splitMaps.map((settings, index) => (
            <MapContainer
              key={index}
              index={index}
              {...mapFields}
              mapLayers={splitMaps[index].layers}
            />
          ));

      return (
        <ThemeProvider theme={theme}>
          <GlobalStyle
            style={{position: 'relative'}}
            className="kepler-gl"
            id={`kepler-gl__${id}`}
            innerRef={node => {
              this.root = node;
            }}
          >
            {!mapState.isFullScreen && <SidePanel {...sideFields} />}
            <dv className="maps" style={{display: 'flex'}}>
              {mapContainers}
            </dv>
            <BottomWidget
              filters={filters}
              datasets={datasets}
              uiState={uiState}
              visStateActions={visStateActions}
              sidePanelWidth={
                DIMENSIONS.sidePanel.width - DIMENSIONS.sidePanel.margin
              }
              containerW={containerW}
            />
            <ModalWrapper
              visState={visState}
              uiState={uiState}
              visStateActions={visStateActions}
              uiStateActions={uiStateActions}
              rootNode={this.root}
              containerW={containerW}
              containerH={mapState.height}
            />
          </GlobalStyle>
        </ThemeProvider>
      );
    }
  }
  KeplerGL.defaultProps = defaultProps;

  return keplerGlConnect(mapStateToProps, mapDispatchToProps)(KeplerGL);
}

function mapStateToProps(state, props) {
  return {
    ...props,
    visState: state.visState,
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
    bindActionCreators(mergeActions(actions, userActions), dispatch)
  );

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
