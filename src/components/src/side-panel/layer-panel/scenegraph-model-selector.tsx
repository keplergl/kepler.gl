// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, useRef, useState} from 'react';
import styled, {withTheme} from 'styled-components';

import {SCENEGRAPH_LAYER_MODELS, TRIP_LAYER_SCENEGRAPH_MODELS} from '@kepler.gl/constants';
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

const StyledScenegraphModelSelector = styled.div`
  .item-selector .item-selector__dropdown {
    padding: 4px 10px 4px 10px;
  }
`;

const getDisplayOption = op => op.label;
const getOptionValue = op => op.id;

export type ScenegraphModelSelectorProps = {
  selected: string;
  onSelect: (scenegraph: {id: string; angles: number[]}) => void;
  options?: LayerTypeOption[];
  disabled?: boolean;
  theme: any;
};

ScenegraphModelSelectorFactory.deps = [LayerTypeListItemFactory, LayerTypeDropdownListFactory];

function ScenegraphModelSelectorFactory(
  LayerTypeListItem: ReturnType<typeof LayerTypeListItemFactory>,
  LayerTypeDropdownList: ReturnType<typeof LayerTypeDropdownListFactory>
) {
  const ScenegraphModelSelector: React.FC<ScenegraphModelSelectorProps> = ({
    selected,
    options = SCENEGRAPH_MODEL_OPTIONS,
    disabled,
    onSelect
  }) => {
    const selectedItems = useMemo(
      () => options.find(op => op.id === selected),
      [options, selected]
    );

    return (
      <SidePanelSection>
        <StyledScenegraphModelSelector className="layer-config__type">
          <ItemSelector
            selectedItems={selectedItems}
            options={options}
            disabled={disabled}
            multiSelect={false}
            placeholder="placeholder.selectType"
            onChange={id => {
              const scenegraph = options.find(d => d.id === id);
              if (scenegraph) {
                onSelect(scenegraph);
              }
            }}
            getOptionValue={getOptionValue}
            filterOption="label"
            displayOption={getDisplayOption}
            DropDownLineItemRenderComponent={LayerTypeListItem}
            DropDownRenderComponent={LayerTypeDropdownList}
          />
        </StyledScenegraphModelSelector>
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

type CustomModelSource = 'url' | 'file';

type ScenegraphCustomModelUrlInputProps = {
  customModelUrl: string;
  onChange: (url: string) => void;
};

function isLocalModelUrl(url: string): boolean {
  return url.startsWith('blob:') || url.startsWith('data:');
}

export const ScenegraphCustomModelUrlInput: React.FC<ScenegraphCustomModelUrlInputProps> = ({
  customModelUrl,
  onChange
}: ScenegraphCustomModelUrlInputProps) => {
  const initialUrl = customModelUrl || '';
  const initialIsFile = isLocalModelUrl(initialUrl);
  const [source, setSource] = useState<CustomModelSource>(initialIsFile ? 'file' : 'url');
  const [url, setUrl] = useState(initialIsFile ? '' : initialUrl);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(initialIsFile ? initialUrl : null);

  const selectSource = (next: CustomModelSource) => {
    if (next === source) {
      return;
    }
    setSource(next);
    onChange(next === 'file' ? objectUrlRef.current || '' : url);
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
    onChange(objectUrl);
  };

  return (
    <SourceList>
      <Checkbox
        type="radio"
        name="scenegraph-custom-model-source"
        id="scenegraph-custom-model-url"
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
              onChange(event.target.value);
            }
          }}
          placeholder={'http://...'}
        />
      </SourceControl>
      <Checkbox
        type="radio"
        name="scenegraph-custom-model-source"
        id="scenegraph-custom-model-file"
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
  );
};

export default ScenegraphModelSelectorFactory;
