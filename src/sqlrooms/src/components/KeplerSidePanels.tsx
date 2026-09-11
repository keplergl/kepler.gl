// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React from 'react';
import {DndContextFactory} from '@kepler.gl/components';
import {useKeplerStateActions} from '../hooks/useKeplerStateActions';
import {KeplerProvider} from './KeplerProvider';
import {getKeplerFactory} from './KeplerInjector';
import {CustomLayerManager} from './CustomLayerManager';
import {CustomFilterManager} from './CustomFilterManager';
import {CustomMapManager} from './CustomMapManager';
import {CustomInteractionManager} from './CustomInteractionManager';

const DndContext = getKeplerFactory(DndContextFactory);

type KeplerSidePanelProps = {
  mapId: string;
  panelId: 'layer' | 'filter' | 'interaction' | 'map';
  showDeleteDataset?: boolean;
};
export const KeplerSidePanels: React.FC<KeplerSidePanelProps> = ({
  mapId,
  panelId,
  showDeleteDataset
}) => {
  const {keplerState} = useKeplerStateActions({mapId});

  if (!keplerState?.visState) {
    return null;
  }
  return (
    <KeplerProvider mapId={mapId}>
      <DndContext visState={keplerState?.visState}>
        <div>
          {panelId === 'layer' && (
            <CustomLayerManager mapId={mapId} showDeleteDataset={showDeleteDataset} />
          )}
          {panelId === 'filter' && (
            <CustomFilterManager mapId={mapId} showDeleteDataset={showDeleteDataset} />
          )}
          {panelId === 'map' && <CustomMapManager mapId={mapId} />}
          {panelId === 'interaction' && <CustomInteractionManager mapId={mapId} />}
        </div>
      </DndContext>
    </KeplerProvider>
  );
};
