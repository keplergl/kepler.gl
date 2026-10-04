// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import {FormattedMessage} from '@kepler.gl/localization';

import {formatMapCoordinate} from './coordinate-info';
import {AnnotationText, Checkmark, Copy, EyeSeen, EyeUnseen} from '../common/icons';

const RIGHT_DRAG_THRESHOLD_PX = 3;
const MENU_OPEN_OFFSET_PX = 4;

export type CoordinateMenuState = {
  x: number;
  y: number;
  text: string;
  /** `[lng, lat]` at the click, used to place a new annotation. */
  coordinate: [number, number];
};

/** Which annotation actions belong on this right-click. */
export function annotationContextMenuItems({
  annotationsEnabled,
  readOnly = false,
  annotationCount
}: {
  annotationsEnabled: boolean;
  readOnly?: boolean;
  annotationCount: number;
}): {showAddAnnotation: boolean; showAnnotationToggle: boolean} {
  if (!annotationsEnabled) {
    return {showAddAnnotation: false, showAnnotationToggle: false};
  }
  return {
    showAddAnnotation: !readOnly,
    showAnnotationToggle: annotationCount > 0
  };
}

type Bounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * The polygon / polygon-filter action panel (Filter layers) is open on this map.
 * The copy menu uses the same anchor and would cover that panel.
 */
export function isFeatureActionPanelOpen(
  editor:
    | {
        selectedFeature?: unknown;
        selectionContext?: {rightClick?: boolean; mapIndex?: number} | null;
      }
    | null
    | undefined,
  mapIndex = 0
): boolean {
  const context = editor?.selectionContext;
  return Boolean(
    editor?.selectedFeature && context?.rightClick && (context.mapIndex ?? 0) === (mapIndex ?? 0)
  );
}

/**
 * Hide the coordinate menu while a tooltip can describe the feature under the
 * cursor. The right-click pins that tooltip instead.
 */
export function coordinateMenuHiddenByTooltip(
  tooltipEnabled: boolean,
  hoverLayerId?: string | null
): boolean {
  return Boolean(tooltipEnabled && hoverLayerId);
}

/** Right-click landed on the feature action panel or a polygon-filter badge. */
export function contextMenuTargetIsFeatureUi(target: EventTarget | null): boolean {
  return target instanceof Element
    ? Boolean(target.closest('.feature-action-panel, .editor-filter-badges'))
    : false;
}

/**
 * Right-button press that moved farther than a few pixels is a rotate/pitch
 * drag, not a request for the coordinate menu.
 */
export function isRightDrag(
  start: {x: number; y: number} | null,
  clientX: number,
  clientY: number
): boolean {
  if (!start) {
    return false;
  }
  const dx = clientX - start.x;
  const dy = clientY - start.y;
  return dx * dx + dy * dy > RIGHT_DRAG_THRESHOLD_PX * RIGHT_DRAG_THRESHOLD_PX;
}

/**
 * Map a right-click inside the map container to a `"lat, lng"` menu anchor.
 * `unproject` receives pixel offsets from the container's top-left.
 */
export function coordinateMenuFromClick(
  clientX: number,
  clientY: number,
  bounds: Bounds,
  unproject: (point: [number, number]) => number[] | null | undefined
): CoordinateMenuState | null {
  const x = clientX - bounds.left;
  const y = clientY - bounds.top;
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    x < 0 ||
    y < 0 ||
    x > bounds.width ||
    y > bounds.height
  ) {
    return null;
  }

  let lngLat: number[] | null | undefined;
  try {
    lngLat = unproject([x, y]);
  } catch {
    return null;
  }

  const text = formatMapCoordinate(lngLat);
  if (!text || !lngLat || lngLat.length < 2) {
    return null;
  }
  return {x, y, text, coordinate: [lngLat[0], lngLat[1]]};
}

const StyledMenu = styled.div`
  position: absolute;
  z-index: 99;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.dropdownListShadow};
  background-color: ${props => props.theme.dropdownListBgd};
  border-radius: 2px;
  pointer-events: auto;

  button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 2px;
    margin: 0;
    padding: 8px 12px 8px 8px;
    background-color: ${props => props.theme.dropdownListBgd};
    color: ${props => props.theme.textColor};
    font-family: ${props => props.theme.fontFamily};
    font-size: 12px;
    line-height: 14px;
    white-space: nowrap;
    cursor: pointer;

    &:hover,
    &:focus {
      outline: none;
      background-color: ${props => props.theme.dropdownListHighlightBg};
      color: ${props => props.theme.textColorHl};
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background-color: ${props => props.theme.dropdownListBgd};
      color: ${props => props.theme.textColor};
    }
  }
`;

export type MapCoordinateMenuProps = {
  x: number;
  y: number;
  text: string | null;
  onClose: () => void;
  showCopy?: boolean;
  showAddAnnotation?: boolean;
  addAnnotationDisabled?: boolean;
  showAnnotationToggle?: boolean;
  annotationsVisible?: boolean;
  onAddAnnotation?: () => void;
  onToggleAnnotations?: () => void;
};

const MapCoordinateMenu: React.FC<MapCoordinateMenuProps> = ({
  x,
  y,
  text,
  onClose,
  showCopy = true,
  showAddAnnotation = false,
  addAnnotationDisabled = false,
  showAnnotationToggle = false,
  annotationsVisible = true,
  onAddAnnotation,
  onToggleAnnotations
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState({x: MENU_OPEN_OFFSET_PX, y: MENU_OPEN_OFFSET_PX});
  const [interactive, setInteractive] = useState(false);
  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    const node = menuRef.current;
    const parent = node?.offsetParent as HTMLElement | null;
    if (!node || !parent) {
      return;
    }
    const next = {x: MENU_OPEN_OFFSET_PX, y: MENU_OPEN_OFFSET_PX};
    if (x + next.x + node.offsetWidth > parent.clientWidth) {
      next.x = -node.offsetWidth - MENU_OPEN_OFFSET_PX;
    }
    if (y + next.y + node.offsetHeight > parent.clientHeight) {
      next.y = -node.offsetHeight - MENU_OPEN_OFFSET_PX;
    }
    setShift(next);
  }, [
    x,
    y,
    text,
    copied,
    showCopy,
    showAddAnnotation,
    showAnnotationToggle,
    addAnnotationDisabled,
    annotationsVisible
  ]);

  useEffect(() => {
    setInteractive(false);
    const enableId = window.setTimeout(() => setInteractive(true), 0);
    return () => window.clearTimeout(enableId);
  }, [x, y]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const listenId = window.setTimeout(() => {
      window.addEventListener('pointerdown', onPointerDown);
    }, 0);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
      window.clearTimeout(listenId);
    };
  }, [onClose]);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }
    const closeId = window.setTimeout(onClose, 700);
    return () => window.clearTimeout(closeId);
  }, [copied, onClose]);

  const onCopy = () => {
    if (copied || !text) {
      return;
    }
    if (copy(text)) {
      setCopied(true);
    }
  };

  return (
    <StyledMenu
      ref={menuRef}
      role="menu"
      data-testid="map-coordinate-menu"
      style={{
        left: x + shift.x,
        top: y + shift.y,
        pointerEvents: interactive ? 'auto' : 'none'
      }}
      onMouseDown={event => event.stopPropagation()}
      onContextMenu={event => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {showAddAnnotation ? (
        <button
          type="button"
          role="menuitem"
          disabled={addAnnotationDisabled}
          onClick={() => {
            if (!addAnnotationDisabled) {
              onAddAnnotation?.();
            }
          }}
        >
          <AnnotationText height="14px" aria-hidden={true} />
          <FormattedMessage id="interactions.addAnnotation" />
        </button>
      ) : null}
      {showAnnotationToggle ? (
        <button type="button" role="menuitem" onClick={() => onToggleAnnotations?.()}>
          {annotationsVisible ? (
            <EyeUnseen height="14px" aria-hidden={true} />
          ) : (
            <EyeSeen height="14px" aria-hidden={true} />
          )}
          <FormattedMessage
            id={
              annotationsVisible ? 'interactions.hideAnnotations' : 'interactions.showAnnotations'
            }
          />
        </button>
      ) : null}
      {showCopy && text ? (
        <button type="button" role="menuitem" onClick={onCopy}>
          {copied ? (
            <Checkmark height="14px" aria-hidden={true} />
          ) : (
            <Copy height="14px" aria-hidden={true} />
          )}
          {copied ? (
            <FormattedMessage id="interactions.coordinateCopied" />
          ) : (
            <FormattedMessage id="interactions.copyCoordinate" />
          )}
        </button>
      ) : null}
    </StyledMenu>
  );
};

export default MapCoordinateMenu;
