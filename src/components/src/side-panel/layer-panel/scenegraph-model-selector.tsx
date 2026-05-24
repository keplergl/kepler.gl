// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useMemo, useState} from 'react';
import styled, {withTheme} from 'styled-components';

import {TRIP_LAYER_SCENEGRAPH_MODELS} from '@kepler.gl/constants';

import LayerTypeDropdownListFactory from './layer-type-dropdown-list';
import LayerTypeListItemFactory from './layer-type-list-item';
import ItemSelector from '../../common/item-selector/item-selector';
import {Input, SidePanelSection} from '../../common/styled-components';
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

const SCENEGRAPH_MODEL_OPTIONS = TRIP_LAYER_SCENEGRAPH_MODELS.map(m => ({
  ...m,
  icon: ICON_MAP[m.id] || EmptyIcon
}));

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
    const selectedItems = useMemo(() => options.find(op => op.id === selected), [
      options,
      selected
    ]);

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
              const scenegraph = SCENEGRAPH_MODEL_OPTIONS.find(d => d.id === id);
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

type ScenegraphCustomModelUrlInputProps = {
  customModelUrl: string;
  onChange: (url: string) => void;
};

export const ScenegraphCustomModelUrlInput: React.FC<ScenegraphCustomModelUrlInputProps> = ({
  customModelUrl,
  onChange
}: ScenegraphCustomModelUrlInputProps) => {
  const [url, setUrl] = useState(customModelUrl || '');
  return (
    <Input
      type="text"
      value={url}
      onChange={({target: {value}}) => setUrl(value)}
      onBlur={() => onChange(url)}
      placeholder={'http://...'}
    />
  );
};

export default ScenegraphModelSelectorFactory;
