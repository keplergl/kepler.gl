// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React from 'react';
import {useCallback, useMemo} from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  UseDisclosureReturnValue
} from '@sqlrooms/ui';

import {LoadTileSetFactory} from '@kepler.gl/components';

import {getKeplerFactory} from './KeplerInjector';
import {KeplerProvider} from './KeplerProvider';
import {useIntl} from 'react-intl';

const LoadTileSet = getKeplerFactory(LoadTileSetFactory);

export type LoadTileSet = (args: {
  tileset: {name: string; type: string; metadata: Record<string, any>};
  metadata?: Record<string, any>;
}) => Promise<void>;

function LoadTileSetContent({
  loadTileSet,
  onClose
}: {
  loadTileSet: LoadTileSet;
  onClose?: () => void;
}) {
  const intl = useIntl();
  const onTilesetAdded = useCallback(
    (
      tileset: {name: string; type: string; metadata: Record<string, any>},
      metadata?: Record<string, any>
    ) => {
      loadTileSet({tileset, metadata});
      onClose?.();
    },
    [loadTileSet, onClose]
  );
  const meta = useMemo(() => ({}), []); // TODO: add metadata
  return (
    <LoadTileSet meta={meta} isAddingDatasets={false} intl={intl} onTilesetAdded={onTilesetAdded} />
  );
}

export function KeplerAddTileSetDialog({
  tileSetModal,
  loadTileSet
}: {
  tileSetModal: Pick<UseDisclosureReturnValue, 'isOpen' | 'onClose'>;
  loadTileSet: LoadTileSet;
}) {
  return (
    <KeplerProvider mapId={''}>
      <Dialog
        open={tileSetModal.isOpen}
        onOpenChange={(isOpen: boolean) => !isOpen && tileSetModal.onClose()}
      >
        <DialogContent className="h-[60vh] max-w-[75vw]">
          <DialogHeader>
            <DialogTitle>Add Tileset</DialogTitle>
            <DialogDescription>
              Add a tileset to your map. Supported: PMTiles, Vector Tiles, and Raster Tiles.
            </DialogDescription>
          </DialogHeader>
          <LoadTileSetContent loadTileSet={loadTileSet} onClose={tileSetModal.onClose} />
        </DialogContent>
      </Dialog>
    </KeplerProvider>
  );
}
