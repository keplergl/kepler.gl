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

import React from 'react';
import styled from 'styled-components';
import PanelHeaderAction from 'components/side-panel/panel-header-action';
import {EyeSeen, EyeUnseen, Upload} from 'components/common/icons';

import {
  PanelLabel,
  PanelContent,
  PanelLabelBold,
  PanelLabelWrapper,
  CenterFlexbox
} from 'components/common/styled-components';

const StyledInteractionPanel = styled.div`
  padding-bottom: 12px;
`;

const StyledLayerGroupItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;

  &:last-child {
    margin-bottom: 0;
  }

  .layer-group__visibility-toggle {
    margin-right: 12px;
  }
`;

const LayerLabel = styled(PanelLabelBold)`
  color: ${props =>
    props.active ? props.theme.textColor : props.theme.labelColor};
`;

function LayerGroupSelectorFactory() {
  const LayerGroupSelector = ({layers, editableLayers, onChange, topLayers}) => (
    <StyledInteractionPanel className="map-style__layer-group__selector">
      <div className="layer-group__header">
        <PanelLabel>Map Layers</PanelLabel>
      </div>
      <PanelContent className="map-style__layer-group">
        {editableLayers.map(slug => (
          <StyledLayerGroupItem className="layer-group__select" key={slug}>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id={`${slug}-toggle`}
                tooltip={layers[slug] ? 'hide' : 'show'}
                onClick={() =>
                  onChange({
                    visibleLayerGroups: {
                      ...layers,
                      [slug]: !layers[slug]
                    }
                  })
                }
                IconComponent={layers[slug] ? EyeSeen : EyeUnseen}
                active={layers[slug]}
                flush
              />
              <LayerLabel active={layers[slug]}>{slug}</LayerLabel>
            </PanelLabelWrapper>
            <CenterFlexbox className="layer-group__bring-top">
              <PanelHeaderAction
                id={`${slug}-top`}
                tooltip="Move to top of data layers"
                disabled={!layers[slug]}
                IconComponent={Upload}
                active={topLayers[slug]}
                onClick={() =>
                  onChange({
                    topLayerGroups: {
                      ...topLayers,
                      [slug]: !topLayers[slug]
                    }
                  })
                }
              />
            </CenterFlexbox>
          </StyledLayerGroupItem>
        ))}
      </PanelContent>
    </StyledInteractionPanel>
  );

  return LayerGroupSelector;
}

export default LayerGroupSelectorFactory;
