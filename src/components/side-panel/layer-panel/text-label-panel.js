// Copyright (c) 2021 Uber Technologies, Inc.
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
import PropTypes from 'prop-types';
import {FormattedMessage} from 'localization';

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

import {LAYER_TEXT_CONFIGS} from 'layers/layer-factory';
import FieldSelectorFactory from '../../common/field-selector';

TextLabelPanelFactory.deps = [RangeSliderFactory, LayerConfigGroupFactory, FieldSelectorFactory];
function TextLabelPanelFactory(RangeSlider, LayerConfigGroup, FieldSelector) {
  class TextLabelPanel extends Component {
    static propTypes = {
      fields: PropTypes.arrayOf(PropTypes.object),
      textLabel: PropTypes.arrayOf(PropTypes.object),
      updateLayerTextLabel: PropTypes.func.isRequired
    };

    render() {
      const {updateLayerTextLabel, textLabel, fields} = this.props;
      const currentFields = textLabel.map(tl => tl.field && tl.field.name).filter(d => d);
      return (
        <LayerConfigGroup label={'panel.text.label'} collapsible>
          <ConfigGroupCollapsibleHeader>
            <FieldSelector
              fields={fields}
              value={currentFields}
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
                    isRange={false}
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
                        setColor: v => updateLayerTextLabel(idx, 'color', v)
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
              <Button link onClick={val => updateLayerTextLabel(textLabel.length)}>
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
