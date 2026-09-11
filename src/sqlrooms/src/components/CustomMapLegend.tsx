// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

import React from 'react';
import {toggleMapControl} from '@kepler.gl/actions';
import {
  KeplerGlContext,
  LayerLegendContentFactory,
  LayerLegendHeaderFactory
} from '@kepler.gl/components';
import {MapLegendIcons, MapLegendProps} from '@kepler.gl/components';
import {DIMENSIONS} from '@kepler.gl/constants';
import {Layer} from '@kepler.gl/layers';
import {Button} from '@sqlrooms/ui';
import {ChevronDownIcon, ChevronRightIcon, XIcon} from 'lucide-react';
import {useCallback, useContext, useRef, useState} from 'react';
import type {Context, MouseEventHandler} from 'react';
import {useStoreWithKepler} from '../KeplerSlice';
import {SplitMapIndexContext} from './SplitMapIndexContext';

const defaultActionIcons = {
  expanded: ChevronDownIcon as unknown as MapLegendIcons['expanded'],
  collapsed: ChevronRightIcon as unknown as MapLegendIcons['collapsed']
} satisfies MapLegendIcons;

type KeplerGlContextValue = {
  selector: (state: any) => any;
  id: string;
};

const keplerGlContext = KeplerGlContext as unknown as Context<KeplerGlContextValue>;

CustomMapLegendFactory.deps = [LayerLegendHeaderFactory, LayerLegendContentFactory];

export function CustomMapLegendFactory(
  LayerLegendHeader: ReturnType<typeof LayerLegendHeaderFactory>,
  LayerLegendContent: ReturnType<typeof LayerLegendContentFactory>
) {
  const MapLegend: React.FC<MapLegendProps & {mapIndex?: number; onClose?: () => void}> = ({
    layers = [],
    width,
    isExport,
    mapIndex: mapIndexProp,
    onClose,
    ...restProps
  }) => {
    const containerW = width || DIMENSIONS.mapControl.width;
    const mapId = useContext(keplerGlContext).id;
    const splitMapIndex = useContext(SplitMapIndexContext);
    const mapIndex = mapIndexProp ?? splitMapIndex;
    const dispatchAction = useStoreWithKepler(state => state.kepler.dispatchAction);
    const splitMaps = useStoreWithKepler(state => state.kepler.map[mapId]?.visState?.splitMaps);
    const handleClose = (evt: React.MouseEvent<HTMLButtonElement>) => {
      evt.stopPropagation();
      if (onClose) {
        onClose();
      } else {
        dispatchAction(mapId, toggleMapControl('mapLegend', 0));
      }
    };

    const isSplit = splitMaps && splitMaps.length > 1;
    const panelLayers = isSplit && mapIndex != null ? splitMaps[mapIndex]?.layers : undefined;

    const visibleLayers = layers.filter(
      layer => layer.config.isVisible && (!panelLayers || panelLayers[layer.id])
    );

    return (
      <div className="map-legend border-border border" style={{width: containerW}}>
        <div className="relative flex flex-col">
          {!isExport && (
            <div className="border-muted bg-background sticky top-0 flex w-full items-center justify-between border-b p-2">
              <div className="text-xs font-medium">Legend</div>
              <Button variant="ghost" size="xs" className="h-6 w-6" onClick={handleClose}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex w-full flex-1 flex-col items-center">
            {visibleLayers.map((layer, index) => {
              return (
                <LayerLegendItem
                  key={index}
                  layer={layer}
                  containerW={containerW}
                  isExport={isExport}
                  {...restProps}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const LayerLegendItem = ({
    layer,
    containerW,
    isExport,
    mapState,
    disableEdit,
    onLayerVisConfigChange
  }: {layer: Layer; containerW: number} & MapLegendProps) => {
    const [isExpanded, setIsExpanded] = useState(layer.config.isVisible);

    const scrollIntoView = useCallback(() => {
      requestAnimationFrame(() => {
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      });
    }, []);

    const handleToggleExpanded: MouseEventHandler<HTMLElement> = evt => {
      evt.stopPropagation();
      const nextExpanded = !isExpanded;
      setIsExpanded(nextExpanded);
      if (!isExpanded) {
        scrollIntoView();
      }
    };

    const containerRef = useRef<HTMLDivElement>(null);

    if (!layer.isValidToSave() || layer.config.hidden) {
      return null;
    }

    if (isExport && !layer.config.isVisible) {
      return null;
    }

    return (
      <div ref={containerRef} className="border-muted flex w-full flex-col items-center border-b">
        <div className="flex w-full flex-row items-center gap-2" onClick={handleToggleExpanded}>
          <div className="cursor-pointer items-center overflow-hidden p-2 text-xs text-ellipsis whitespace-nowrap select-none">
            {layer.config.label}
          </div>
          <div className="flex-1" />
          <div className="flex flex-row items-center justify-end gap-1">
            <Button className="h-7 w-7" variant="ghost" size="icon" onClick={handleToggleExpanded}>
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="legend-content-wrapper w-full px-[8px] py-[5px] text-xs">
            <style>{`
              .legend-content-wrapper .legend--layer_size-title-row { display: flex; align-items: center; gap: 4px; }
              .legend-content-wrapper .panel--header__action {
                margin-left: 0;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                cursor: pointer;
              }
              .legend-content-wrapper .panel--header__action:hover {
                background-color: hsl(var(--accent));
                color: hsl(var(--accent-foreground));
              }
            `}</style>
            <LayerLegendContent
              containerW={containerW}
              layer={layer}
              mapState={mapState}
              disableEdit={disableEdit}
              isExport={isExport}
              onLayerVisConfigChange={onLayerVisConfigChange}
              actionIcons={defaultActionIcons}
            />
          </div>
        )}
      </div>
    );
  };

  MapLegend.displayName = 'MapLegend';

  return MapLegend;
}
