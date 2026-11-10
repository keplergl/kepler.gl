// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {DONUT_COLORS, DonutLayer, DonutCategory} from '@kepler.gl/layers';
import {Field, LayerVisConfig} from '@kepler.gl/types';
import {Input} from '../../common/styled-components';
import FieldSelectorFactory from '../../common/field-selector';
import LayerConfigGroupFactory from './layer-config-group';
import VisConfigSliderFactory from './vis-config-slider';
import VisConfigSwitchFactory from './vis-config-switch';
import ColorSelectorFactory from './color-selector';

const StyledDonutConfigurator = styled.div`
  color: ${props => props.theme.textColor};
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  min-height: 36px;
  margin: 8px 0;
  background: ${props => props.theme.inputBgd};

  &:focus-within {
    box-shadow: ${props => props.theme.inputBoxShadowActive};
  }

  &:hover > button,
  &:focus-within > button {
    opacity: 1;
    pointer-events: auto;
  }

  > input[type='text'],
  .color-selector__selector {
    &,
    &:hover,
    &:focus,
    &:active {
      background: transparent;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }

  > input[type='text'] {
    flex: 1;
    min-width: 0;
    width: 0;
    padding: 4px 8px;
  }

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    flex: 0 0 28px;
    padding: 0;
    color: inherit;
    background: transparent;
    border: 0;
    border-radius: 0;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;

    &:hover {
      background: ${props => props.theme.inputBgdHover};
    }

    &:focus-visible {
      outline: 2px solid ${props => props.theme.textColor};
      outline-offset: -3px;
    }
  }
`;

const CategoryColorControl = styled.div`
  position: relative;
  flex-shrink: 0;

  .color-selector__selector {
    padding: 4px 8px;
  }
`;

type Props = {
  layer: DonutLayer;
  fields: Field[];
  onChange: (config: Partial<LayerVisConfig>) => void;
};

DonutLayerConfiguratorFactory.deps = [
  FieldSelectorFactory,
  LayerConfigGroupFactory,
  VisConfigSliderFactory,
  VisConfigSwitchFactory,
  ColorSelectorFactory
];

export default function DonutLayerConfiguratorFactory(
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  LayerConfigGroup: ReturnType<typeof LayerConfigGroupFactory>,
  VisConfigSlider: ReturnType<typeof VisConfigSliderFactory>,
  VisConfigSwitch: ReturnType<typeof VisConfigSwitchFactory>,
  ColorSelector: ReturnType<typeof ColorSelectorFactory>
) {
  return function DonutLayerConfigurator({layer, fields, onChange}: Props) {
    const intl = useIntl();
    const configuredCategories = layer.config.visConfig.composition?.categories;
    const categories = layer.getCategories().map(category => {
      // Keep draft labels verbatim; legends and tooltips use getCategories()'s fallback.
      const label = configuredCategories.find(item => item?.field === category.field)?.label;
      return typeof label === 'string' ? {...category, label} : category;
    });
    const setCategories = (next: DonutCategory[]) => onChange({composition: {categories: next}});
    const changeCategory = (index: number, change: Partial<DonutCategory>) =>
      setCategories(
        categories.map((category, i) => (i === index ? {...category, ...change} : category))
      );
    const numericFields = fields.filter(field => ['integer', 'real'].includes(field.type));
    const message = (key: string, field: string) =>
      intl.formatMessage({id: `layerVisConfigs.donut.${key}`}, {field});
    const settings = layer.visConfigSettings;
    const controls = {layer, onChange};
    return (
      <StyledDonutConfigurator>
        <LayerConfigGroup
          label="layerVisConfigs.donut.composition"
          description="layerVisConfigs.donut.description"
        >
          {categories.map((category, index) => (
            <CategoryRow key={category.field}>
              <CategoryColorControl role="group" aria-label={message('color', category.field)}>
                <ColorSelector
                  colorSets={[
                    {
                      selectedColor: category.color,
                      setColor: color => {
                        if (Array.isArray(color)) {
                          changeCategory(index, {color: [color[0], color[1], color[2]]});
                        }
                      }
                    }
                  ]}
                />
              </CategoryColorControl>
              <Input
                type="text"
                aria-label={message('label', category.field)}
                value={category.label}
                title={category.field}
                onChange={event => changeCategory(index, {label: event.target.value})}
              />
              <button
                type="button"
                aria-label={message('remove', category.field)}
                onClick={() => setCategories(categories.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </CategoryRow>
          ))}
          {categories.length < 6 ? (
            <FieldSelector
              fields={numericFields.filter(
                field => !categories.some(category => category.field === field.name)
              )}
              value={null}
              placeholder="layerVisConfigs.donut.addField"
              erasable={false}
              onSelect={selected => {
                const field = numericFields.find(
                  item =>
                    item.name ===
                    (typeof selected === 'string' ? selected : (selected as Field)?.name)
                );
                if (!field || categories.some(category => category.field === field.name)) return;
                const color =
                  DONUT_COLORS.find(
                    candidate =>
                      !categories.some(category =>
                        category.color.every((value, i) => value === candidate[i])
                      )
                  ) || DONUT_COLORS[categories.length];
                setCategories([
                  ...categories,
                  {field: field.name, label: field.displayName || field.name, color}
                ]);
              }}
            />
          ) : null}
          {categories.some(
            category => !numericFields.some(field => field.name === category.field)
          ) ? (
            <p role="alert">
              <FormattedMessage id="layerVisConfigs.donut.missingFields" />
            </p>
          ) : null}
        </LayerConfigGroup>
        <LayerConfigGroup label="layer.radius">
          <VisConfigSlider {...settings.radius} {...controls} />
          <VisConfigSlider
            {...settings.clusterRadius}
            {...controls}
            description="layerVisConfigs.donut.aggregationDescription"
          />
          <VisConfigSlider {...settings.opacity} {...controls} />
          <VisConfigSwitch {...settings.showTotal} {...controls} />
        </LayerConfigGroup>
      </StyledDonutConfigurator>
    );
  };
}
