// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component, createRef, Dispatch} from 'react';
import Console from 'global/console';
import {bindActionCreators} from 'redux';
import styled, {ThemeProvider, withTheme} from 'styled-components';
import {createSelector} from 'reselect';
import {connect as keplerGlConnect} from './connect/keplergl-connect';
import {IntlProvider} from 'react-intl';
import {messages} from '@kepler.gl/localization';
import {RootContext, FeatureFlagsContextProvider, FeatureFlags} from './context';
import {OnErrorCallBack, OnSuccessCallBack, Viewport} from '@kepler.gl/types';

import {
  MapStateActions,
  MapStyleActions,
  ProviderActions,
  UIStateActions,
  VisStateActions
} from '@kepler.gl/actions';

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
import EffectManagerFactory from './effects/effect-manager';
import DndContextFactory from './dnd-context';
import {CloudListProvider} from './hooks/use-cloud-list-provider';

import {
  filterObjectByPredicate,
  generateHashId,
  validateToken,
  mergeMessages,
  observeDimensions,
  unobserveDimensions,
  hasPortableWidth
} from '@kepler.gl/utils';

import {theme as basicTheme, themeLT, themeBS, breakPointValues} from '@kepler.gl/styles';
import {KeplerGlState} from '@kepler.gl/reducers';
import {Provider} from '@kepler.gl/cloud-providers';

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

  .maplibregl-ctrl .maplibregl-ctrl-logo {
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

export const isViewportDisjointed = props => {
  return (
    props.mapState.isSplit &&
    !props.mapState.isViewportSynced &&
    props.mapState.splitMapViewports.length > 1
  );
};

export const mapStateSelector = (props: any, index: number): any => {
  if (!Number.isFinite(index)) {
    // either no index arg or an invalid index was provided
    // it is expected to be either 0 or 1 when in split mode
    // only use the mapState
    return props.mapState;
  }

  return isViewportDisjointed(props)
    ? // mix together the viewport properties intended for this disjointed <MapContainer> with the other necessary mapState properties
      {...props.mapState, ...props.mapState.splitMapViewports[index]}
    : // otherwise only use the mapState
      props.mapState;
};

export const mapFieldsSelector = (props: KeplerGLProps, index = 0) => ({
  getMapboxRef: props.getMapboxRef,
  mapboxApiAccessToken: props.mapboxApiAccessToken,
  mapboxApiUrl: props.mapboxApiUrl ? props.mapboxApiUrl : DEFAULT_KEPLER_GL_PROPS.mapboxApiUrl,
  mapState: mapStateSelector(props, index),
  mapStyle: props.mapStyle,
  onDeckInitialized: props.onDeckInitialized,
  onViewStateChange: props.onViewStateChange,
  onMouseMove: props.onMouseMove,
  deckGlProps: props.deckGlProps,
  uiStateActions: props.uiStateActions,
  visStateActions: props.visStateActions,
  mapStateActions: props.mapStateActions,

  // visState
  visState: props.visState,

  // uiState
  activeSidePanel: props.uiState.activeSidePanel,
  mapControls: props.uiState.mapControls,
  readOnly: props.uiState.readOnly,
  locale: props.uiState.locale,

  // mapStyle
  topMapContainerProps: props.topMapContainerProps,
  bottomMapContainerProps: props.bottomMapContainerProps,

  // transformRequest for Mapbox basemaps
  transformRequest: props.transformRequest
});

export function getVisibleDatasets(datasets) {
  // We don't want Geocoder dataset to be present in SidePanel dataset list
  return filterObjectByPredicate(datasets, key => key !== GEOCODER_DATASET_NAME);
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
  overlayBlending: props.visState.overlayBlending,

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

export const geoCoderPanelSelector = (
  props: KeplerGLProps,
  dimensions: {width: number; height: number}
) => ({
  isGeocoderEnabled: props.visState.interactionConfig.geocoder.enabled,
  mapboxApiAccessToken: props.mapboxApiAccessToken,
  mapState: props.mapState,
  uiState: props.uiState,
  layerOrder: props.visState.layerOrder,
  updateVisData: props.visStateActions.updateVisData,
  removeDataset: props.visStateActions.removeDataset,
  updateMap: props.mapStateActions.updateMap,
  appWidth: dimensions.width
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
  readOnly: false,
  featureFlags: {}
};

type KeplerGLBasicProps = {
  mapboxApiAccessToken: string;
  mapboxApiUrl?: string;
  id: string;
  width?: number;
  height?: number;

  appWebsite?: any;
  onSaveMap?: () => void;
  onViewStateChange?: (viewState: Viewport) => void;
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
  onMouseMove?: (event: React.MouseEvent & {lngLat?: [number, number]}) => void;
  onExportToCloudSuccess?: OnSuccessCallBack;
  onExportToCloudError?: OnErrorCallBack;
  readOnly?: boolean;
  featureFlags?: FeatureFlags;

  localeMessages?: {[key: string]: {[key: string]: string}};
  dispatch: Dispatch<any>;

  topMapContainerProps?: object;
  bottomMapContainerProps?: object;

  transformRequest?: (url: string) => {url: string};
};

type KeplerGLProps = KeplerGlState & KeplerGlActions & KeplerGLBasicProps;
type KeplerGLCompState = {
  dimensions: {width: number; height: number} | null;
};

KeplerGlFactory.deps = [
  BottomWidgetFactory,
  GeoCoderPanelFactory,
  MapContainerFactory,
  MapsLayoutFactory,
  ModalContainerFactory,
  SidePanelFactory,
  PlotContainerFactory,
  NotificationPanelFactory,
  DndContextFactory,
  EffectManagerFactory
];

function KeplerGlFactory(
  BottomWidget: ReturnType<typeof BottomWidgetFactory>,
  GeoCoderPanel: ReturnType<typeof GeoCoderPanelFactory>,
  MapContainer: ReturnType<typeof MapContainerFactory>,
  MapsLayout: ReturnType<typeof MapsLayoutFactory>,
  ModalContainer: ReturnType<typeof ModalContainerFactory>,
  SidePanel: ReturnType<typeof SidePanelFactory>,
  PlotContainer: ReturnType<typeof PlotContainerFactory>,
  NotificationPanel: ReturnType<typeof NotificationPanelFactory>,
  DndContext: ReturnType<typeof DndContextFactory>
): React.ComponentType<KeplerGLBasicProps & {selector: (...args: any[]) => KeplerGlState}> {
  /** @typedef {import('./kepler-gl').UnconnectedKeplerGlProps} KeplerGlProps */
  /** @augments React.Component<KeplerGlProps> */
  class KeplerGL extends Component<
    KeplerGLProps & {selector: (...args: any[]) => KeplerGlState},
    KeplerGLCompState
  > {
    static defaultProps = DEFAULT_KEPLER_GL_PROPS;

    state: KeplerGLCompState = {
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
    bottomWidgetRef = createRef<HTMLDivElement>();

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

      const allStyles = [...customStyles, ...defaultStyles].reduce((accu, style) => {
        accu[style.id] = style;
        return accu;
      }, {});

      this.props.mapStyleActions.loadMapStyles(allStyles);
    };

    _deleteMapLabels = (containerId, layerId) => {
      this.props.visStateActions.toggleLayerForMap(containerId, layerId);
    };

    // eslint-disable-next-line complexity
    render() {
      const {
        id = 'map',
        width = DEFAULT_KEPLER_GL_PROPS.width,
        height = DEFAULT_KEPLER_GL_PROPS.height,
        uiState,
        visState,
        // readOnly override
        readOnly,

        // features
        featureFlags,

        // cloud providers
        cloudProviders = []
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

      const filteredDatasets = this.filteredDatasetsSelector(this.props);
      const sideFields = sidePanelSelector(this.props, availableProviders, filteredDatasets);
      const plotContainerFields = plotContainerSelector(this.props);
      const bottomWidgetFields = bottomWidgetSelector(this.props, theme);
      const modalContainerFields = modalContainerSelector(this.props, this.root.current);
      const geoCoderPanelFields = geoCoderPanelSelector(this.props, dimensions);
      const notificationPanelFields = notificationPanelSelector(this.props);
      const mapContainers = !isSplit
        ? [
            <MapContainer
              primary={true}
              key={0}
              index={0}
              {...mapFieldsSelector(this.props)}
              containerId={0}
              deleteMapLabels={this._deleteMapLabels}
            />
          ]
        : splitMaps.map((settings, index) => (
            <MapContainer
              key={index}
              index={index}
              primary={index === 1}
              {...mapFieldsSelector(this.props, index)}
              containerId={index}
              deleteMapLabels={this._deleteMapLabels}
            />
          ));

      return (
        <RootContext.Provider value={this.root}>
          <FeatureFlagsContextProvider featureFlags={featureFlags}>
            <IntlProvider locale={uiState.locale} messages={localeMessages[uiState.locale]}>
              <ThemeProvider theme={theme}>
                <CloudListProvider providers={cloudProviders}>
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
                    <DndContext>
                      {!uiState.readOnly && !readOnly && <SidePanel {...sideFields} />}
                      <MapsLayout className="maps" mapState={this.props.mapState}>
                        {mapContainers}
                      </MapsLayout>
                    </DndContext>
                    {isExportingImage && <PlotContainer {...plotContainerFields} />}
                    {/* 1 geocoder: single mode OR split mode and synced viewports */}
                    {!isViewportDisjointed(this.props) && interactionConfig.geocoder.enabled && (
                      <GeoCoderPanel {...geoCoderPanelFields} index={0} unsyncedViewports={false} />
                    )}
                    {/* 2 geocoders: split mode and unsynced viewports */}
                    {isViewportDisjointed(this.props) &&
                      interactionConfig.geocoder.enabled &&
                      mapContainers.map((_mapContainer, index) => (
                        <GeoCoderPanel
                          key={index}
                          {...geoCoderPanelFields}
                          index={index}
                          unsyncedViewports={true}
                        />
                      ))}
                    <BottomWidgetOuter absolute={!hasPortableWidth(breakPointValues)}>
                      <BottomWidget
                        rootRef={this.bottomWidgetRef}
                        {...bottomWidgetFields}
                        containerW={dimensions.width}
                        theme={theme}
                      />
                    </BottomWidgetOuter>
                    <ModalContainer
                      {...modalContainerFields}
                      containerW={dimensions.width}
                      containerH={dimensions.height}
                    />
                  </GlobalStyle>
                </CloudListProvider>
              </ThemeProvider>
            </IntlProvider>
          </FeatureFlagsContextProvider>
        </RootContext.Provider>
      );
    }
  }

  return keplerGlConnect(
    mapStateToProps,
    makeMapDispatchToProps
  )(withTheme(KeplerGL)) as ReturnType<typeof KeplerGlFactory>;
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

const getDispatch = dispatch => dispatch;
const getUserActions = (dispatch, props) => props.actions || defaultUserActions;

/** @type {() => import('reselect').OutputParametricSelector<any, any, any, any>} */
export function makeGetActionCreators() {
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
    if (
      Object.prototype.hasOwnProperty.call(userActions, key) &&
      Object.prototype.hasOwnProperty.call(actions, key)
    ) {
      overrides[key] = userActions[key];
    }
  }

  return {...actions, ...overrides};
}

export default KeplerGlFactory;
