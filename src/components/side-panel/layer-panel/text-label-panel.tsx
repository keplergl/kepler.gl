// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import {FormattedMessage} from '@kepler.gl/localization';

import {
  Button,
  PanelLabel,
  SBFlexboxItem,
  SidePanelSection,
  SpaceBetweenFlexbox
} from 'components/common/styled-components';
import {Add} from 'components/common/icons';
import ColorSelector from './color-selector';
import ItemSelector from 'components/common/item-selector/item-selector';
import LayerConfigGroupFactory, {
  ConfigGroupCollapsibleContent,
  ConfigGroupCollapsibleHeader
} from './layer-config-group';
import RangeSliderFactory from 'components/common/range-slider';

import FieldSelectorFactory from '../../common/field-selector';
import {Field} from 'utils/table-utils/kepler-table';
import {RGBColor, LayerTextLabel} from '@kepler.gl/types';
import {LAYER_TEXT_CONFIGS} from '@kepler.gl/constants';

type TextLabelPanelProps = {
  fields: Field[];
  textLabel: LayerTextLabel[];
  updateLayerTextLabel: (idx: number | 'all', prop: string, value: any) => void;
};

TextLabelPanelFactory.deps = [RangeSliderFactory, LayerConfigGroupFactory, FieldSelectorFactory];

function TextLabelPanelFactory(
  RangeSlider: ReturnType<typeof RangeSliderFactory>,
  LayerConfigGroup: ReturnType<typeof LayerConfigGroupFactory>,
  FieldSelector: ReturnType<typeof FieldSelectorFactory>
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
                        setColor: (v: RGBColor) => updateLayerTextLabel(idx, 'color', v)
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
