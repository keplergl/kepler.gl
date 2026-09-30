// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {useIntl} from 'react-intl';

import {InteractionConfig, LayerOrder} from '@kepler.gl/types';
import {UIStateActions, VisStateActions} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';

import InteractionPanelFactory from './interaction-panel/interaction-panel';
import LegendConfigFactory from './interaction-panel/legend-config';
import PanelTitleFactory from './panel-title';
import {PanelHeaderActionIcon} from './panel-header-action';

import {PanelMeta} from './common/types';

type InteractionManagerProps = {
  interactionConfig: InteractionConfig;
  datasets: Datasets;
  visStateActions: typeof VisStateActions;
  uiStateActions?: typeof UIStateActions;
  panelMetadata: PanelMeta;
  layers?: readonly Layer[];
  layerOrder?: LayerOrder;
  mapLegendActive?: boolean;
  actionIcons?: {
    settings?: PanelHeaderActionIcon;
  };
  interactionConfigIcons?: {
    [key: string]: React.ElementType;
  };
};

InteractionManagerFactory.deps = [InteractionPanelFactory, PanelTitleFactory, LegendConfigFactory];

function InteractionManagerFactory(
  InteractionPanel: ReturnType<typeof InteractionPanelFactory>,
  PanelTitle: ReturnType<typeof PanelTitleFactory>,
  LegendConfig: ReturnType<typeof LegendConfigFactory>
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
    actionIcons,
    interactionConfigIcons
  }) => {
    const {interactionConfigChange: onConfigChange, setColumnDisplayFormat} = visStateActions;
    const intl = useIntl();

    return (
      <div className="interaction-manager">
        <PanelTitle
          className="interaction-manager-title"
          title={intl.formatMessage({id: panelMetadata.label})}
        />
        {Object.keys(interactionConfig).map(key =>
          key === 'legend' ? (
            layers ? (
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
            ) : null
          ) : (
            <InteractionPanel
              key={key}
              datasets={datasets}
              config={interactionConfig[key]}
              onConfigChange={onConfigChange}
              setColumnDisplayFormat={setColumnDisplayFormat}
              actionIcons={actionIcons}
              interactionConfigIcons={interactionConfigIcons}
            />
          )
        )}
      </div>
    );
  };

  return InteractionManager;
}

export default InteractionManagerFactory;
