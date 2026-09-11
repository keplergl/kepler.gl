// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React, {useCallback, useEffect} from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Switch
} from '@sqlrooms/ui';
import {
  Resolution1024x768Option,
  Resolution1280x720Option,
  Resolution1280x960Option,
  Resolution1600x1200Option,
  Resolution1600x900Option,
  Resolution1920x1080Option,
  Resolution1920x1440Option,
  Resolution2560x1440Option
} from '@kepler.gl/constants';
import {ImagePreview} from '@kepler.gl/components';
import {dataURItoBlob, downloadFile} from '@kepler.gl/utils';
import {ExportImage} from '@kepler.gl/types';
import {Loader2} from 'lucide-react';

type ExportResolutionOption = ExportImage['resolution'];

export interface KeplerImageExportProps {
  setExportImageSetting: (settings: Partial<ExportImage>) => void;
  cleanupExportImage: () => void;
  exportImageSettings: ExportImage;
  fileName?: string;
  onExportStart?: () => void;
}

const CUSTOM_RESOLUTION_OPTIONS = [
  Resolution1280x720Option,
  Resolution1920x1080Option,
  Resolution2560x1440Option,
  Resolution1600x900Option,
  Resolution1024x768Option,
  Resolution1280x960Option,
  Resolution1600x1200Option,
  Resolution1920x1440Option
];

export const KeplerImageExport: React.FC<KeplerImageExportProps> = ({
  setExportImageSetting,
  cleanupExportImage,
  exportImageSettings,
  fileName,
  onExportStart
}) => {
  const {legend, resolution, processing, imageDataUri} = exportImageSettings;

  useEffect(() => {
    // hardcode default resolution only when incoming resolution is not a supported custom option
    const isSupportedResolution = CUSTOM_RESOLUTION_OPTIONS.some(
      option => option.id === resolution
    );
    if (!isSupportedResolution) {
      setExportImageSetting({
        resolution: Resolution1280x720Option.id
      });
    }
  }, [resolution, setExportImageSetting]);

  useEffect(() => {
    setExportImageSetting({
      exporting: true
    });
    return cleanupExportImage;
  }, [setExportImageSetting, cleanupExportImage]);

  const handleExportImage = useCallback(() => {
    if (!processing && imageDataUri) {
      onExportStart?.();
      const file = dataURItoBlob(imageDataUri);
      downloadFile(file, `${fileName || 'Untitled'}.png`);
    }
  }, [processing, imageDataUri, fileName, onExportStart]);

  const isPreviewReady = !processing && Boolean(imageDataUri);

  return (
    <div className="flex flex-col gap-6 px-[5px] pt-1 pb-5">
      <ImagePreview exportImage={exportImageSettings} />

      <div className="grid grid-cols-[100px_auto] items-center gap-4">
        <Label>Resolution</Label>
        <Select
          value={resolution}
          onValueChange={(value: ExportResolutionOption) =>
            setExportImageSetting({
              resolution: value
            })
          }
          disabled={processing}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select resolution" />
          </SelectTrigger>
          <SelectContent>
            {CUSTOM_RESOLUTION_OPTIONS.map(option => (
              <SelectItem
                key={option.id}
                value={option.id as ExportResolutionOption}
                disabled={!option.available}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label className="font-normal">Show legend</Label>
        <Switch
          checked={legend}
          onCheckedChange={checked =>
            setExportImageSetting({
              legend: checked === true
            })
          }
          disabled={processing}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="default"
          className="w-full"
          onClick={handleExportImage}
          disabled={processing || !isPreviewReady}
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            'Export Image'
          )}
        </Button>
      </div>
    </div>
  );
};
