import React, {useCallback} from 'react';
import styled from 'styled-components';

import {FormattedMessage} from '@kepler.gl/localization';
import {camelize} from '@kepler.gl/utils';
import {RGBColor} from '@kepler.gl/types';

import {PanelHeaderAction} from '../panel-header-action';
import {PanelLabelBold, CenterFlexbox} from '../../common/styled-components';
import LayerGroupColorPickerFactory from './map-layer-group-color-picker';

export type LayerGroupItemProps = {
  PanelHeaderAction: PanelHeaderAction;
  onChange: (pd: MapConfigChangeUpdaterAction['payload']) => void;
  slug: string;
  layers: MapStyle['visibleLayerGroups'];
  topLayers: MapStyle['topLayerGroups'];
  actionIcons: {
    visible: React.ElementType;
    hidden: React.ElementType;
    top: React.ElementType;
  };
  color: RGBColor;
  onColorChange: (pd: RGBColor) => void;
  isVisibilityToggleAvailable: boolean;
  isMoveToTopAvailable: boolean;
  isColorPickerAvailable: boolean;
};

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
  color: ${props => (props.active ? props.theme.textColor : props.theme.labelColor)};
`;

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
          <CenterFlexbox>
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
          </CenterFlexbox>
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
