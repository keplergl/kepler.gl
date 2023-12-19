// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import styled from 'styled-components';

import {FormattedMessage} from '@kepler.gl/localization';
import {camelize} from '@kepler.gl/utils';
import {RGBColor} from '@kepler.gl/types';
import {MapConfigChangeUpdaterAction} from '@kepler.gl/actions';
import {MapStyle} from '@kepler.gl/reducers';

import LayerGroupColorPickerFactory from './map-layer-group-color-picker';
import {PanelHeaderActionProps, PanelHeaderActionIcon} from '../panel-header-action';
import {PanelLabelBold, CenterFlexbox, PanelLabelWrapper} from '../../common/styled-components';

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

const LayerLabel = styled(PanelLabelBold)<{active: boolean}>`
  color: ${props => (props.active ? props.theme.textColor : props.theme.labelColor)};
`;

export type LayerGroupItemActionIcons = {
  visible: PanelHeaderActionIcon;
  hidden: PanelHeaderActionIcon;
  top: PanelHeaderActionIcon;
};

export type LayerGroupItemProps = {
  PanelHeaderAction: React.FC<PanelHeaderActionProps>;
  onChange: (pd: MapConfigChangeUpdaterAction['payload']) => void;
  slug: string;
  layers: MapStyle['visibleLayerGroups'];
  topLayers: MapStyle['topLayerGroups'];
  actionIcons: LayerGroupItemActionIcons;
  color: RGBColor | null;
  onColorChange: (pd: RGBColor) => void;
  isVisibilityToggleAvailable?: boolean;
  isMoveToTopAvailable?: boolean;
  isColorPickerAvailable?: boolean;
};

LayerGroupItemFactory.deps = [LayerGroupColorPickerFactory];

function LayerGroupItemFactory(LayerGroupColorPicker) {
  const LayerGroupItem: React.FC<LayerGroupItemProps> = ({
    PanelHeaderAction,
    onChange,
    slug,
    layers,
    topLayers,
    actionIcons,
    color,
    onColorChange,
    isVisibilityToggleAvailable = true,
    isMoveToTopAvailable = true,
    isColorPickerAvailable = false
  }) => {
    const onVisibilityToggle = useCallback(() => {
      onChange({
        visibleLayerGroups: {
          ...layers,
          [slug]: !layers[slug]
        }
      });
    }, [onChange, layers, slug]);

    const onMoveToTopToggle = useCallback(() => {
      onChange({
        topLayerGroups: {
          ...topLayers,
          [slug]: !topLayers[slug]
        }
      });
    }, [onChange, topLayers, slug]);

    return (
      <StyledLayerGroupItem className="layer-group__select">
        {isVisibilityToggleAvailable ? (
          <PanelLabelWrapper>
            <PanelHeaderAction
              className="layer-group__visibility-toggle"
              id={`${slug}-toggle`}
              tooltip={layers[slug] ? 'tooltip.hide' : 'tooltip.show'}
              onClick={onVisibilityToggle}
              IconComponent={layers[slug] ? actionIcons.visible : actionIcons.hidden}
              active={layers[slug]}
              flush
            />
            <LayerLabel active={layers[slug]}>
              <FormattedMessage id={`mapLayers.${camelize(slug)}`} />
            </LayerLabel>
          </PanelLabelWrapper>
        ) : (
          <CenterFlexbox>
            <LayerLabel style={{marginLeft: '28px'}} active={true}>
              <FormattedMessage id={`mapLayers.${camelize(slug)}`} />
            </LayerLabel>
          </CenterFlexbox>
        )}
        <CenterFlexbox className="layer-group__trailing-actions">
          {isColorPickerAvailable && color ? (
            <LayerGroupColorPicker
              slug={slug}
              color={color}
              onColorChange={onColorChange}
              extraMarginRight={isMoveToTopAvailable}
              disabled={isVisibilityToggleAvailable && !layers[slug]}
            />
          ) : null}
          {isMoveToTopAvailable ? (
            <PanelHeaderAction
              id={`${slug}-top`}
              tooltip="tooltip.moveToTop"
              disabled={!layers[slug]}
              IconComponent={actionIcons.top}
              active={topLayers[slug]}
              onClick={onMoveToTopToggle}
            />
          ) : null}
        </CenterFlexbox>
      </StyledLayerGroupItem>
    );
  };

  return LayerGroupItem;
}

export default LayerGroupItemFactory;
