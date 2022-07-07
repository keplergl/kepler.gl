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

import React, {Component, createRef, Dispatch} from 'react';
import Console from 'global/console';
import {bindActionCreators} from 'redux';
import styled, {ThemeProvider, withTheme} from 'styled-components';
import {createSelector} from 'reselect';
import {connect as keplerGlConnect} from 'connect/keplergl-connect';
import {IntlProvider} from 'react-intl';
import {messages} from '../localization';
import {RootContext} from 'components/context';
import {
  OnErrorCallBack,
  OnSuccessCallBack,
  MapStateActions,
  MapStyleActions,
  VisStateActions,
  UIStateActions,
  ProviderActions
} from 'actions';

type KeplerGlActions = {
  visStateActions: typeof VisStateActions;
  mapStateActions: typeof MapStateActions;
  mapStyleActions: typeof MapStyleActions;
  uiStateActions: typeof UIStateActions;
  providerActions: typeof ProviderActions;
};

import {
  DIMENSIONS,
  KEPLER_GL_NAME,
  KEPLER_GL_VERSION,
  THEME,
  DEFAULT_MAPBOX_API_URL,
  GEOCODER_DATASET_NAME,
  MISSING_MAPBOX_TOKEN
} from '@kepler.gl/constants';

import SidePanelFactory from './side-panel';
import MapContainerFactory from './map-container';
import MapsLayoutFactory from './maps-layout';
import BottomWidgetFactory from './bottom-widget';
import ModalContainerFactory from './modal-container';
import PlotContainerFactory from './plot-container';
import NotificationPanelFactory from './notification-panel';
import GeoCoderPanelFactory from './geocoder-panel';

import {filterObjectByPredicate, generateHashId} from 'utils/utils';
import {validateToken} from 'utils/mapbox-utils';
import {mergeMessages} from 'utils/locale-utils';

import {theme as basicTheme, themeLT, themeBS} from 'styles/base';
import {observeDimensions, unobserveDimensions} from '../utils/observe-dimensions';
import {KeplerGlState} from 'reducers/core';
import {Provider} from 'cloud-providers';

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

  .mapboxgl-ctrl .mapboxgl-ctrl-logo {
    display: none;
  }
`;

interface BottomWidgetOuterProps {
  absolute?: boolean;
}

const BottomWidgetOuter = styled.div<BottomWidgetOuterProps>(
  ({absolute}) => `
  ${absolute ? 'position: absolute; bottom: 0; right: 0;' : ''}
  pointer-events: none; /* prevent padding from blocking input */
  & > * {
    /* all children should allow input */
    pointer-events: all;
  }`
);

export const mapFieldsSelector = (props: KeplerGLProps) => ({
  getMapboxRef: props.getMapboxRef,
  mapboxApiAccessToken: props.mapboxApiAccessToken,
  mapboxApiUrl: props.mapboxApiUrl ? props.mapboxApiUrl : DEFAULT_KEPLER_GL_PROPS.mapboxApiUrl,
  mapState: props.mapState,
  mapStyle: props.mapStyle,
  onDeckInitialized: props.onDeckInitialized,
  onViewStateChange: props.onViewStateChange,
  deckGlProps: props.deckGlProps,
  uiStateActions: props.uiStateActions,
  visStateActions: props.visStateActions,
  mapStateActions: props.mapStateActions,

  // visState
  editor: props.visState.editor,
  datasets: props.visState.datasets,
  layers: props.visState.layers,
  layerOrder: props.visState.layerOrder,
  layerData: props.visState.layerData,
  layerBlending: props.visState.layerBlending,
  filters: props.visState.filters,
  interactionConfig: props.visState.interactionConfig,
  hoverInfo: props.visState.hoverInfo,
  clicked: props.visState.clicked,
  mousePos: props.visState.mousePos,
  animationConfig: props.visState.animationConfig,

  // uiState
  activeSidePanel: props.uiState.activeSidePanel,
  mapControls: props.uiState.mapControls,
  readOnly: props.uiState.readOnly,
  locale: props.uiState.locale
});

export function getVisibleDatasets(datasets) {
  // We don't want Geocoder dataset to be present in SidePanel dataset list
  return filterObjectByPredicate(datasets, (key, value) => key !== GEOCODER_DATASET_NAME);
}

export const sidePanelSelector = (props: KeplerGLProps, availableProviders, filteredDatasets) => ({
  appName: props.appName ? props.appName : DEFAULT_KEPLER_GL_PROPS.appName,
  version: props.version ? props.version : DEFAULT_KEPLER_GL_PROPS.version,
  appWebsite: props.appWebsite,
  mapStyle: props.mapStyle,
  onSaveMap: props.onSaveMap,
  uiState: props.uiState,
  mapStyleActions: props.mapStyleActions,
  visStateActions: props.visStateActions,
  uiStateActions: props.uiStateActions,
  mapStateActions: props.mapStateActions,

  datasets: filteredDatasets,
  filters: props.visState.filters,
  layers: props.visState.layers,
  layerOrder: props.visState.layerOrder,
  layerClasses: props.visState.layerClasses,
  interactionConfig: props.visState.interactionConfig,
  mapInfo: props.visState.mapInfo,
  layerBlending: props.visState.layerBlending,

  width: props.sidePanelWidth ? props.sidePanelWidth : DEFAULT_KEPLER_GL_PROPS.width,
  availableProviders,
  mapSaved: props.providerState.mapSaved
});

export const plotContainerSelector = (props: KeplerGLProps) => ({
  width: props.width,
  height: props.height,
  exportImageSetting: props.uiState.exportImage,
  mapFields: mapFieldsSelector(props),
  addNotification: props.uiStateActions.addNotification,
  setExportImageSetting: props.uiStateActions.setExportImageSetting,
  setExportImageDataUri: props.uiStateActions.setExportImageDataUri,
  setExportImageError: props.uiStateActions.setExportImageError,
  splitMaps: props.visState.splitMaps
});

export const isSplitSelector = (props: KeplerGLProps) =>
  props.visState.splitMaps && props.visState.splitMaps.length > 1;

export const bottomWidgetSelector = (props: KeplerGLProps, theme) => ({
  filters: props.visState.filters,
  datasets: props.visState.datasets,
  uiState: props.uiState,
  layers: props.visState.layers,
  animationConfig: props.visState.animationConfig,
  visStateActions: props.visStateActions,
  toggleModal: props.uiStateActions.toggleModal,
  sidePanelWidth: props.uiState.readOnly ? 0 : props.sidePanelWidth + theme.sidePanel.margin.left
});

export const modalContainerSelector = (props: KeplerGLProps, rootNode) => ({
  appName: props.appName ? props.appName : DEFAULT_KEPLER_GL_PROPS.appName,
  mapStyle: props.mapStyle,
  visState: props.visState,
  mapState: props.mapState,
  uiState: props.uiState,
  providerState: props.providerState,

  mapboxApiAccessToken: props.mapboxApiAccessToken,
  mapboxApiUrl: props.mapboxApiUrl,
  visStateActions: props.visStateActions,
  uiStateActions: props.uiStateActions,
  mapStyleActions: props.mapStyleActions,
  providerActions: props.providerActions,

  rootNode,
  // User defined cloud provider props
  cloudProviders: props.cloudProviders
    ? props.cloudProviders
    : DEFAULT_KEPLER_GL_PROPS.cloudProviders,
  onExportToCloudSuccess: props.onExportToCloudSuccess,
  onLoadCloudMapSuccess: props.onLoadCloudMapSuccess,
  onLoadCloudMapError: props.onLoadCloudMapError,
  onExportToCloudError: props.onExportToCloudError
});

export const geoCoderPanelSelector = (props: KeplerGLProps) => ({
  isGeocoderEnabled: props.visState.interactionConfig.geocoder.enabled,
  mapboxApiAccessToken: props.mapboxApiAccessToken,
  mapState: props.mapState,
  updateVisData: props.visStateActions.updateVisData,
  removeDataset: props.visStateActions.removeDataset,
  updateMap: props.mapStateActions.updateMap
});

export const notificationPanelSelector = (props: KeplerGLProps) => ({
  removeNotification: props.uiStateActions.removeNotification,
  notifications: props.uiState.notifications
});

export const DEFAULT_KEPLER_GL_PROPS = {
  mapStyles: [],
  mapStylesReplaceDefault: false,
  mapboxApiUrl: DEFAULT_MAPBOX_API_URL,
  width: 800,
  height: 800,
  appName: KEPLER_GL_NAME,
  version: KEPLER_GL_VERSION,
  sidePanelWidth: DIMENSIONS.sidePanel.width,
  theme: {},
  cloudProviders: [],
  readOnly: false
};

type KeplerGLBasicProps = {
  mapboxApiAccessToken: string;
  mapboxApiUrl?: string;
  id: string;
  width?: number;
  height?: number;

  appWebsite?: any;
  onSaveMap?: () => void;
  onViewStateChange?: () => void;
  onDeckInitialized?: () => void;
  onKeplerGlInitialized?: () => void;
  getMapboxRef?: () => React.RefObject<any>;
  mapStyles?: {id: string; style?: object}[];
  mapStylesReplaceDefault?: boolean;
  appName?: string;
  version?: string;
  sidePanelWidth?: number;
  theme?: object;
  cloudProviders?: Provider[];
  deckGlProps?: object;
  onLoadCloudMapSuccess?: OnSuccessCallBack;
  onLoadCloudMapError?: OnErrorCallBack;
  onExportToCloudSuccess?: OnSuccessCallBack;
  onExportToCloudError?: OnErrorCallBack;
  readOnly?: boolean;

  localeMessages?: {[key: string]: {[key: string]: string}};
  dispatch: Dispatch<any>;
};

type KeplerGLProps = KeplerGlState & KeplerGlActions & KeplerGLBasicProps;

KeplerGlFactory.deps = [
  BottomWidgetFactory,
  GeoCoderPanelFactory,
  MapContainerFactory,
  MapsLayoutFactory,
  ModalContainerFactory,
  SidePanelFactory,
  PlotContainerFactory,
  NotificationPanelFactory
];

function KeplerGlFactory(
  BottomWidget: ReturnType<typeof BottomWidgetFactory>,
  GeoCoderPanel: ReturnType<typeof GeoCoderPanelFactory>,
  MapContainer: ReturnType<typeof MapContainerFactory>,
  MapsLayout: ReturnType<typeof MapsLayoutFactory>,
  ModalContainer: ReturnType<typeof ModalContainerFactory>,
  SidePanel: ReturnType<typeof SidePanelFactory>,
  PlotContainer: ReturnType<typeof PlotContainerFactory>,
  NotificationPanel: ReturnType<typeof NotificationPanelFactory>
): React.ComponentType<KeplerGLBasicProps & {selector: (...args: any[]) => KeplerGlState}> {
  /** @typedef {import('./kepler-gl').UnconnectedKeplerGlProps} KeplerGlProps */
  /** @augments React.Component<KeplerGlProps> */
  class KeplerGL extends Component<KeplerGLProps & {selector: (...args: any[]) => KeplerGlState}> {
    static defaultProps = DEFAULT_KEPLER_GL_PROPS;

    state = {
      dimensions: null
    };

    componentDidMount() {
      this._validateMapboxToken();
      this._loadMapStyle();
      if (typeof this.props.onKeplerGlInitialized === 'function') {
        this.props.onKeplerGlInitialized();
      }
      if (this.root.current instanceof HTMLElement) {
        observeDimensions(this.root.current, this._handleResize);
      }
    }

    componentWillUnmount() {
      if (this.root.current instanceof HTMLElement) {
        unobserveDimensions(this.root.current);
      }
    }

    _handleResize = dimensions => {
      this.setState({dimensions});
    };

    static contextType = RootContext;

    root = createRef<HTMLDivElement>();
    bottomWidgetRef = createRef();

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

    datasetsSelector = props => props.visState.datasets;
    filteredDatasetsSelector = createSelector(this.datasetsSelector, getVisibleDatasets);

    availableProviders = createSelector(
      (props: KeplerGLProps) => props.cloudProviders,
      providers =>
        Array.isArray(providers) && providers.length
          ? {
              hasStorage: providers.some(p => p.hasPrivateStorage()),
              hasShare: providers.some(p => p.hasSharingUrl())
            }
          : {}
    );

    localeMessagesSelector = createSelector(
      (props: KeplerGLProps) => props.localeMessages,
      customMessages => (customMessages ? mergeMessages(messages, customMessages) : messages)
    );

    /* private methods */
    _validateMapboxToken() {
      const {mapboxApiAccessToken} = this.props;
      if (!validateToken(mapboxApiAccessToken)) {
        Console.warn(MISSING_MAPBOX_TOKEN);
      }
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
        id = 'map',
        width = DEFAULT_KEPLER_GL_PROPS.width,
        height = DEFAULT_KEPLER_GL_PROPS.height,
        uiState,
        visState,
        // readOnly override
        readOnly
      } = this.props;

      const dimensions = this.state.dimensions || {width, height};
      const {
        splitMaps, // this will store support for split map view is necessary
        interactionConfig
      } = visState;

      const isSplit = isSplitSelector(this.props);
      const theme = this.availableThemeSelector(this.props);
      const localeMessages = this.localeMessagesSelector(this.props);
      const isExportingImage = uiState.exportImage.exporting;
      const availableProviders = this.availableProviders(this.props);

      const mapFields = mapFieldsSelector(this.props);
      const filteredDatasets = this.filteredDatasetsSelector(this.props);
      const sideFields = sidePanelSelector(this.props, availableProviders, filteredDatasets);
      const plotContainerFields = plotContainerSelector(this.props);
      const bottomWidgetFields = bottomWidgetSelector(this.props, theme);
      const modalContainerFields = modalContainerSelector(this.props, this.root.current);
      const geoCoderPanelFields = geoCoderPanelSelector(this.props);
      const notificationPanelFields = notificationPanelSelector(this.props);

      const mapContainers = !isSplit
        ? [<MapContainer primary={true} key={0} index={0} {...mapFields} mapLayers={null} />]
        : splitMaps.map((settings, index) => (
            <MapContainer
              key={index}
              index={index}
              primary={index === 1}
              {...mapFields}
              mapLayers={splitMaps[index].layers}
            />
          ));

      return (
        <RootContext.Provider value={this.root}>
          <IntlProvider locale={uiState.locale} messages={localeMessages[uiState.locale]}>
            <ThemeProvider theme={theme}>
              <GlobalStyle
                className="kepler-gl"
                id={`kepler-gl__${id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  width: `${width}px`,
                  height: `${height}px`
                }}
                ref={this.root}
              >
                <NotificationPanel {...notificationPanelFields} />
                {!uiState.readOnly && !readOnly && <SidePanel {...sideFields} />}
                <MapsLayout className="maps">{mapContainers}</MapsLayout>
                {isExportingImage && <PlotContainer {...plotContainerFields} />}
                {interactionConfig.geocoder.enabled && <GeoCoderPanel {...geoCoderPanelFields} />}
                <BottomWidgetOuter absolute>
                  <BottomWidget
                    ref={this.bottomWidgetRef}
                    {...bottomWidgetFields}
                    containerW={dimensions.width}
                  />
                </BottomWidgetOuter>
                <ModalContainer
                  {...modalContainerFields}
                  containerW={dimensions.width}
                  containerH={dimensions.height}
                />
              </GlobalStyle>
            </ThemeProvider>
          </IntlProvider>
        </RootContext.Provider>
      );
    }
  }

  return keplerGlConnect(mapStateToProps, makeMapDispatchToProps)(withTheme(KeplerGL));
}

export function mapStateToProps(state: KeplerGlState, props: KeplerGLProps) {
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

const getDispatch = (dispatch, props) => dispatch;
const getUserActions = (dispatch, props) => props.actions || defaultUserActions;

/** @type {() => import('reselect').OutputParametricSelector<any, any, any, any>} */
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
