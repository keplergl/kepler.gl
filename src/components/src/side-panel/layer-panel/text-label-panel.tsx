// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {ColorRange} from '@kepler.gl/constants';
import {FormattedMessage} from '@kepler.gl/localization';
import React, {Component} from 'react';
import styled from 'styled-components';

import {Add} from '../../common/icons';
import ItemSelector from '../../common/item-selector/item-selector';
import RangeSliderFactory from '../../common/range-slider';
import {
  Button,
  PanelLabel,
  SBFlexboxItem,
  SidePanelSection,
  SpaceBetweenFlexbox
} from '../../common/styled-components';
import Switch from '../../common/switch';
import LayerConfigGroupFactory, {
  ConfigGroupCollapsibleContent,
  ConfigGroupCollapsibleHeader
} from './layer-config-group';

import {LAYER_TEXT_CONFIGS} from '@kepler.gl/constants';
import {Field, LayerTextLabel, RGBAColor, RGBColor} from '@kepler.gl/types';
import FieldSelectorFactory from '../../common/field-selector';
import ColorSelectorFactory from './color-selector';

const SwitchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 11px;
  margin-bottom: 8px;
`;

type TextLabelPanelProps = {
  id?: string;
  fields: Field[];
  textLabel: LayerTextLabel[];
  updateLayerTextLabel: (idx: number | 'all', prop: string, value: any) => void;
};

TextLabelPanelFactory.deps = [
  RangeSliderFactory,
  LayerConfigGroupFactory,
  FieldSelectorFactory,
  ColorSelectorFactory
];

function TextLabelPanelFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>,
  LayerConfigGroup: ReturnType<typeof LayerConfigGroupFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>,
  ColorSelector: ReturnType<typeof ColorSelectorFactory>
): React.ComponentType<TextLabelPanelProps> {
  class TextLabelPanel extends Component<TextLabelPanelProps> {
    render() {
      const {updateLayerTextLabel, textLabel, fields} = this.props;
      const currentFields = textLabel.map(tl => tl.field && tl.field.name).filter(d => Boolean(d));

      return (
        <LayerConfigGroup label={'panel.text.label'} collapsible>
          <ConfigGroupCollapsibleHeader>
            <FieldSelector
              fields={fields}
              value={currentFields as string[]}
              onSelect={selected => updateLayerTextLabel('all', 'fields', selected)}
              multiSelect
            />
          </ConfigGroupCollapsibleHeader>
          <ConfigGroupCollapsibleContent>
            {textLabel.map((tl, idx) => (
              <div key={tl.field ? tl.field.name : `null-${idx}`}>
                <PanelLabel>
                  <FormattedMessage id={'panel.text.labelWithId'} values={{labelId: idx + 1}} />
                </PanelLabel>
                <SidePanelSection>
                  <FieldSelector
                    fields={fields}
                    value={(tl.field && tl.field.name) || 'placeholder.selectField'}
                    placeholder={'placeholder.empty'}
                    onSelect={v => updateLayerTextLabel(idx, 'field', v)}
                    erasable
                  />
                </SidePanelSection>
                <SidePanelSection>
                  <PanelLabel>
                    <FormattedMessage id="panel.text.fontSize" />
                  </PanelLabel>
                  <RangeSlider
                    {...LAYER_TEXT_CONFIGS.fontSize}
                    value1={tl.size}
                    isRanged={false}
                    onChange={v => updateLayerTextLabel(idx, 'size', v[1])}
                  />
                </SidePanelSection>
                <SidePanelSection>
                  <PanelLabel>
                    <FormattedMessage id="panel.text.fontColor" />
                  </PanelLabel>
                  <ColorSelector
                    colorSets={[
                      {
                        selectedColor: tl.color,
                        setColor: (v: RGBColor | RGBAColor | ColorRange) =>
                          updateLayerTextLabel(idx, 'color', v)
                      }
                    ]}
                  />
                </SidePanelSection>

                <SidePanelSection>
                  <PanelLabel>
                    <FormattedMessage id="panel.text.outlineWidth" />
                  </PanelLabel>
                  <RangeSlider
                    {...LAYER_TEXT_CONFIGS.outlineWidth}
                    value1={tl.outlineWidth}
                    isRanged={false}
                    onChange={v => updateLayerTextLabel(idx, 'outlineWidth', v[1])}
                  />
                </SidePanelSection>
                <SidePanelSection>
                  <PanelLabel>
                    <FormattedMessage id="panel.text.outlineColor" />
                  </PanelLabel>
                  <ColorSelector
                    colorSets={[
                      {
                        selectedColor: tl.outlineColor,
                        setColor: v => updateLayerTextLabel(idx, 'outlineColor', v)
                      }
                    ]}
                    useOpacity={true}
                  />
                </SidePanelSection>

                <SidePanelSection>
                  <SwitchWrapper>
                    <PanelLabel>
                      <FormattedMessage id="panel.text.backgroundColor" />
                    </PanelLabel>
                    <Switch
                      checked={tl.background}
                      id={`${this.props.id}-textBackgroundEnabled-${idx}`}
                      onChange={() => updateLayerTextLabel(idx, 'background', !tl.background)}
                    />
                  </SwitchWrapper>

                  <ColorSelector
                    colorSets={[
                      {
                        selectedColor: tl.backgroundColor,
                        setColor: v => updateLayerTextLabel(idx, 'backgroundColor', v)
                      }
                    ]}
                    useOpacity={true}
                    disabled={!tl.background}
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
                        selectedItems={tl.anchor}
                        onChange={val => updateLayerTextLabel(idx, 'anchor', val)}
                      />
                    </SBFlexboxItem>
                    <SBFlexboxItem>
                      <PanelLabel>
                        <FormattedMessage id="panel.text.alignment" />
                      </PanelLabel>
                      <ItemSelector
                        {...LAYER_TEXT_CONFIGS.textAlignment}
                        selectedItems={tl.alignment}
                        onChange={val => updateLayerTextLabel(idx, 'alignment', val)}
                      />
                    </SBFlexboxItem>
                  </SpaceBetweenFlexbox>
                </SidePanelSection>
              </div>
            ))}
            <SidePanelSection>
              <Button link onClick={() => updateLayerTextLabel(textLabel.length, '', null)}>
                <Add height="12px" />
                <FormattedMessage id="panel.text.addMoreLabel" />
              </Button>
            </SidePanelSection>
          </ConfigGroupCollapsibleContent>
        </LayerConfigGroup>
      );
    }
  }

  return TextLabelPanel;
}

export default TextLabelPanelFactory;
