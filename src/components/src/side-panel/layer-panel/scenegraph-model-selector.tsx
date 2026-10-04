// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, useRef, useState} from 'react';
import styled, {withTheme} from 'styled-components';

import {
  CUSTOM_SCENEGRAPH_MODEL_ID,
  DEFAULT_SCENEGRAPH_MODEL_ID,
  SCENEGRAPH_LAYER_MODELS,
  TRIP_LAYER_SCENEGRAPH_MODELS
} from '@kepler.gl/constants';
import type {ScenegraphModel} from '@kepler.gl/constants';
import {ScenegraphLayerIcon} from '@kepler.gl/layers';
import {FormattedMessage} from '@kepler.gl/localization';

import LayerTypeDropdownListFactory from './layer-type-dropdown-list';
import LayerTypeListItemFactory from './layer-type-list-item';
import ItemSelector from '../../common/item-selector/item-selector';
import Checkbox from '../../common/checkbox';
import {Button, Input, SidePanelSection} from '../../common/styled-components';
import {LayerTypeOption} from './layer-type-dropdown-list';

import AirplaneModelIcon from '../../common/icons/3d-models/airplane';
import BoeingModelIcon from '../../common/icons/3d-models/boeing';
import BicycleModelIcon from '../../common/icons/3d-models/bicycle';
import CargoshipModelIcon from '../../common/icons/3d-models/cargoship';
import CarModelIcon from '../../common/icons/3d-models/car';
import EvtolModelIcon from '../../common/icons/3d-models/evtol';
import GliderModelIcon from '../../common/icons/3d-models/glider';
import HelicopterModelIcon from '../../common/icons/3d-models/helicopter';
import TruckModelIcon from '../../common/icons/3d-models/truck';
import SemitruckModelIcon from '../../common/icons/3d-models/semitruck';
import ScooterModelIcon from '../../common/icons/3d-models/scooter';

const EmptyIcon = () => <></>;

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  'default-model': ScenegraphLayerIcon,
  airplane: AirplaneModelIcon,
  boeing777: BoeingModelIcon,
  'uber-evtol': EvtolModelIcon,
  'hang-glider': GliderModelIcon,
  helicopter: HelicopterModelIcon,
  bicycle: BicycleModelIcon,
  scooter: ScooterModelIcon,
  car: CarModelIcon,
  truck: TruckModelIcon,
  semitruck: SemitruckModelIcon,
  cargoship: CargoshipModelIcon
};

export function getScenegraphModelOptions(
  models: ScenegraphModel[] = TRIP_LAYER_SCENEGRAPH_MODELS
) {
  return models.map(model => ({
    ...model,
    icon: ICON_MAP[model.id] || EmptyIcon
  }));
}

const SCENEGRAPH_MODEL_OPTIONS = getScenegraphModelOptions();

export const SCENEGRAPH_3D_MODEL_OPTIONS = getScenegraphModelOptions(SCENEGRAPH_LAYER_MODELS);

const getDisplayOption = op => op.label;
const getOptionValue = op => op.id;

type ModelSource = 'model' | 'url' | 'file';

export type ScenegraphModelSelectorProps = {
  selected: string;
  customModelUrl?: string;
  onChange: (visConfig: {scenegraph: string; scenegraphCustomModelUrl?: string}) => void;
  options?: LayerTypeOption[];
  disabled?: boolean;
  theme: any;
};

ScenegraphModelSelectorFactory.deps = [LayerTypeListItemFactory, LayerTypeDropdownListFactory];

function isLocalModelUrl(url: string): boolean {
  return url.startsWith('blob:') || url.startsWith('data:');
}

function initialGalleryId(options: LayerTypeOption[], selected: string): string {
  if (options.some(option => option.id === selected)) {
    return selected;
  }
  if (options.some(option => option.id === DEFAULT_SCENEGRAPH_MODEL_ID)) {
    return DEFAULT_SCENEGRAPH_MODEL_ID;
  }
  return options[0]?.id || '';
}

function ScenegraphModelSelectorFactory(
  LayerTypeListItem: ReturnType<typeof LayerTypeListItemFactory>,
  LayerTypeDropdownList: ReturnType<typeof LayerTypeDropdownListFactory>
) {
  const ScenegraphModelSelector: React.FC<ScenegraphModelSelectorProps> = ({
    selected,
    customModelUrl = '',
    options = SCENEGRAPH_MODEL_OPTIONS,
    disabled,
    onChange
  }) => {
    const galleryOptions = useMemo(
      () => options.filter(option => option.id !== CUSTOM_SCENEGRAPH_MODEL_ID),
      [options]
    );
    const isGallerySelection = galleryOptions.some(option => option.id === selected);
    const [source, setSource] = useState<ModelSource>(
      isGallerySelection ? 'model' : isLocalModelUrl(customModelUrl) ? 'file' : 'url'
    );
    const [galleryId, setGalleryId] = useState(() => initialGalleryId(galleryOptions, selected));
    const [url, setUrl] = useState(isLocalModelUrl(customModelUrl) ? '' : customModelUrl);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const objectUrlRef = useRef<string | null>(
      isLocalModelUrl(customModelUrl) ? customModelUrl : null
    );

    const activeGalleryId = isGallerySelection ? selected : galleryId;
    const selectedItems = galleryOptions.find(option => option.id === activeGalleryId);

    const selectSource = (next: ModelSource) => {
      if (disabled || next === source) {
        return;
      }
      setSource(next);
      if (next === 'model') {
        onChange({scenegraph: activeGalleryId});
        return;
      }
      onChange({
        scenegraph: CUSTOM_SCENEGRAPH_MODEL_ID,
        scenegraphCustomModelUrl: next === 'file' ? objectUrlRef.current || '' : url
      });
    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) {
        return;
      }
      if (objectUrlRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      setFileName(file.name);
      setSource('file');
      onChange({
        scenegraph: CUSTOM_SCENEGRAPH_MODEL_ID,
        scenegraphCustomModelUrl: objectUrl
      });
    };

    return (
      <SidePanelSection disabled={disabled}>
        <SourceList>
          <Checkbox
            type="radio"
            name="scenegraph-model-source"
            id="scenegraph-model-source-model"
            checked={source === 'model'}
            label={<FormattedMessage id="layer.3DModelSourceModel" />}
            onChange={() => selectSource('model')}
          />
          <ModelDropdown
            className="layer-config__type"
            $active={source === 'model'}
            onMouseDown={() => {
              if (source !== 'model') {
                selectSource('model');
              }
            }}
          >
            <ItemSelector
              selectedItems={selectedItems}
              options={galleryOptions}
              disabled={disabled}
              multiSelect={false}
              placeholder="placeholder.selectType"
              onChange={id => {
                const scenegraph = galleryOptions.find(option => option.id === id);
                if (!scenegraph) {
                  return;
                }
                setGalleryId(scenegraph.id);
                setSource('model');
                onChange({scenegraph: scenegraph.id});
              }}
              getOptionValue={getOptionValue}
              filterOption="label"
              displayOption={getDisplayOption}
              DropDownLineItemRenderComponent={LayerTypeListItem}
              DropDownRenderComponent={LayerTypeDropdownList}
              DropDownWrapperComponent={ModelMenuFrame}
            />
          </ModelDropdown>
          <Checkbox
            type="radio"
            name="scenegraph-model-source"
            id="scenegraph-model-source-url"
            checked={source === 'url'}
            label={<FormattedMessage id="layer.3DModelSourceUrl" />}
            onChange={() => selectSource('url')}
          />
          <SourceControl>
            <SourceInput
              type="text"
              value={url}
              $active={source === 'url'}
              onMouseDown={() => {
                if (source !== 'url') {
                  selectSource('url');
                }
              }}
              onChange={({target: {value}}) => setUrl(value)}
              onBlur={event => {
                if (source === 'url') {
                  onChange({
                    scenegraph: CUSTOM_SCENEGRAPH_MODEL_ID,
                    scenegraphCustomModelUrl: event.target.value
                  });
                }
              }}
              placeholder={'http://...'}
            />
          </SourceControl>
          <Checkbox
            type="radio"
            name="scenegraph-model-source"
            id="scenegraph-model-source-file"
            checked={source === 'file'}
            label={<FormattedMessage id="layer.3DModelSourceFile" />}
            onChange={() => selectSource('file')}
          />
          <SourceControl>
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
              style={{display: 'none'}}
              onChange={onFileChange}
            />
            <FileButton
              type="button"
              secondary
              small
              $active={source === 'file'}
              title={fileName || undefined}
              onClick={() => {
                if (source !== 'file') {
                  selectSource('file');
                  return;
                }
                fileInputRef.current?.click();
              }}
            >
              <FileButtonLabel>
                {fileName ? fileName : <FormattedMessage id="layer.3DModelFile" />}
              </FileButtonLabel>
            </FileButton>
          </SourceControl>
        </SourceList>
      </SidePanelSection>
    );
  };

  return withTheme(ScenegraphModelSelector) as React.FC<
    Omit<ScenegraphModelSelectorProps, 'theme'>
  >;
}

const SourceList = styled.div`
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: 10px;
  row-gap: 8px;
  align-items: center;
`;

const ModelDropdown = styled.div<{$active?: boolean}>`
  min-width: 0;
  opacity: ${props => (props.$active ? 1 : 0.5)};
  cursor: pointer;

  .item-selector .item-selector__dropdown {
    padding: 4px 10px 4px 10px;
  }
`;

const ModelMenuFrame = styled.div<{width?: number}>`
  border: 0;
  z-index: ${props => props.theme.dropdownWrapperZ};
  width: ${props => (props.width || 0) + 10}px;
`;

const SourceControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const SourceInput = styled(Input)<{$active?: boolean}>`
  && {
    opacity: ${props => (props.$active ? 1 : 0.5)};
    cursor: ${props => (props.$active ? 'text' : 'pointer')};
  }
`;

const FileButton = styled(Button)<{$active?: boolean}>`
  && {
    width: 100%;
    height: ${props => props.theme.inputBoxHeight};
    box-sizing: border-box;
    overflow: hidden;
    padding-top: 0;
    padding-bottom: 0;
    opacity: ${props => (props.$active ? 1 : 0.4)};
    cursor: pointer;
    pointer-events: auto;
  }
`;

const FileButtonLabel = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  max-width: 100%;
`;

export default ScenegraphModelSelectorFactory;
