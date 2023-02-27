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

import React from 'react';
import styled from 'styled-components';
import PanelHeaderActionFactory from '../panel-header-action';
import LayerGroupItemFactory, {LayerGroupItemActionIcons} from './map-layer-group-item';
import {EyeSeen, EyeUnseen} from '../../common/icons';

import {PanelLabel, PanelContent} from '../../common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {VisibleLayerGroups} from '@kepler.gl/types';
import {Upload} from '@kepler.gl/cloud-providers';
import {
  THREE_D_BUILDING_LAYER_GROUP_SLUG,
  BACKGROUND_LAYER_GROUP_SLUG,
  DEFAULT_LAYER_GROUP
} from '@kepler.gl/constants';
import {
  MapConfigChangeUpdaterAction,
  Set3dBuildingColorUpdaterAction,
  SetBackgroundColorUpdaterAction
} from '@kepler.gl/actions';
import {MapStyle} from '@kepler.gl/reducers';

function noop() {}

const StyledInteractionPanel = styled.div`
  padding-bottom: 12px;
`;

export type LayerGroupSelectorProps = {
  layers: VisibleLayerGroups;
  editableLayers: DEFAULT_LAYER_GROUP[];
  onChange: (payload: MapConfigChangeUpdaterAction['payload']) => void;
  topLayers: MapStyle['topLayerGroups'];
  threeDBuildingColor: MapStyle['threeDBuildingColor'];
  on3dBuildingColorChange: (pd: Set3dBuildingColorUpdaterAction['payload']) => void;
  backgroundColor: MapStyle['backgroundColor'];
  onBackgroundColorChange: (pd: SetBackgroundColorUpdaterAction['payload']) => void;
  actionIcons?: LayerGroupItemActionIcons;
};

LayerGroupSelectorFactory.deps = [PanelHeaderActionFactory, LayerGroupItemFactory];

function LayerGroupSelectorFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>,
  LayerGroupItem: ReturnType<typeof LayerGroupItemFactory>
) {
  const defaultActionIcons: LayerGroupItemActionIcons = {
    visible: EyeSeen,
    hidden: EyeUnseen,
    top: Upload
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
