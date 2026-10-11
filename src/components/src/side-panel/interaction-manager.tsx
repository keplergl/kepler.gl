// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {useIntl} from 'react-intl';

import {InteractionConfig, LayerOrder, MapInfo, MapState} from '@kepler.gl/types';
import {UIStateActions, VisStateActions} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';

import InteractionPanelFactory from './interaction-panel/interaction-panel';
import LegendConfigFactory from './interaction-panel/legend-config';
import MapInfoConfigFactory from './interaction-panel/map-info-config';
import ZoomOpacityConfigFactory from './interaction-panel/zoom-opacity-config';
import PanelTitleFactory from './panel-title';
import {PanelHeaderActionIcon} from './panel-header-action';

import {PanelMeta} from './common/types';

/** Right-hand map when split viewports are independent; otherwise the shared map zoom. */
function fadeOnZoomMarkerZoom(mapState?: MapState): number | undefined {
  const rightZoom = mapState?.splitMapViewports?.[1]?.zoom;
  if (
    mapState?.isSplit &&
    !mapState.isViewportSynced &&
    mapState.splitMapViewports.length > 1 &&
    Number.isFinite(rightZoom)
  ) {
    return rightZoom;
  }
  return mapState?.zoom;
}

type InteractionManagerProps = {
  interactionConfig: InteractionConfig;
  datasets: Datasets;
  visStateActions: typeof VisStateActions;
  uiStateActions?: typeof UIStateActions;
  panelMetadata: PanelMeta;
  layers?: readonly Layer[];
  layerOrder?: LayerOrder;
  mapLegendActive?: boolean;
  mapInfo?: Partial<MapInfo>;
  mapInfoShow?: boolean;
  mapInfoActive?: boolean;
  mapState?: MapState;
  actionIcons?: {
    settings?: PanelHeaderActionIcon;
  };
  interactionConfigIcons?: {
    [key: string]: React.ElementType;
  };
};

InteractionManagerFactory.deps = [
  InteractionPanelFactory,
  PanelTitleFactory,
  LegendConfigFactory,
  ZoomOpacityConfigFactory,
  MapInfoConfigFactory
];

function InteractionManagerFactory(
  InteractionPanel: ReturnType<typeof InteractionPanelFactory>,
  PanelTitle: ReturnType<typeof PanelTitleFactory>,
  LegendConfig: ReturnType<typeof LegendConfigFactory>,
  ZoomOpacityConfig: ReturnType<typeof ZoomOpacityConfigFactory>,
  MapInfoConfig: ReturnType<typeof MapInfoConfigFactory>
) {
  const InteractionManager: React.FC<InteractionManagerProps> = ({
    interactionConfig,
    datasets,
    visStateActions,
    uiStateActions,
    panelMetadata,
    layers,
    layerOrder,
    mapLegendActive,
    mapInfo,
    mapInfoShow,
    mapInfoActive,
    mapState,
    actionIcons,
    interactionConfigIcons
  }) => {
    const {interactionConfigChange: onConfigChange, setColumnDisplayFormat} = visStateActions;
    const intl = useIntl();
    const mapInfoPanel = (
      <MapInfoConfig
        key="mapInfo"
        mapInfo={mapInfo}
        mapInfoShow={mapInfoShow}
        mapInfoActive={mapInfoActive}
        visStateActions={visStateActions}
        uiStateActions={uiStateActions}
        actionIcons={actionIcons}
      />
    );

    return (
      <div className="interaction-manager">
        <PanelTitle
          className="interaction-manager-title"
          title={intl.formatMessage({id: panelMetadata.label})}
        />
        {Object.keys(interactionConfig).map(key => {
          if (key === 'annotation') {
            return null;
          }
          if (key === 'legend') {
            return layers ? (
              <LegendConfig
                key={key}
                layers={layers}
                layerOrder={layerOrder}
                visStateActions={visStateActions}
                uiStateActions={uiStateActions}
                legendConfig={interactionConfig.legend}
                mapLegendActive={mapLegendActive}
                actionIcons={actionIcons}
              />
            ) : null;
          }
          if (key === 'zoomOpacity') {
            return layers ? (
              <ZoomOpacityConfig
                key={key}
                layers={layers}
                zoomOpacityConfig={interactionConfig.zoomOpacity}
                zoom={fadeOnZoomMarkerZoom(mapState)}
                visStateActions={visStateActions}
                actionIcons={actionIcons}
              />
            ) : null;
          }
          const panel = (
            <InteractionPanel
              key={key}
              datasets={datasets}
              config={interactionConfig[key]}
              onConfigChange={onConfigChange}
              setColumnDisplayFormat={setColumnDisplayFormat}
              actionIcons={actionIcons}
              interactionConfigIcons={interactionConfigIcons}
            />
          );
          if (key !== 'geocoder') {
            return panel;
          }
          return (
            <React.Fragment key="geocoder-and-map-info">
              {panel}
              {mapInfoPanel}
            </React.Fragment>
          );
        })}
        {interactionConfig.geocoder ? null : mapInfoPanel}
      </div>
    );
  };

  return InteractionManager;
}

export default InteractionManagerFactory;
