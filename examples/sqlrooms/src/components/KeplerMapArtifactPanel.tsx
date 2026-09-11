import React from 'react';
import {RoomPanelComponent} from '@sqlrooms/room-shell';
import {KeplerMapContainer, KeplerPlotContainer} from '@kepler.gl/sqlrooms';

export const KeplerMapArtifactPanel: RoomPanelComponent = ({meta, panelId}) => {
  const mapId = (meta?.artifactId as string | undefined) ?? panelId;

  if (!mapId) {
    return null;
  }

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col">
      <div className="relative min-h-0 flex-1">
        <KeplerMapContainer mapId={mapId} />
      </div>
      <KeplerPlotContainer mapId={mapId} logoComponent={null} />
    </div>
  );
};
