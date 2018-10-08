// Copyright (c) 2018 Uber Technologies, Inc.
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

import {PanelLabel} from 'components/common/styled-components';
import ColorSelector from './color-selector';
import FieldSelector from 'components/common/field-selector';
import ItemSelector from 'components/common/item-selector/item-selector';
import LayerConfigGroup from './layer-config-group';
import RangeSlider from 'components/common/range-slider';

import {LAYER_TEXT_CONFIGS} from 'layers/layer-factory';

export default class LayerConfigurator extends Component {
  static propTypes = {
    layerConfiguratorProps: PropTypes.object.isRequired,
    textLabel: PropTypes.object.isRequired,
    visConfiguratorProps: PropTypes.object.isRequired
  };

  onAttributeChange = attribute => {
    const {layerConfiguratorProps, textLabel} = this.props;
    return v => layerConfiguratorProps.onChange({
      textLabel: {
        ...textLabel,
        [attribute]: v
      }
    });
  };

  onChangeTextAnchor = anchor => {
    const {layerConfiguratorProps, textLabel} = this.props;
    // TODO: we can be smarter on determining the offset of the text
    layerConfiguratorProps.onChange({
      textLabel: {
        ...textLabel,
        anchor,
        offset: [
          anchor === 'start' ? 10 : anchor === 'end' ? -10 : 0,
          anchor === 'middle' ? 10 : 0
        ]
      }
    });
  };

  render() {
    const {
      visConfiguratorProps,
      textLabel
    } = this.props;
    return (
      <LayerConfigGroup label={'text'}>
        <PanelLabel>{`Show text label based on`}</PanelLabel>
          <FieldSelector
            fields={visConfiguratorProps.fields}
            value={textLabel.field && textLabel.field.name || 'select a field'}
            placeholder={'empty'}
            onSelect={this.onAttributeChange('field')}
            erasable
          />
          <PanelLabel>{`Font size`}</PanelLabel>
          <RangeSlider
            {...LAYER_TEXT_CONFIGS.fontSize}
            value1={textLabel.size}
            onChange={v => this.onAttributeChange('size')(v[1])}
          />
          <PanelLabel>{`Font color`}</PanelLabel>
          <ColorSelector
            colorSets={[
              {
                selectedColor: textLabel.color,
                setColor: this.onAttributeChange('color')
              }
            ]}
          />
          <PanelLabel>{`Text anchor`}</PanelLabel>
          <ItemSelector
            {...LAYER_TEXT_CONFIGS.textAnchor}
            selectedItems={textLabel.anchor}
            onChange={this.onChangeTextAnchor}
          />
      </LayerConfigGroup>
    );
  }
}
