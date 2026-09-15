// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React, {useState, useEffect, useCallback} from 'react';

import {S3FileBrowser, S3CredentialsForm, S3BrowserState} from '@sqlrooms/s3-browser';
import {S3FileOrDirectory, S3Config, S3Credentials} from '@sqlrooms/s3-browser';
import {ChevronLeft} from 'lucide-react';
import {DialogFooter, Button, Spinner, Alert, AlertDescription} from '@sqlrooms/ui';

export type KeplerS3BrowserProps = {
  listS3Files: (args: {s3Config: S3Config; prefix: string}) => Promise<S3FileOrDirectory[]>;
  loadS3Files: (args: {s3Config: S3Config; prefix: string; files: string[]}) => Promise<void>;
  s3Browser: S3BrowserState['s3Browser'];
  saveS3Credentials: (s3Config: S3Config) => Promise<void>;
  loadS3Credentials: () => Promise<S3Credentials[]>;
  deleteS3Credentials: (id: string) => Promise<void>;
};
export const KeplerS3Browser = ({
  listS3Files,
  s3Browser,
  loadS3Files,
  saveS3Credentials,
  loadS3Credentials,
  deleteS3Credentials
}: KeplerS3BrowserProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<S3FileOrDirectory[] | null>(null);
  const [selectedDirectory, onChangeSelectedDirectory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const {setCurrentS3Config, clearCurrentS3Config, currentS3Config} = s3Browser;

  const listFiles = useCallback(
    async (s3Config: S3Config, prefix: string) => {
      try {
        const files = await listS3Files({
          s3Config,
          prefix
        });
        setCurrentS3Config(s3Config);
        setFiles(files);
        setError('');
        onChangeSelectedDirectory(prefix);
      } catch (error) {
        setError((error as Error).message);
      }
      setIsConnecting(false);
    },
    [listS3Files, setCurrentS3Config, setFiles, setIsConnecting, setError]
  );
  const handleLoadFiles = useCallback(async () => {
    if (!currentS3Config) return;
    await loadS3Files({
      s3Config: currentS3Config,
      prefix: selectedDirectory,
      files: selectedFiles
    });
  }, [loadS3Files, currentS3Config, selectedFiles, selectedDirectory]);

  // Load files on mount if there's a saved S3 config (restore previous session)
  // Intentional mount-only effect; state updates are async after data fetch
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (currentS3Config) {
      listFiles(currentS3Config, '');
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const onSelectDirectory = useCallback(
    (directory: string) => {
      if (!currentS3Config) return;
      setIsConnecting(true);
      listFiles(currentS3Config, directory);
    },
    [currentS3Config, setIsConnecting, listFiles]
  );

  const onConnect = useCallback(
    (values: S3Config) => {
      setIsConnecting(true);
      listFiles(values, '');
    },
    [listFiles]
  );
  const onBack = useCallback(() => {
    setIsConnecting(false);
    setFiles(null);
    setSelectedFiles([]);
    onChangeSelectedDirectory('');
    clearCurrentS3Config();
  }, [
    setIsConnecting,
    setFiles,
    setSelectedFiles,
    clearCurrentS3Config,
    onChangeSelectedDirectory
  ]);
  return (
    <div className="flex h-full flex-col items-center gap-4">
      {/* Connection Panel */}
      {!files ? (
        <>
          {error ? (
            <div className="flex w-full justify-center px-4">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          ) : null}
          <S3CredentialsForm
            onConnect={onConnect}
            isLoading={isConnecting}
            saveS3Credentials={saveS3Credentials}
            loadS3Credentials={loadS3Credentials}
            deleteS3Credentials={deleteS3Credentials}
            onInputChange={() => setError('')}
          />
        </>
      ) : files.length ? (
        <div className="flex h-full w-full flex-col items-start justify-start gap-2">
          <S3FileBrowser
            files={files}
            selectedFiles={selectedFiles}
            selectedDirectory={selectedDirectory}
            onChangeSelectedFiles={setSelectedFiles}
            onChangeSelectedDirectory={onSelectDirectory}
            onCanConfirmChange={() => undefined}
            renderFileActions={() => (
              <div className="flex w-full items-center justify-between px-2 text-xs">
                <Button variant="link" className="h-6 px-1 py-0" onClick={onBack}>
                  <ChevronLeft size={16} />
                  Disconnect
                </Button>
                <div className="flex items-center gap-1">
                  {isConnecting ? (
                    <div className="text-muted-foreground">
                      <Spinner className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Connected to</div>
                  )}

                  <b>{currentS3Config?.bucket}</b>
                </div>
              </div>
            )}
          />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">No files found</p>
        </div>
      )}

      {/* Footer */}
      <DialogFooter className="mt-6 w-full justify-end">
        {files?.length ? (
          <Button disabled={!selectedFiles.length} type="submit" onClick={handleLoadFiles}>
            Add Selected
          </Button>
        ) : null}
      </DialogFooter>
    </div>
  );
};
