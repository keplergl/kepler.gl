// Copyright (c) 2019 Uber Technologies, Inc.
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

import {
  PanelLabel,
  SidePanelSection,
  SpaceBetweenFlexbox,
  SBFlexboxItem,
  Button
} from 'components/common/styled-components';
import {Add} from 'components/common/icons';
import ColorSelector from './color-selector';
import FieldSelector from 'components/common/field-selector';
import ItemSelector from 'components/common/item-selector/item-selector';
import LayerConfigGroup, {
  ConfigGroupCollapsibleContent
} from './layer-config-group';
import RangeSlider from 'components/common/range-slider';

import {LAYER_TEXT_CONFIGS, DEFAULT_TEXT_LABEL} from 'layers/layer-factory';

export default class TextLabelPanel extends Component {
  static propTypes = {
    layerConfiguratorProps: PropTypes.object.isRequired,
    textLabel: PropTypes.array,
    visConfiguratorProps: PropTypes.object.isRequired
  };

  onAttributeChange = (idx, attribute) => {
    const {layerConfiguratorProps, textLabel} = this.props;

    return v =>
      layerConfiguratorProps.onChange({
        textLabel: textLabel.map((tl, i) =>
          i === idx
            ? {
                ...tl,
                [attribute]: v
              }
            : tl
        )
      });
  };

  onChangeTextAnchor = (idx, anchor) => {
    const {layerConfiguratorProps, textLabel} = this.props;

    // TODO: we can be smarter on determining the offset of the text
    layerConfiguratorProps.onChange({
      textLabel: textLabel.map((tl, i) =>
        i === idx
          ? {
              ...tl,
              anchor,
              // offset: [
              //   anchor === 'start' ? 10 : anchor === 'end' ? -10 : 0,
              //   anchor === 'middle' ? 10 : 0
              // ]
            }
          : tl
      )
    });
  };

  onClickAdd = () => {
    const {layerConfiguratorProps, textLabel} = this.props;

    layerConfiguratorProps.onChange({
      textLabel: [
        ...textLabel,
        DEFAULT_TEXT_LABEL
      ]
    });
  }

  render() {
    const {visConfiguratorProps, textLabel} = this.props;
    const textLabels = Array.isArray(textLabel) ? textLabel : [textLabel];
    return (
      <LayerConfigGroup label={'label'} collapsible>
        <SidePanelSection>
          {textLabels.map((tl, idx) => (
            <FieldSelector
              key={tl.field ? tl.field.name : 'null'}
              fields={visConfiguratorProps.fields}
              value={(tl.field && tl.field.name) || 'select a field'}
              placeholder={'empty'}
              onSelect={this.onAttributeChange(idx, 'field')}
              erasable
            />
          ))}
        </SidePanelSection>
        <ConfigGroupCollapsibleContent>
          {textLabels.map((tl, idx) => (
            <div key={tl.field ? tl.field.name : 'null'}>
              <SidePanelSection>
                <PanelLabel>{`Font size`}</PanelLabel>
                <RangeSlider
                  {...LAYER_TEXT_CONFIGS.fontSize}
                  value1={tl.size}
                  onChange={v => this.onAttributeChange(idx, 'size')(v[1])}
                />
              </SidePanelSection>
              <SidePanelSection>
                <PanelLabel>{`Font color`}</PanelLabel>
                <ColorSelector
                  colorSets={[
                    {
                      selectedColor: tl.color,
                      setColor: this.onAttributeChange(idx, 'color')
                    }
                  ]}
                />
              </SidePanelSection>
              <SidePanelSection>
                <SpaceBetweenFlexbox>
                  <SBFlexboxItem>
                    <PanelLabel>{`Text anchor`}</PanelLabel>
                    <ItemSelector
                      {...LAYER_TEXT_CONFIGS.textAnchor}
                      selectedItems={tl.anchor}
                      onChange={val => this.onChangeTextAnchor(idx, val)}
                    />
                  </SBFlexboxItem>
                  <SBFlexboxItem>
                    <PanelLabel>{`Alignment`}</PanelLabel>
                    <ItemSelector
                      {...LAYER_TEXT_CONFIGS.textAlignment}
                      selectedItems={tl.alignment}
                      onChange={this.onAttributeChange(idx, 'alignment')}
                    />
                  </SBFlexboxItem>
                </SpaceBetweenFlexbox>
              </SidePanelSection>
            </div>
          ))}
          <SidePanelSection>
            <Button link onClick={this.onClickAdd}>
              <Add height="12px" />
              Add More Label
            </Button>
          </SidePanelSection>
        </ConfigGroupCollapsibleContent>
      </LayerConfigGroup>
    );
  }
}
