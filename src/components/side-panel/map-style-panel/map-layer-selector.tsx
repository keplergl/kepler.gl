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

import React, {ComponentType} from 'react';
import styled from 'styled-components';
import PanelHeaderActionFactory from 'components/side-panel/panel-header-action';
import {EyeSeen, EyeUnseen, Upload} from 'components/common/icons';

import {
  PanelLabel,
  PanelContent,
  PanelLabelBold,
  PanelLabelWrapper,
  CenterFlexbox
} from 'components/common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {camelize} from '@kepler.gl/utils';
import {VisibleLayerGroups} from 'reducers';
import {BaseProps} from 'components/common/icons/base';

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

interface LayerLabelProps {
  active: boolean;
}

const LayerLabel = styled(PanelLabelBold)<LayerLabelProps>`
  color: ${props => (props.active ? props.theme.textColor : props.theme.labelColor)};
`;

type LayerGroupSelectorProps = {
  layers: VisibleLayerGroups;
  editableLayers: string[];
  onChange: (payload: {
    visibleLayerGroups?: VisibleLayerGroups;
    topLayerGroups?: VisibleLayerGroups;
  }) => void;
  topLayers: VisibleLayerGroups;
  actionIcons?: Record<string, ComponentType<Partial<BaseProps>>>;
};

LayerGroupSelectorFactory.deps = [PanelHeaderActionFactory];

function LayerGroupSelectorFactory(PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>) {
  const defaultActionIcons = {
    visible: EyeSeen,
    hidden: EyeUnseen
  };
  const LayerGroupSelector = ({
    layers,
    editableLayers,
    onChange,
    topLayers,
    actionIcons = defaultActionIcons
  }: LayerGroupSelectorProps) => (
    <StyledInteractionPanel className="map-style__layer-group__selector">
      <div className="layer-group__header">
        <PanelLabel>
          <FormattedMessage id={'mapLayers.title'} />
        </PanelLabel>
      </div>
      <PanelContent className="map-style__layer-group">
        {editableLayers.map(slug => (
          <StyledLayerGroupItem className="layer-group__select" key={slug}>
            <PanelLabelWrapper>
              <PanelHeaderAction
                className="layer-group__visibility-toggle"
                id={`${slug}-toggle`}
                tooltip={layers[slug] ? 'tooltip.hide' : 'tooltip.show'}
                onClick={() =>
                  onChange({
                    visibleLayerGroups: {
                      ...layers,
                      [slug]: !layers[slug]
                    }
                  })
                }
                IconComponent={layers[slug] ? actionIcons.visible : actionIcons.hidden}
                active={layers[slug]}
                flush
              />
              <LayerLabel active={layers[slug]}>
                <FormattedMessage id={`mapLayers.${camelize(slug)}`} />
              </LayerLabel>
            </PanelLabelWrapper>
            <CenterFlexbox className="layer-group__bring-top">
              <PanelHeaderAction
                id={`${slug}-top`}
                tooltip="tooltip.moveToTop"
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
