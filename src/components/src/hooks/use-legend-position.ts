// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useMemo, useRef, useCallback, useEffect} from 'react';

import {MapLegendControlSettings} from '@kepler.gl/types';
import {getApplicationConfig} from '@kepler.gl/utils';
import {snapFloatingWidgetResize} from '../map/floating-widget-snapping';

type Params = {
  legendContentRef: React.MutableRefObject<HTMLElement | null>;
  isSidePanelShown: boolean;
  settings?: MapLegendControlSettings;
  onChangeSettings: (settings: Partial<MapLegendControlSettings>) => void;
  theme: Record<string, any>;
  mapHeight?: number;
  mapWidth?: number;
};

export type LegendResizeEdge = 'top' | 'bottom';

type ReturnType = {
  positionStyles: Record<string, unknown>;
  updatePosition: () => void;
  contentHeight: number;
  maxContentHeight?: number;
  startResize: () => void;
  resize: (deltaY: number, edge?: LegendResizeEdge) => void;
};

const MARGIN = {
  left: 10,
  top: 10,
  right: 10,
  bottom: 30
};
const DEFAULT_POSITION: MapLegendControlSettings['position'] = {
  x: MARGIN.right,
  y: MARGIN.bottom,
  anchorX: 'right',
  anchorY: 'bottom'
};
const MIN_CONTENT_HEIGHT = 100;
const MAP_CONTROL_HEADER_FULL_HEIGHT = 34;

export type UseCalcLegendPositionProps = {
  legendContentRef: React.MutableRefObject<HTMLElement | null>;
  isSidePanelShown: boolean;
  sidePanelWidth: number;
};

export function useCalcLegendPosition({
  legendContentRef,
  isSidePanelShown,
  sidePanelWidth
}: UseCalcLegendPositionProps) {
  return useCallback((): MapLegendControlSettings['position'] => {
    const root = legendContentRef.current?.closest('.kepler-gl');
    const legendContent = legendContentRef.current;
    if (!legendContent || !(root instanceof HTMLElement)) {
      return DEFAULT_POSITION;
    }
    const legendRect = legendContent.getBoundingClientRect();
    const mapRootBounds = root.getBoundingClientRect();
    const leftSidebarOffset = isSidePanelShown ? sidePanelWidth : 0;

    const leftOffset = Math.max(
      MARGIN.left,
      legendRect.left - mapRootBounds.left - leftSidebarOffset
    );
    const rightOffset = Math.max(MARGIN.right, mapRootBounds.right - legendRect.right);

    const topOffset = Math.max(MARGIN.top, legendRect.top - mapRootBounds.top);
    const bottomOffset = Math.max(MARGIN.bottom, mapRootBounds.bottom - legendRect.bottom);

    return {
      ...(leftOffset < rightOffset
        ? {x: leftOffset + leftSidebarOffset, anchorX: 'left'}
        : {x: rightOffset, anchorX: 'right'}),
      ...(topOffset < bottomOffset
        ? {y: topOffset, anchorY: 'top'}
        : {y: bottomOffset, anchorY: 'bottom'})
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidePanelShown, sidePanelWidth]);
}

/**
 * Returns a function that calculates the anchored position of the map legend
 * that is being dragged.
 */
export default function useLegendPosition({
  legendContentRef,
  isSidePanelShown,
  settings,
  onChangeSettings,
  theme,
  mapHeight,
  mapWidth
}: Params): ReturnType {
  const pos = settings?.position ?? DEFAULT_POSITION;
  const contentHeight = settings?.contentHeight ?? -1;
  const positionStyles = useMemo(() => ({[pos.anchorX]: pos.x, [pos.anchorY]: pos.y}), [pos]);
  const startHeightRef = useRef(0);
  const frameHeightRef = useRef(MAP_CONTROL_HEADER_FULL_HEIGHT);
  const minHeightRef = useRef(MIN_CONTENT_HEIGHT);
  const sidePanelWidth = theme.sidePanel?.width || 0;

  // Calculate dynamic max content height based on map root dimensions
  const maxContentHeight = useMemo(() => {
    if (!mapHeight) return undefined;
    // Available height minus margins and header
    return mapHeight - MARGIN.top - MARGIN.bottom - MAP_CONTROL_HEADER_FULL_HEIGHT;
  }, [mapHeight]);

  const calcPosition = useCalcLegendPosition({
    legendContentRef,
    isSidePanelShown,
    sidePanelWidth
  });
  const updatePosition = useCallback(
    () => onChangeSettings({position: calcPosition()}),
    [calcPosition, onChangeSettings]
  );

  const startResize = useCallback(() => {
    const legendContent = legendContentRef.current;
    const content = legendContent?.querySelector('.map-control__panel-content');
    if (legendContent && content instanceof HTMLElement) {
      startHeightRef.current = content.offsetHeight;
      // Include the rendered header and borders when aligning the outer edges.
      frameHeightRef.current = legendContent.getBoundingClientRect().height - content.offsetHeight;
      // Keep resizing in sync with each panel's rendered minimum.
      const minHeight = parseFloat(window.getComputedStyle(content).minHeight);
      minHeightRef.current =
        Number.isFinite(minHeight) && minHeight > 0 ? minHeight : MIN_CONTENT_HEIGHT;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const resize = useCallback(
    (deltaY: number, edge: LegendResizeEdge = 'bottom') => {
      const root = legendContentRef.current?.closest('.kepler-gl');
      const legendContent = legendContentRef.current;
      if (!(root instanceof HTMLElement) || !legendContent) {
        return;
      }
      const mapRootBounds = root.getBoundingClientRect();
      const legendRect = legendContent.getBoundingClientRect();
      // Bottom handle grows into space below the legend top; top handle grows
      // into space above the legend bottom so a cornered legend can still resize.
      const remainingHeight =
        edge === 'top'
          ? legendRect.bottom - frameHeightRef.current - mapRootBounds.top - MARGIN.top
          : mapRootBounds.bottom - (legendRect.top + frameHeightRef.current + MARGIN.bottom);
      // Use maxContentHeight if available, otherwise fall back to viewport-based calculation
      const maxHeight = maxContentHeight
        ? Math.min(maxContentHeight, remainingHeight)
        : remainingHeight;
      // Dragging the top handle up (negative deltaY) should grow the legend.
      const signedDelta = edge === 'top' ? -deltaY : deltaY;
      let nextHeight = Math.min(
        maxHeight,
        Math.max(minHeightRef.current, startHeightRef.current + signedDelta)
      );
      if (
        getApplicationConfig().enableFloatingWidgetSnapping &&
        deltaY !== 0 &&
        maxHeight >= minHeightRef.current
      ) {
        const direction = edge === 'top' ? -1 : 1;
        const fixedEdge = edge === 'top' ? legendRect.bottom : legendRect.top;
        const edgeAtHeight = height => fixedEdge + direction * (frameHeightRef.current + height);
        const minEdge = edgeAtHeight(minHeightRef.current);
        const maxEdge = edgeAtHeight(maxHeight);
        const snappedEdge = snapFloatingWidgetResize(
          legendContent,
          legendRect,
          edgeAtHeight(nextHeight),
          Math.min(minEdge, maxEdge),
          Math.max(minEdge, maxEdge)
        );
        nextHeight = direction * (snappedEdge - fixedEdge) - frameHeightRef.current;
      }
      const nextSettings: Partial<MapLegendControlSettings> = {contentHeight: nextHeight};
      // Keep the opposite edge fixed when CSS anchoring would otherwise move it.
      const currentHeight = contentHeight > 0 ? contentHeight : startHeightRef.current;
      const heightDelta = nextHeight - currentHeight;
      if (currentHeight > 0 && heightDelta !== 0) {
        const shouldShiftAnchor =
          (edge === 'bottom' && pos.anchorY === 'bottom') ||
          (edge === 'top' && pos.anchorY === 'top');
        if (shouldShiftAnchor) {
          nextSettings.position = {...pos, y: pos.y - heightDelta};
        }
      }
      onChangeSettings(nextSettings);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contentHeight, pos, onChangeSettings, maxContentHeight]
  );

  // Shift when side panel is shown/hidden
  const posRef = useRef(pos);
  posRef.current = pos;
  useEffect(() => {
    const currentPos = posRef.current;
    if (currentPos.anchorX === 'left') {
      if (isSidePanelShown) {
        if (currentPos.x <= sidePanelWidth + MARGIN.left) {
          onChangeSettings({position: {...currentPos, x: sidePanelWidth + MARGIN.left}});
        }
      } else {
        onChangeSettings({
          position: {...currentPos, x: Math.max(MARGIN.left, currentPos.x - sidePanelWidth)}
        });
      }
    }
  }, [isSidePanelShown, onChangeSettings, sidePanelWidth]);

  // Clamp contentHeight when map resizes to ensure legend stays within available space
  useEffect(() => {
    if (!mapWidth || !mapHeight || !legendContentRef.current) return;
    if (maxContentHeight && contentHeight > 0 && contentHeight > maxContentHeight) {
      onChangeSettings({contentHeight: maxContentHeight});
    }
  }, [mapWidth, mapHeight, contentHeight, onChangeSettings, maxContentHeight, legendContentRef]);

  return {positionStyles, updatePosition, contentHeight, maxContentHeight, startResize, resize};
}
