// Copyright (c) 2023 Uber Technologies, Inc.
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
import PanelHeaderActionFactory from '../panel-header-action';
import LayerGroupItemFactory from './map-layer-group-item';
import {EyeSeen, EyeUnseen} from '../../common/icons';

import {
  CenterFlexbox,
  PanelLabel,
  PanelContent,
  PanelLabelWrapper
} from '../../common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {THREE_D_BUILDING_LAYER_GROUP_SLUG, BACKGROUND_LAYER_GROUP_SLUG} from '@kepler.gl/constants';
import {VisibleLayerGroups} from '@kepler.gl/types';
import {BaseProps} from '../../common/icons';
import {Upload} from '@kepler.gl/cloud-providers';

function noop() {}

const StyledInteractionPanel = styled.div`
  padding-bottom: 12px;
`;

export type LayerGroupSelectorProps = {
  layers: VisibleLayerGroups;
  editableLayers: string[];
  onChange: (payload: {
    visibleLayerGroups?: VisibleLayerGroups;
    topLayerGroups?: VisibleLayerGroups;
  }) => void;
  topLayers: VisibleLayerGroups;
  threeDBuildingColor: MapStyle['threeDBuildingColor'];
  on3dBuildingColorChange: (pd: Set3dBuildingColorUpdaterAction['payload']) => void;
  backgroundColor: MapStyle['backgroundColor'];
  onBackgroundColorChange: (pd: SetBackgroundColorUpdaterAction['payload']) => void;
  actionIcons?: Record<string, ComponentType<Partial<BaseProps>>>;
};

LayerGroupSelectorFactory.deps = [PanelHeaderActionFactory, LayerGroupItemFactory];

function LayerGroupSelectorFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>,
  LayerGroupItem
) {
  const defaultActionIcons = {
    visible: EyeSeen,
    hidden: EyeUnseen
  };
  const LayerGroupSelector = ({
    layers,
    editableLayers,
    onChange,
    topLayers,
    threeDBuildingColor,
    on3dBuildingColorChange,
    backgroundColor,
    onBackgroundColorChange,
    actionIcons = defaultActionIcons
  }: LayerGroupSelectorProps) => {
    return (
      <StyledInteractionPanel className="map-style__layer-group__selector">
        <div className="layer-group__header">
          <PanelLabel>
            <FormattedMessage id={'mapLayers.title'} />
          </PanelLabel>
        </div>
        <PanelContent className="map-style__layer-group">
          {editableLayers.map(
            ({slug, isVisibilityToggleAvailable, isMoveToTopAvailable, isColorPickerAvailable}) => (
              <LayerGroupItem
                key={slug}
                PanelHeaderAction={PanelHeaderAction}
                onChange={onChange}
                slug={slug}
                layers={layers}
                topLayers={topLayers}
                actionIcons={actionIcons}
                isVisibilityToggleAvailable={isVisibilityToggleAvailable}
                isMoveToTopAvailable={isMoveToTopAvailable}
                isColorPickerAvailable={isColorPickerAvailable}
                color={
                  isColorPickerAvailable && slug === THREE_D_BUILDING_LAYER_GROUP_SLUG
                    ? threeDBuildingColor
                    : slug === BACKGROUND_LAYER_GROUP_SLUG
                    ? backgroundColor
                    : null
                }
                onColorChange={
                  isColorPickerAvailable && slug === THREE_D_BUILDING_LAYER_GROUP_SLUG
                    ? on3dBuildingColorChange
                    : slug === BACKGROUND_LAYER_GROUP_SLUG
                    ? onBackgroundColorChange
                    : noop
                }
              />
            )
          )}
        </PanelContent>
      </StyledInteractionPanel>
    );
  };

  return LayerGroupSelector;
}

export default LayerGroupSelectorFactory;
