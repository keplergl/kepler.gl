// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback, useMemo, useState, useRef, useEffect} from 'react';
import classnames from 'classnames';
import {MapControlButton} from '../common/styled-components';
import {Delete, Split} from '../common/icons';
import ToolbarItem from '../common/toolbar-item';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlToolbarFactory from './map-control-toolbar';
import {MapControlItem, MapControls, MapState} from '@kepler.gl/types';
import {MapSplitMode} from '@kepler.gl/constants';

SplitMapButtonFactory.deps = [MapControlTooltipFactory, MapControlToolbarFactory];

interface SplitMapButtonIcons {
  delete: ComponentType<any>;
  split: ComponentType<any>;
}

export type SplitMapButtonProps = {
  isSplit: boolean;
  mapIndex: number;
  onToggleSplitMap: (index?: number) => void;
  onSetMapSplitMode?: (payload: {mapSplitMode: MapSplitMode}) => void;
  onToggleMapControl?: (control: string) => void;
  actionIcons: SplitMapButtonIcons;
  readOnly: boolean;
  mapControls: MapControls;
  mapState?: MapState;
};

const SwipeCompareIcon: React.FC<{height?: string}> = ({height = '18px'}) => (
  <svg height={height} viewBox="0 0 16 16" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 2h12v12H2V2zm1 1v10h10V3H3z"
    />
    <path d="M7.5 3v10h1V3z" />
    <path d="M5 8l2-2v4l-2-2z" />
    <path d="M11 8l-2-2v4l2-2z" />
  </svg>
);

const SPLIT_MODE_OPTIONS = [
  {id: MapSplitMode.SINGLE_MAP, label: 'tooltip.singleView'},
  {id: MapSplitMode.DUAL_MAP, label: 'tooltip.dualView'},
  {id: MapSplitMode.SWIPE_COMPARE, label: 'tooltip.swipeView'}
];

function SplitMapButtonFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>,
  MapControlToolbar: ReturnType<typeof MapControlToolbarFactory>
) {
  const defaultActionIcons = {
    delete: Delete,
    split: Split
  };

  /** @type {import('./split-map-button').SplitMapButtonComponent} */
  const SplitMapButton: React.FC<SplitMapButtonProps> = ({
    isSplit,
    mapIndex,
    onToggleSplitMap,
    onSetMapSplitMode,
    onToggleMapControl,
    actionIcons = defaultActionIcons,
    mapControls,
    readOnly,
    mapState
  }) => {
    const splitMap = mapControls?.splitMap || ({} as MapControlItem);
    const menuRef = useRef<HTMLDivElement>(null);

    // The split-mode menu open state is normally kept in redux
    // (mapControls.splitMap.active) so it participates in the "only one
    // map-control menu open at a time" logic in toggleMapControlUpdater.
    // If a consumer supplies onSetMapSplitMode without onToggleMapControl, we
    // fall back to local component state so the menu still opens/closes.
    const useReduxMenuState = Boolean(onToggleMapControl);
    const [localMenuOpen, setLocalMenuOpen] = useState(false);

    const toggleMenu = useCallback(() => {
      if (useReduxMenuState) {
        onToggleMapControl?.('splitMap');
      } else {
        setLocalMenuOpen(prev => !prev);
      }
    }, [useReduxMenuState, onToggleMapControl]);

    const closeMenu = useCallback(() => {
      if (useReduxMenuState) {
        if (splitMap.active) {
          onToggleMapControl?.('splitMap');
        }
      } else {
        setLocalMenuOpen(false);
      }
    }, [useReduxMenuState, onToggleMapControl, splitMap.active]);

    const menuOpen =
      Boolean(onSetMapSplitMode) && (useReduxMenuState ? Boolean(splitMap.active) : localMenuOpen);

    const currentMode = mapState?.mapSplitMode || MapSplitMode.SINGLE_MAP;

    const onClick = useCallback(
      event => {
        event.preventDefault();
        if (onSetMapSplitMode) {
          toggleMenu();
        } else {
          onToggleSplitMap(isSplit ? mapIndex : undefined);
        }
      },
      [isSplit, mapIndex, onToggleSplitMap, onSetMapSplitMode, toggleMenu]
    );

    const handleModeSelect = useCallback(
      (mode: string) => {
        if (onSetMapSplitMode) {
          onSetMapSplitMode({mapSplitMode: mode as MapSplitMode});
        }
        closeMenu();
      },
      [onSetMapSplitMode, closeMenu]
    );

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          closeMenu();
        }
      };
      if (menuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [menuOpen, closeMenu]);

    const isVisible = useMemo(() => splitMap.show && readOnly !== true, [splitMap.show, readOnly]);

    if (!splitMap.show) {
      return null;
    }
    return isVisible ? (
      <div className="split-map-controls" style={{position: 'relative'}} ref={menuRef}>
        {menuOpen && onSetMapSplitMode ? (
          <MapControlToolbar $show={menuOpen}>
            {SPLIT_MODE_OPTIONS.map(option => (
              <ToolbarItem
                key={option.id}
                onClick={() => handleModeSelect(option.id)}
                label={option.label}
                active={currentMode === option.id}
              />
            ))}
          </MapControlToolbar>
        ) : null}
        <MapControlTooltip
          id="action-toggle"
          message={
            onSetMapSplitMode
              ? 'tooltip.selectSplitMode'
              : isSplit
              ? 'tooltip.closePanel'
              : 'tooltip.switchToDualView'
          }
        >
          <MapControlButton
            active={isSplit}
            onClick={onClick}
            className={classnames('map-control-button', 'split-map', {'close-map': isSplit})}
          >
            {currentMode === MapSplitMode.SWIPE_COMPARE ? (
              <SwipeCompareIcon height="18px" />
            ) : isSplit ? (
              <actionIcons.delete height="18px" />
            ) : (
              <actionIcons.split height="18px" />
            )}
          </MapControlButton>
        </MapControlTooltip>
      </div>
    ) : null;
  };

  SplitMapButton.displayName = 'SplitMapButton';
  return React.memo(SplitMapButton);
}

export default SplitMapButtonFactory;
