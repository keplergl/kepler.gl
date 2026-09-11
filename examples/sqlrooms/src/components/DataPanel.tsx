import React from 'react';
import {RoomPanel} from '@sqlrooms/room-shell';
import {SchemaExplorer} from '@sqlrooms/sql-editor';
import {FileDropzone} from '@sqlrooms/dropzone';
import {useRoomStore} from '../store';
import {toast} from '@sqlrooms/ui';
import type {FC} from 'react';

export const DataPanel: FC = () => {
  const addFile = useRoomStore(state => state.addFile);
  return (
    <RoomPanel>
      <FileDropzone
        className="h-50 p-5"
        acceptedFormats={{
          'text/csv': ['.csv'],
          'text/tsv': ['.tsv'],
          'text/parquet': ['.parquet'],
          'text/json': ['.json'],
          'application/geo+json': ['.geojson']
        }}
        onDrop={async files => {
          for (const file of files) {
            try {
              const addedTable = await addFile(file);
              toast.success('Table created', {
                description: `File ${file.name} loaded as ${addedTable}`
              });
            } catch (error) {
              toast.error('Error', {
                description: `Error loading file ${file.name}: ${error}`
              });
            }
          }
        }}
      >
        <div className="text-muted-foreground text-xs">
          Files you add will stay local to your browser.
        </div>
      </FileDropzone>
      <SchemaExplorer>
        <SchemaExplorer.Header>
          <SchemaExplorer.RefreshButton />
        </SchemaExplorer.Header>
        <SchemaExplorer.Tree className="h-full" />
      </SchemaExplorer>
    </RoomPanel>
  );
};
