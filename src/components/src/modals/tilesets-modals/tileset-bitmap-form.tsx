// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components';

import {validateUrl} from '@kepler.gl/common-utils';
import {DatasetType, BitmapDatasetMetadata, BitmapBounds} from '@kepler.gl/constants';

import {MetaResponse, DatasetCreationAttributes} from './common';
import {InputLight} from '../../common';

const TilesetInputContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(auto, auto);
  row-gap: 12px;
  font-size: 12px;
`;

const BoundsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const BoundsLabel = styled.label`
  font-size: 11px;
  color: ${props => props.theme.AZURE200};
  margin-bottom: 4px;
  display: block;
`;

const DropZone = styled.div<{isDragging: boolean}>`
  border: 2px dashed ${props => (props.isDragging ? props.theme.AZURE200 : props.theme.AZURE400)};
  border-radius: 4px;
  padding: 0 10px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  cursor: pointer;
  color: ${props => props.theme.AZURE200};
  font-size: 11px;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${props => props.theme.AZURE200};
  }
`;

const ImageSourceRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: end;
`;

const DropZoneWrapper = styled.div`
  position: relative;
`;

const ClearButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ffffff;
  border: 2px solid ${props => props.theme.AZURE400};
  border-radius: 50%;
  color: ${props => props.theme.AZURE200};
  cursor: pointer;
  font-size: 10px;
  line-height: 1;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 1;

  &:hover {
    border-color: ${props => props.theme.AZURE200};
  }
`;

type BitmapFormProps = {
  setResponse: (response: MetaResponse) => void;
};

export function getDatasetAttributesFromBitmap({
  name,
  imageUrl,
  bounds,
  isDataUri
}: {
  name: string;
  imageUrl: string;
  bounds: BitmapBounds;
  isDataUri?: boolean;
}): DatasetCreationAttributes {
  return {
    name,
    type: DatasetType.BITMAP,
    metadata: {
      imageUrl,
      bounds,
      isDataUri
    } as BitmapDatasetMetadata
  };
}

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/tiff'];

const TilesetBitmapForm: React.FC<BitmapFormProps> = ({setResponse}) => {
  const [layerName, setLayerName] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageDataUri, setImageDataUri] = useState<string>('');
  const [west, setWest] = useState<string>('-122.52');
  const [south, setSouth] = useState<string>('37.70');
  const [east, setEast] = useState<string>('-122.35');
  const [north, setNorth] = useState<string>('37.82');
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveImageUrl = imageDataUri || imageUrl;
  const isDataUri = Boolean(imageDataUri);

  const onLayerNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLayerName(event.target.value);
  }, []);

  const onImageUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = event.target.value;
      setImageUrl(newUrl);
      setImageDataUri('');
      setFileError(null);
      if (!layerName && validateUrl(newUrl)) {
        setLayerName('Bitmap Layer');
      }
    },
    [layerName]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setFileError('Unsupported image format. Use PNG, JPEG, GIF, WebP, or TIFF.');
        return;
      }

      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        setFileError('Image is too large (max 10MB).');
        return;
      }

      setFileError(null);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUri = reader.result as string;
        setImageDataUri(dataUri);
        setImageUrl('');
        if (!layerName) {
          setLayerName(file.name.replace(/\.[^.]+$/, ''));
        }
      };
      reader.onerror = () => {
        setFileError('Failed to read file.');
      };
      reader.readAsDataURL(file);
    },
    [layerName]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const onDropZoneClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onClearImage = useCallback(() => {
    setImageDataUri('');
    setImageUrl('');
    setFileError(null);
  }, []);

  // Update response whenever form state changes
  useEffect(() => {
    if (fileError) {
      setResponse({
        metadata: null,
        dataset: null,
        loading: false,
        error: new Error(fileError)
      });
      return;
    }

    const boundsValid =
      west !== '' &&
      south !== '' &&
      east !== '' &&
      north !== '' &&
      !isNaN(Number(west)) &&
      !isNaN(Number(south)) &&
      !isNaN(Number(east)) &&
      !isNaN(Number(north));

    if (layerName && effectiveImageUrl && boundsValid) {
      const bounds: BitmapBounds = [Number(west), Number(south), Number(east), Number(north)];
      const dataset = getDatasetAttributesFromBitmap({
        name: layerName,
        imageUrl: effectiveImageUrl,
        bounds,
        isDataUri
      });
      setResponse({
        metadata: {imagePreviewUrl: effectiveImageUrl},
        dataset,
        loading: false,
        error: null
      });
    } else {
      setResponse({
        metadata: effectiveImageUrl ? {imagePreviewUrl: effectiveImageUrl} : null,
        dataset: null,
        loading: false,
        error: null
      });
    }
  }, [setResponse, layerName, effectiveImageUrl, west, south, east, north, isDataUri, fileError]);

  return (
    <TilesetInputContainer>
      <div>
        <label htmlFor="bitmap-layer-name">Name</label>
        <InputLight
          id="bitmap-layer-name"
          placeholder="Name your bitmap layer"
          value={layerName}
          onChange={onLayerNameChange}
        />
      </div>

      <div>
        <label htmlFor="bitmap-url">Image source</label>
        <ImageSourceRow>
          <InputLight
            id="bitmap-url"
            placeholder="Image URL"
            value={imageUrl}
            onChange={onImageUrlChange}
            disabled={Boolean(imageDataUri)}
          />
          <DropZoneWrapper>
            {(imageDataUri || imageUrl) && (
              <ClearButton onClick={onClearImage} title="Clear image">✕</ClearButton>
            )}
            <DropZone
              isDragging={isDragging}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={onDropZoneClick}
            >
              {imageDataUri ? '✓ Local' : 'Drop / Select'}
            </DropZone>
          </DropZoneWrapper>
        </ImageSourceRow>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          style={{display: 'none'}}
          onChange={onFileInputChange}
        />
        {fileError && (
          <div style={{color: '#ff5a5a', fontSize: '11px', marginTop: '4px'}}>{fileError}</div>
        )}
      </div>

      <div>
        <label>Bounds</label>
        <BoundsGrid>
          <div>
            <BoundsLabel htmlFor="bitmap-west">West (min lng)</BoundsLabel>
            <InputLight
              id="bitmap-west"
              placeholder="-180"
              value={west}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWest(e.target.value)}
            />
          </div>
          <div>
            <BoundsLabel htmlFor="bitmap-east">East (max lng)</BoundsLabel>
            <InputLight
              id="bitmap-east"
              placeholder="180"
              value={east}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEast(e.target.value)}
            />
          </div>
          <div>
            <BoundsLabel htmlFor="bitmap-south">South (min lat)</BoundsLabel>
            <InputLight
              id="bitmap-south"
              placeholder="-90"
              value={south}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSouth(e.target.value)}
            />
          </div>
          <div>
            <BoundsLabel htmlFor="bitmap-north">North (max lat)</BoundsLabel>
            <InputLight
              id="bitmap-north"
              placeholder="90"
              value={north}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNorth(e.target.value)}
            />
          </div>
        </BoundsGrid>
      </div>
    </TilesetInputContainer>
  );
};

export default TilesetBitmapForm;
