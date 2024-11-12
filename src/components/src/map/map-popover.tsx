// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useCallback, useContext} from 'react';
import styled from 'styled-components';
import MapPopoverContentFactory from './map-popover-content';
import {Pin, ArrowLeft, ArrowRight, CursorPoint} from '../common/icons';
import {injectIntl, IntlShape} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import {RootContext} from '../context';
import {parseGeoJsonRawFeature} from '@kepler.gl/layers';
import {idToPolygonGeo, generateHashId} from '@kepler.gl/utils';
import {LAYER_TYPES} from '@kepler.gl/constants';
import {LayerHoverProp} from '@kepler.gl/reducers';
import {Feature, FeatureSelectionContext} from '@kepler.gl/types';
import {
  FloatingPortal,
  flip,
  offset,
  useClientPoint,
  useFloating,
  useInteractions
} from '@floating-ui/react';

const SELECTABLE_LAYERS: string[] = [LAYER_TYPES.hexagonId, LAYER_TYPES.geojson];
const MAX_WIDTH = 500;
const MAX_HEIGHT = 600;

const StyledMapPopover = styled.div`
  display: flex;
  flex-direction: column;

  max-width: ${MAX_WIDTH}px;
  max-height: ${MAX_HEIGHT}px;
  padding: 14px;
  & > * + * {
    margin-top: 6px;
  }
  ${props => props.theme.scrollBar};
  font-family: ${props => props.theme.fontFamily};
  font-size: 11px;
  font-weight: 500;
  background-color: ${props => props.theme.panelBackground};
  color: ${props => props.theme.textColor};
  z-index: 98; /* should be below 99 which is side pane */
  overflow-x: auto;
  box-shadow: ${props => props.theme.panelBoxShadow};

  :hover {
    background-color: ${props => `${props.theme.panelBackground}dd`};
  }

  .primary-label {
    color: ${props => props.theme.notificationColors.success};
    font-size: 10px;
  }

  .map-popover__layer-info,
  .coordingate-hover-info {
    & > * + * {
      margin-top: 7px;
    }
  }

  table {
    width: auto;
    display: grid;
    border-collapse: collapse;
    row-gap: 5px;
    column-gap: 5px;
  }

  .coordingate-hover-info > table {
    grid-template-columns: auto auto auto;
  }
  .map-popover__layer-info > table {
    grid-template-columns: auto auto;
  }

  tbody,
  tr {
    display: contents;
  }

  td {
    border-color: transparent;
    color: ${props => props.theme.textColor};
  }

  td.row__value {
    text-align: right;
    font-weight: 500;
    color: ${props => props.theme.textColorHl};
  }
`;

const PinnedButtons = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  justify-items: center;
  & > * + * {
    margin-left: 10px;
  }
`;

const PopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: 12px;
  }
`;

const StyledIcon = styled.div`
  color: ${props => props.theme.activeColor};

  :hover {
    cursor: pointer;
    color: ${props => props.theme.linkBtnColor};
  }
`;

const StyledSelectGeometry = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textColorHl};
  svg {
    margin-right: 6px;
  }

  :hover {
    cursor: pointer;
    color: ${props => props.theme.linkBtnColor};
  }
`;

MapPopoverFactory.deps = [MapPopoverContentFactory];

export function getSelectedFeature(layerHoverProp: LayerHoverProp | null): Feature | null {
  const layer = layerHoverProp?.layer;
  let fieldIdx;
  let selectedFeature;
  switch (layer?.type) {
    case LAYER_TYPES.hexagonId:
      fieldIdx = layer.config?.columns?.hex_id?.fieldIdx;
      selectedFeature = idToPolygonGeo({id: layerHoverProp?.data?.[fieldIdx]}, {isClosed: true});
      break;
    case LAYER_TYPES.geojson:
      fieldIdx = layer.config?.columns?.geojson?.fieldIdx;
      selectedFeature = parseGeoJsonRawFeature(layerHoverProp?.data?.[fieldIdx]);
      break;
    default:
      break;
  }

  return {
    ...selectedFeature,
    // unique id should be assigned to features in the editor
    id: generateHashId(8)
  };
}

export type MapPopoverProps = {
  x: number;
  y: number;
  frozen?: boolean;
  coordinate: [number, number] | boolean;
  layerHoverProp: LayerHoverProp | null;
  isBase?: boolean;
  zoom: number;
  container?: HTMLElement | null;
  onClose: () => void;
  onSetFeatures: (features: Feature[]) => any;
  setSelectedFeature: (feature: Feature | null, clickContext?: FeatureSelectionContext) => any;
  featureCollection?: {
    type: string;
    features: Feature[];
  };
};

type IntlProps = {
  intl: IntlShape;
};

export default function MapPopoverFactory(
  MapPopoverContent: ReturnType<typeof MapPopoverContentFactory>
) {
  const MapPopover: React.FC<MapPopoverProps & IntlProps> = ({
    x,
    y,
    frozen,
    coordinate,
    layerHoverProp,
    isBase,
    zoom,
    container,
    onClose,
    onSetFeatures,
    setSelectedFeature,
    featureCollection
  }) => {
    const [horizontalPlacement, setHorizontalPlacement] = useState('start');
    const moveLeft = () => setHorizontalPlacement('end');
    const moveRight = () => setHorizontalPlacement('start');
    const rootContext = useContext(RootContext);
    const {refs, context, floatingStyles} = useFloating({
      placement: `${horizontalPlacement == 'end' ? 'left' : 'right'}-start`,
      middleware: [offset({mainAxis: 20, alignmentAxis: 20}), flip()]
    });
    const onSetSelectedFeature = useCallback(() => {
      const clickContext = {
        mapIndex: 0,
        rightClick: true,
        position: {x, y}
      };
      const selectedFeature = getSelectedFeature(layerHoverProp);
      if (selectedFeature) {
        setSelectedFeature(selectedFeature, clickContext);
        const updatedFeatures = featureCollection
          ? [...featureCollection.features, selectedFeature]
          : [selectedFeature];
        onSetFeatures(updatedFeatures);
      }
      onClose();
    }, [onClose, onSetFeatures, x, y, setSelectedFeature, layerHoverProp, featureCollection]);

    const containerBounds = container?.getBoundingClientRect();
    const clientPoint = useClientPoint(context, {
      x: (containerBounds?.left || 0) + x,
      y: (containerBounds?.top || 0) + y
    });
    const {getFloatingProps} = useInteractions([clientPoint]);

    return (
      <FloatingPortal root={rootContext?.current}>
        <StyledMapPopover
          className="map-popover"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {frozen ? (
            <PinnedButtons>
              {horizontalPlacement === 'start' && (
                <StyledIcon className="popover-arrow-left" onClick={moveLeft}>
                  <ArrowLeft />
                </StyledIcon>
              )}
              <StyledIcon className="popover-pin" onClick={onClose}>
                <Pin height="16px" />
              </StyledIcon>
              {horizontalPlacement === 'end' && (
                <StyledIcon className="popover-arrow-right" onClick={moveRight}>
                  <ArrowRight />
                </StyledIcon>
              )}
              {isBase && (
                <div className="primary-label">
                  <FormattedMessage id="mapPopover.primary" />
                </div>
              )}
            </PinnedButtons>
          ) : null}
          <PopoverContent>
            <MapPopoverContent
              coordinate={coordinate}
              zoom={zoom}
              layerHoverProp={layerHoverProp}
            />
          </PopoverContent>
          {layerHoverProp?.layer?.type &&
          SELECTABLE_LAYERS.includes(layerHoverProp?.layer?.type) &&
          frozen ? (
            <StyledSelectGeometry className="select-geometry" onClick={onSetSelectedFeature}>
              <CursorPoint />
              Select Geometry
            </StyledSelectGeometry>
          ) : null}
        </StyledMapPopover>
      </FloatingPortal>
    );
  };
  return injectIntl(MapPopover);
}
