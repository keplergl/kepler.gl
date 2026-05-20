// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {Component} from 'react';
import {FormattedMessage} from '@kepler.gl/localization';
import {Field, LayerTextLabel} from '@kepler.gl/types';

import {
  PanelLabel,
  SBFlexboxItem,
  SidePanelSection,
  SpaceBetweenFlexbox
} from '../../common/styled-components';
import ColorSelectorFactory from './color-selector';
import ItemSelector from '../../common/item-selector/item-selector';
import LayerConfigGroupFactory, {ConfigGroupCollapsibleContent} from './layer-config-group';
import RangeSliderFactory from '../../common/range-slider';

import {LAYER_TEXT_CONFIGS} from '@kepler.gl/constants';
import {DEFAULT_TEXT_LABEL_BG_COLOR} from '@kepler.gl/layers';
import FieldSelectorFactory from '../../common/field-selector';
import TooltipChickletFactory from '../interaction-panel/tooltip-config/tooltip-chicklet';
import styled from 'styled-components';

TextLabelTooltipPanelFactory.deps = [
  RangeSliderFactory,
  LayerConfigGroupFactory,
  FieldSelectorFactory,
  ColorSelectorFactory,
  TooltipChickletFactory
];

const TooltipConfigWrapper = styled.div`
  .item-selector > div > div {
    overflow: visible;
  }
`;

const nop = () => {};

export type TextLabelTooltipPanelProps = {
  dataId: string;
  fields: Field[];
  textLabel: LayerTextLabel[];
  updateLayerTextLabel: (idx: number | 'all', prop: string, value: any) => void;
};

function TextLabelTooltipPanelFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>,
  LayerConfigGroup: ReturnType<typeof LayerConfigGroupFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  ColorSelector: ReturnType<typeof ColorSelectorFactory>
): React.ComponentType<TextLabelTooltipPanelProps> {
  class TextLabelTooltipPanel extends Component<TextLabelTooltipPanelProps> {
    handleSelectedFieldsChange = fields => {
      const {textLabel} = this.props;
      this.props.updateLayerTextLabel(
        0,
        'field',
        fields.map(f => ({
          field: f,
          format: (textLabel[0].field || []).find(tf => tf.field === f)?.format ?? ''
        }))
      );
    };

    getCurrentFields = () => {
      const {textLabel} = this.props;
      return (textLabel[0].field || []).filter(f => f?.field?.name).map(f => f.field);
    };

    getCurrentFieldFormats = () => {
      const {textLabel} = this.props;
      return (textLabel[0].field || [])
        .filter(f => f?.field?.name)
        .map(f => ({
          name: f.field.name,
          format: f.format
        }));
    };

    handleFormatChange = ({fieldsToShow}) => {
      const {dataId} = this.props;
      const fieldFormats = fieldsToShow[dataId];
      const currentFields = this.getCurrentFields();
      const nextFields = fieldFormats.map(({name, format}) => {
        return {field: currentFields.find(f => f.name === name), format};
      });
      this.props.updateLayerTextLabel(0, 'field', nextFields);
    };

    render() {
      const {updateLayerTextLabel, textLabel, fields, dataId} = this.props;
      const currentFields = this.getCurrentFields();
      const currentFieldNames = currentFields.map(field => field?.name);
      return (
        <LayerConfigGroup label={'panel.text.label'} collapsible>
          <TooltipConfigWrapper>
            <FieldSelector
              fields={fields}
              value={currentFieldNames}
              onSelect={this.handleSelectedFieldsChange}
              closeOnSelect={false}
              multiSelect
              inputTheme="secondary"
              CustomChickletComponent={TooltipChickletFactory(
                dataId,
                {
                  fieldsToShow: {[dataId]: this.getCurrentFieldFormats()},
                  compareMode: false,
                  compareType: null
                },
                this.handleFormatChange,
                fields,
                nop
              )}
            />
          </TooltipConfigWrapper>
          <ConfigGroupCollapsibleContent>
            <div>
              <SidePanelSection>
                <PanelLabel>
                  <FormattedMessage id="panel.text.fontSize" />
                </PanelLabel>
                <RangeSlider
                  {...LAYER_TEXT_CONFIGS.fontSize}
                  value1={textLabel[0].size}
                  isRanged={false}
                  onChange={v => updateLayerTextLabel(0, 'size', v[1])}
                />
              </SidePanelSection>
              <SidePanelSection>
                <PanelLabel>
                  <FormattedMessage id="panel.text.fontColor" />
                </PanelLabel>
                <ColorSelector
                  colorSets={[
                    {
                      selectedColor: textLabel[0].color,
                      setColor: v => updateLayerTextLabel(0, 'color', v)
                    }
                  ]}
                />
              </SidePanelSection>
              <SidePanelSection>
                <PanelLabel>
                  <FormattedMessage id="panel.text.backgroundColor" />
                </PanelLabel>
                <ColorSelector
                  colorSets={[
                    {
                      selectedColor: textLabel[0].backgroundColor ?? DEFAULT_TEXT_LABEL_BG_COLOR,
                      setColor: v => updateLayerTextLabel(0, 'backgroundColor', v)
                    }
                  ]}
                />
              </SidePanelSection>
              <SidePanelSection>
                <SpaceBetweenFlexbox>
                  <SBFlexboxItem>
                    <PanelLabel>
                      <FormattedMessage id="panel.text.textAnchor" />
                    </PanelLabel>
                    <ItemSelector
                      {...LAYER_TEXT_CONFIGS.textAnchor}
                      selectedItems={textLabel[0].anchor}
                      onChange={val => updateLayerTextLabel(0, 'anchor', val)}
                    />
                  </SBFlexboxItem>
                  <SBFlexboxItem>
                    <PanelLabel>
                      <FormattedMessage id="panel.text.alignment" />
                    </PanelLabel>
                    <ItemSelector
                      {...LAYER_TEXT_CONFIGS.textAlignment}
                      selectedItems={textLabel[0].alignment}
                      onChange={val => updateLayerTextLabel(0, 'alignment', val)}
                    />
                  </SBFlexboxItem>
                </SpaceBetweenFlexbox>
              </SidePanelSection>
            </div>
          </ConfigGroupCollapsibleContent>
        </LayerConfigGroup>
      );
    }
  }

  return TextLabelTooltipPanel;
}

export default TextLabelTooltipPanelFactory;
