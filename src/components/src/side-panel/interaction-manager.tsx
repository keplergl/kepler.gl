// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {useIntl} from 'react-intl';

import {InteractionConfig, LayerOrder} from '@kepler.gl/types';
import {UIStateActions, VisStateActions} from '@kepler.gl/actions';
import {Datasets} from '@kepler.gl/table';
import {Layer} from '@kepler.gl/layers';

import InteractionPanelFactory from './interaction-panel/interaction-panel';
import LegendConfig from './interaction-panel/legend-config';
import PanelTitleFactory from './panel-title';

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
    settings?: React.ElementType;
  };
  interactionConfigIcons?: {
    [key: string]: React.ElementType;
  };
};

InteractionManagerFactory.deps = [InteractionPanelFactory, PanelTitleFactory];

function InteractionManagerFactory(
  InteractionPanel: ReturnType<typeof InteractionPanelFactory>,
  PanelTitle: ReturnType<typeof PanelTitleFactory>
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
    // Legend sits after Tooltip; other sections keep their configured order.
    const interactionKeys = Object.keys(interactionConfig).filter(key => key !== 'legend');
    const tooltipIndex = interactionKeys.indexOf('tooltip');
    const legendInsertAt = tooltipIndex === -1 ? interactionKeys.length : tooltipIndex + 1;

    const legendPanel = layers ? (
      <LegendConfig
        layers={layers}
        layerOrder={layerOrder}
        visStateActions={visStateActions}
        uiStateActions={uiStateActions}
        legendConfig={interactionConfig.legend}
        mapLegendActive={mapLegendActive}
        actionIcons={actionIcons}
      />
    ) : null;

    return (
      <div className="interaction-manager">
        <PanelTitle
          className="interaction-manager-title"
          title={intl.formatMessage({id: panelMetadata.label})}
        />
        {interactionKeys.map((key, index) => (
          <React.Fragment key={key}>
            <InteractionPanel
              datasets={datasets}
              config={interactionConfig[key]}
              onConfigChange={onConfigChange}
              setColumnDisplayFormat={setColumnDisplayFormat}
              actionIcons={actionIcons}
              interactionConfigIcons={interactionConfigIcons}
            />
            {index + 1 === legendInsertAt ? legendPanel : null}
          </React.Fragment>
        ))}
        {interactionKeys.length === 0 ? legendPanel : null}
      </div>
    );
  };

  return InteractionManager;
}

export default InteractionManagerFactory;
