import React from 'react';
import {type FC} from 'react';
import {KeplerSidePanels} from '@kepler.gl/sqlrooms';
import {RoomPanel} from '@sqlrooms/room-shell';
import {useCurrentMap} from './useCurrentMap';

export const KeplerSidePanelLayerManager: FC = () => {
  const currentMap = useCurrentMap();

  return (
    <RoomPanel>
      <KeplerSidePanels panelId="layer" mapId={currentMap?.id || ''} />
    </RoomPanel>
  );
};

export const KeplerSidePanelFilterManager: FC = () => {
  const currentMap = useCurrentMap();

  return (
    <RoomPanel>
      <KeplerSidePanels panelId="filter" mapId={currentMap?.id || ''} />
    </RoomPanel>
  );
};

export const KeplerSidePanelBaseMapManager: FC = () => {
  const currentMap = useCurrentMap();

  return (
    <RoomPanel>
      <KeplerSidePanels panelId="map" mapId={currentMap?.id || ''} />
    </RoomPanel>
  );
};

export const KeplerSidePanelInteractionManager: FC = () => {
  const currentMap = useCurrentMap();

  return (
    <RoomPanel>
      <KeplerSidePanels panelId="interaction" mapId={currentMap?.id || ''} />
    </RoomPanel>
  );
};
