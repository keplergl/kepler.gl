import React from 'react';
import {ArtifactTabs} from '@sqlrooms/artifacts';
import {KeplerImageExport, KeplerProvider, useKeplerStateActions} from '@kepler.gl/sqlrooms';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input
} from '@sqlrooms/ui';
import {PencilIcon, Trash2Icon, UploadIcon} from 'lucide-react';
import {FC, useCallback, useEffect, useState} from 'react';
import {useRoomStore} from '../store';

const ExportImageDialogContent: FC<{mapId: string; fileName: string}> = ({mapId, fileName}) => {
  const {keplerActions, keplerState} = useKeplerStateActions({mapId});
  const exportImageSettings = keplerState?.uiState?.exportImage;

  if (!exportImageSettings) {
    return null;
  }

  return (
    <KeplerProvider mapId={mapId}>
      <KeplerImageExport
        fileName={fileName}
        exportImageSettings={exportImageSettings}
        setExportImageSetting={keplerActions.uiStateActions.setExportImageSetting}
        cleanupExportImage={keplerActions.uiStateActions.cleanupExportImage}
      />
    </KeplerProvider>
  );
};

export const KeplerMapsContainer: FC = () => {
  const maps = useRoomStore(state => state.kepler.config.maps);
  const [mapToDelete, setMapToDelete] = useState<string | null>(null);
  const [mapToExport, setMapToExport] = useState<string | null>(null);
  const [mapToRename, setMapToRename] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleRenameRequest = useCallback((mapId: string, name: string) => {
    setMapToRename({id: mapId, name});
  }, []);

  return (
    <ArtifactTabs
      types={['kepler-map']}
      panelKey="artifact"
      className="bg-muted items-center pt-1"
      preventCloseLastTab
      renderSearchItemActions={(tab, actions) => (
        <>
          <ArtifactTabs.SearchItemAction
            icon={<PencilIcon className="h-3 w-3" />}
            aria-label={`Rename ${tab.name}`}
            onClick={() => handleRenameRequest(tab.id, tab.name)}
          />
          {actions.tabs.length > 1 && (
            <ArtifactTabs.SearchItemAction
              icon={<Trash2Icon className="h-3 w-3" />}
              aria-label={`Delete ${tab.name}`}
              onClick={() => setMapToDelete(tab.id)}
            />
          )}
        </>
      )}
      renderTabMenu={(tab, actions) => (
        <>
          <ArtifactTabs.MenuItem onClick={() => setMapToExport(tab.id)}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Export map
          </ArtifactTabs.MenuItem>
          <ArtifactTabs.MenuSeparator />
          <ArtifactTabs.MenuItem onClick={() => handleRenameRequest(tab.id, tab.name)}>
            <PencilIcon className="mr-2 h-4 w-4" />
            Rename
          </ArtifactTabs.MenuItem>
          {actions.tabs.length > 1 && (
            <>
              <ArtifactTabs.MenuSeparator />
              <ArtifactTabs.MenuItem variant="destructive" onClick={() => setMapToDelete(tab.id)}>
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete map
              </ArtifactTabs.MenuItem>
            </>
          )}
        </>
      )}
      overlay={
        <KeplerMapDialogs
          mapToDelete={mapToDelete}
          mapToExport={mapToExport}
          mapToRename={mapToRename}
          onClearDelete={() => setMapToDelete(null)}
          onClearExport={() => setMapToExport(null)}
          onClearRename={() => setMapToRename(null)}
        />
      }
    >
      <ArtifactTabs.SearchDropdown
        sortSearchItems="recent"
        getTabLastOpenedAt={tab => maps.find(map => map.id === tab.id)?.lastOpenedAt}
      />
      <ArtifactTabs.Tabs />
      <ArtifactTabs.NewButton artifactType="kepler-map" aria-label="Create new map" />
    </ArtifactTabs>
  );
};

function KeplerMapDialogs({
  mapToDelete,
  mapToExport,
  mapToRename,
  onClearDelete,
  onClearExport,
  onClearRename
}: {
  mapToDelete: string | null;
  mapToExport: string | null;
  mapToRename: {id: string; name: string} | null;
  onClearDelete: () => void;
  onClearExport: () => void;
  onClearRename: () => void;
}) {
  const artifactTabs = ArtifactTabs.useActions();
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    setRenameValue(mapToRename?.name ?? '');
  }, [mapToRename]);

  const mapToDeleteData = mapToDelete
    ? artifactTabs.tabs.find(tab => tab.id === mapToDelete)
    : null;
  const mapToExportData = mapToExport
    ? artifactTabs.tabs.find(tab => tab.id === mapToExport)
    : null;

  const handleDeleteMap = useCallback(() => {
    if (mapToDelete) {
      artifactTabs.deleteArtifact(mapToDelete);
    }
    onClearDelete();
  }, [artifactTabs, mapToDelete, onClearDelete]);

  const handleConfirmRename = useCallback(() => {
    if (mapToRename && renameValue.trim()) {
      artifactTabs.renameArtifact(mapToRename.id, renameValue.trim());
    }
    onClearRename();
  }, [artifactTabs, mapToRename, onClearRename, renameValue]);

  return (
    <>
      <Dialog open={mapToDelete !== null} onOpenChange={open => !open && onClearDelete()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Map</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{mapToDeleteData?.name}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onClearDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMap}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={mapToExport !== null} onOpenChange={open => !open && onClearExport()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Map as Image</DialogTitle>
          </DialogHeader>
          {mapToExportData && (
            <ExportImageDialogContent mapId={mapToExportData.id} fileName={mapToExportData.name} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={mapToRename !== null} onOpenChange={open => !open && onClearRename()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Map</DialogTitle>
            <DialogDescription>Enter a new name for the map.</DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            placeholder="Enter map name"
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleConfirmRename();
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={onClearRename}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRename} disabled={!renameValue.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
