// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useMemo, useRef, useCallback, useEffect} from 'react';

import {MapLegendControlSettings} from '@kepler.gl/types';

type Params = {
  legendContentRef: React.MutableRefObject<HTMLElement | null>;
  isSidePanelShown: boolean;
  settings?: MapLegendControlSettings;
  onChangeSettings: (settings: Partial<MapLegendControlSettings>) => void;
  theme: Record<string, any>;
};

type ReturnType = {
  positionStyles: Record<string, unknown>;
  updatePosition: () => void;
  contentHeight: number;
  startResize: () => void;
  resize: (deltaY: number) => void;
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
  theme
}: Params): ReturnType {
  const pos = settings?.position ?? DEFAULT_POSITION;
  const contentHeight = settings?.contentHeight ?? -1;
  const positionStyles = useMemo(() => ({[pos.anchorX]: pos.x, [pos.anchorY]: pos.y}), [pos]);
  const startHeightRef = useRef(0);
  const sidePanelWidth = theme.sidePanel?.width || 0;

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
    const content = legendContentRef.current?.querySelector('.map-control__panel-content');
    if (content instanceof HTMLElement) {
      startHeightRef.current = content.offsetHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const resize = useCallback(
    deltaY => {
      const root = legendContentRef.current?.closest('.kepler-gl');
      const legendContent = legendContentRef.current;
      if (root instanceof HTMLElement && legendContent) {
        const mapRootBounds = root.getBoundingClientRect();
        const legendRect = legendContent.getBoundingClientRect();
        const nextHeight = Math.min(
          mapRootBounds.bottom - (legendRect.top + MAP_CONTROL_HEADER_FULL_HEIGHT + MARGIN.bottom),
          Math.max(MIN_CONTENT_HEIGHT, startHeightRef.current + deltaY)
        );
        onChangeSettings({contentHeight: nextHeight});
        if (contentHeight > 0 && pos.anchorY === 'bottom') {
          onChangeSettings({position: {...pos, y: pos.y - (nextHeight - contentHeight)}});
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contentHeight, pos, onChangeSettings]
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

  return {positionStyles, updatePosition, contentHeight, startResize, resize};
}
