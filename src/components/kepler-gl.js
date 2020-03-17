// Copyright (c) 2020 Uber Technologies, Inc.
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

import React, {Component, createRef} from 'react';
import {console as Console} from 'global/window';
import {bindActionCreators} from 'redux';
import styled, {ThemeProvider, withTheme} from 'styled-components';
import {createSelector} from 'reselect';
import {connect as keplerGlConnect} from 'connect/keplergl-connect';
import {RootContext} from 'components/context';

import * as VisStateActions from 'actions/vis-state-actions';
import * as MapStateActions from 'actions/map-state-actions';
import * as MapStyleActions from 'actions/map-style-actions';
import * as UIStateActions from 'actions/ui-state-actions';
import * as ProviderActions from 'actions/provider-actions';

import {
  EXPORT_IMAGE_ID,
  DIMENSIONS,
  KEPLER_GL_NAME,
  KEPLER_GL_VERSION,
  THEME,
  DEFAULT_MAPBOX_API_URL,
  SAVE_MAP_ID,
  SHARE_MAP_ID,
  OVERWRITE_MAP_ID
} from 'constants/default-settings';
import {MISSING_MAPBOX_TOKEN} from 'constants/user-feedbacks';

import SidePanelFactory from './side-panel';
import MapContainerFactory from './map-container';
import BottomWidgetFactory from './bottom-widget';
import ModalContainerFactory from './modal-container';
import PlotContainerFactory from './plot-container';
import NotificationPanelFactory from './notification-panel';

import {generateHashId} from 'utils/utils';
import {validateToken} from 'utils/mapbox-utils';

import {theme as basicTheme, themeLT, themeBS} from 'styles/base';

// Maybe we should think about exporting this or creating a variable
// as part of the base.js theme
const GlobalStyle = styled.div`
  font-family: ${props => props.theme.fontFamily};
  font-weight: ${props => props.theme.fontWeight};
  font-size: ${props => props.theme.fontSize};
  line-height: ${props => props.theme.lineHeight};

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
    color: ${props => props.theme.labelColor};
  }
`;

KeplerGlFactory.deps = [
  BottomWidgetFactory,
  MapContainerFactory,
  ModalContainerFactory,
  SidePanelFactory,
  PlotContainerFactory,
  NotificationPanelFactory
];

function KeplerGlFactory(
  BottomWidget,
  MapContainer,
  ModalContainer,
  SidePanel,
  PlotContainer,
  NotificationPanel
) {
  class KeplerGL extends Component {
    static defaultProps = {
      mapStyles: [],
      mapStylesReplaceDefault: false,
      mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
      width: 800,
      height: 800,
      appName: KEPLER_GL_NAME,
      version: KEPLER_GL_VERSION,
      sidePanelWidth: DIMENSIONS.sidePanel.width,
      theme: {},
      cloudProviders: []
    };

    componentDidMount() {
      this._validateMapboxToken();
      this._loadMapStyle(this.props.mapStyles);
      this._handleResize(this.props);
    }

    componentDidUpdate(prevProps) {
      if (
        // if dimension props has changed
        this.props.height !== prevProps.height ||
        this.props.width !== prevProps.width ||
        // react-map-gl will dispatch updateViewport after this._handleResize is called
        // here we check if this.props.mapState.height is sync with props.height
        this.props.height !== this.props.mapState.height
      ) {
        this._handleResize(this.props);
      }
    }

    root = createRef();
    static contextType = RootContext;

    /* selectors */
    themeSelector = props => props.theme;
    availableThemeSelector = createSelector(this.themeSelector, theme =>
      typeof theme === 'object'
        ? {
            ...basicTheme,
            ...theme
          }
        : theme === THEME.light
        ? themeLT
        : theme === THEME.base
        ? themeBS
        : theme
    );

    availableProviders = createSelector(
      props => props.cloudProviders,
      providers =>
        Array.isArray(providers) && providers.length
          ? {
              hasStorage: providers.some(p => p.hasPrivateStorage()),
              hasShare: providers.some(p => p.hasSharingUrl())
            }
          : {}
    );

    /* private methods */
    _validateMapboxToken() {
      const {mapboxApiAccessToken} = this.props;
      if (!validateToken(mapboxApiAccessToken)) {
        Console.warn(MISSING_MAPBOX_TOKEN);
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

    _loadMapStyle = () => {
      const defaultStyles = Object.values(this.props.mapStyle.mapStyles);
      // add id to custom map styles if not given
      const customStyles = (this.props.mapStyles || []).map(ms => ({
        ...ms,
        id: ms.id || generateHashId()
      }));

      const allStyles = [...customStyles, ...defaultStyles].reduce(
        (accu, style) => {
          const hasStyleObject = style.style && typeof style.style === 'object';
          accu[hasStyleObject ? 'toLoad' : 'toRequest'][style.id] = style;

          return accu;
        },
        {toLoad: {}, toRequest: {}}
      );

      this.props.mapStyleActions.loadMapStyles(allStyles.toLoad);
      this.props.mapStyleActions.requestMapStyles(allStyles.toRequest);
    };

    render() {
      const {
        // props
        id,
        appName,
        version,
        appWebsite,
        onSaveMap,
        onViewStateChange,
        width,
        height,
        mapboxApiAccessToken,
        mapboxApiUrl,
        getMapboxRef,

        // redux state
        mapStyle,
        mapState,
        uiState,
        visState,
        providerState,

        // actions,
        visStateActions,
        mapStateActions,
        mapStyleActions,
        uiStateActions,
        providerActions
      } = this.props;

      const availableProviders = this.availableProviders(this.props);

      const {
        filters,
        layers,
        splitMaps, // this will store support for split map view is necessary
        layerOrder,
        layerBlending,
        layerClasses,
        interactionConfig,
        datasets,
        layerData,
        hoverInfo,
        clicked,
        mousePos,
        animationConfig,
        mapInfo
      } = visState;

      const notificationPanelFields = {
        removeNotification: uiStateActions.removeNotification,
        notifications: uiState.notifications
      };

      const sideFields = {
        appName,
        version,
        appWebsite,
        datasets,
        filters,
        layers,
        layerOrder,
        layerClasses,
        interactionConfig,
        mapStyle,
        mapInfo,
        layerBlending,
        onSaveMap,
        uiState,
        mapStyleActions,
        visStateActions,
        uiStateActions,
        width: this.props.sidePanelWidth,
        availableProviders,
        mapSaved: providerState.mapSaved
      };

      const mapFields = {
        datasets,
        getMapboxRef,
        mapboxApiAccessToken,
        mapboxApiUrl,
        mapState,
        uiState,
        editor: visState.editor,
        mapStyle,
        mapControls: uiState.mapControls,
        layers,
        layerOrder,
        layerData,
        layerBlending,
        filters,
        interactionConfig,
        hoverInfo,
        clicked,
        mousePos,
        readOnly: uiState.readOnly,
        onViewStateChange,
        uiStateActions,
        visStateActions,
        mapStateActions,
        animationConfig
      };

      const isSplit = splitMaps && splitMaps.length > 1;
      const containerW = mapState.width * (Number(isSplit) + 1);

      const mapContainers = !isSplit
        ? [<MapContainer key={0} index={0} {...mapFields} mapLayers={null} />]
        : splitMaps.map((settings, index) => (
            <MapContainer
              key={index}
              index={index}
              {...mapFields}
              mapLayers={splitMaps[index].layers}
            />
          ));

      const isExporting =
        uiState.currentModal === EXPORT_IMAGE_ID ||
        uiState.currentModal === SAVE_MAP_ID ||
        uiState.currentModal === SHARE_MAP_ID ||
        uiState.currentModal === OVERWRITE_MAP_ID;

      const theme = this.availableThemeSelector(this.props);

      return (
        <RootContext.Provider value={this.root}>
          <ThemeProvider theme={theme}>
            <GlobalStyle
              width={width}
              height={height}
              className="kepler-gl"
              id={`kepler-gl__${id}`}
              ref={this.root}
            >
              <NotificationPanel {...notificationPanelFields} />
              {!uiState.readOnly && <SidePanel {...sideFields} />}
              <div className="maps" style={{display: 'flex'}}>
                {mapContainers}
              </div>
              {isExporting && (
                <PlotContainer
                  width={width}
                  height={height}
                  exportImageSetting={uiState.exportImage}
                  mapFields={mapFields}
                  addNotification={uiStateActions.addNotification}
                  startExportingImage={uiStateActions.startExportingImage}
                  setExportImageDataUri={uiStateActions.setExportImageDataUri}
                  setExportImageError={uiStateActions.setExportImageError}
                />
              )}
              <BottomWidget
                filters={filters}
                datasets={datasets}
                uiState={uiState}
                layers={layers}
                animationConfig={animationConfig}
                visStateActions={visStateActions}
                sidePanelWidth={
                  uiState.readOnly
                    ? 0
                    : this.props.sidePanelWidth + DIMENSIONS.sidePanel.margin.left
                }
                containerW={containerW}
              />
              <ModalContainer
                mapStyle={mapStyle}
                visState={visState}
                mapState={mapState}
                uiState={uiState}
                mapboxApiAccessToken={mapboxApiAccessToken}
                mapboxApiUrl={mapboxApiUrl}
                visStateActions={visStateActions}
                uiStateActions={uiStateActions}
                mapStyleActions={mapStyleActions}
                providerActions={providerActions}
                rootNode={this.root.current}
                containerW={containerW}
                containerH={mapState.height}
                providerState={this.props.providerState}
                // User defined cloud provider props
                cloudProviders={this.props.cloudProviders}
                onExportToCloudSuccess={this.props.onExportToCloudSuccess}
                onLoadCloudMapSuccess={this.props.onLoadCloudMapSuccess}
                onLoadCloudMapError={this.props.onLoadCloudMapError}
                onExportToCloudError={this.props.onExportToCloudError}
              />
            </GlobalStyle>
          </ThemeProvider>
        </RootContext.Provider>
      );
    }
  }

  return keplerGlConnect(mapStateToProps, makeMapDispatchToProps)(withTheme(KeplerGL));
}

function mapStateToProps(state = {}, props) {
  return {
    ...props,
    visState: state.visState,
    mapStyle: state.mapStyle,
    mapState: state.mapState,
    uiState: state.uiState,
    providerState: state.providerState
  };
}

const defaultUserActions = {};
const getDispatch = dispatch => dispatch;
const getUserActions = (dispatch, props) => props.actions || defaultUserActions;

function makeGetActionCreators() {
  return createSelector([getDispatch, getUserActions], (dispatch, userActions) => {
    const [visStateActions, mapStateActions, mapStyleActions, uiStateActions, providerActions] = [
      VisStateActions,
      MapStateActions,
      MapStyleActions,
      UIStateActions,
      ProviderActions
    ].map(actions => bindActionCreators(mergeActions(actions, userActions), dispatch));

    return {
      visStateActions,
      mapStateActions,
      mapStyleActions,
      uiStateActions,
      providerActions,
      dispatch
    };
  });
}

function makeMapDispatchToProps() {
  const getActionCreators = makeGetActionCreators();
  const mapDispatchToProps = (dispatch, ownProps) => {
    const groupedActionCreators = getActionCreators(dispatch, ownProps);

    return {
      ...groupedActionCreators,
      dispatch
    };
  };

  return mapDispatchToProps;
}

/**
 * Override default kepler.gl actions with user defined actions using the same key
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

export default KeplerGlFactory;
