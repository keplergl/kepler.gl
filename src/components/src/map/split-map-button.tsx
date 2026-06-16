// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback, useMemo, useState, useRef, useEffect} from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import {MapControlButton} from '../common/styled-components';
import {Delete, Split} from '../common/icons';
import MapControlTooltipFactory from './map-control-tooltip';
import {MapControlItem, MapControls, MapState} from '@kepler.gl/types';
import {MapSplitMode} from '@kepler.gl/constants';

SplitMapButtonFactory.deps = [MapControlTooltipFactory];

interface SplitMapButtonIcons {
  delete: ComponentType<any>;
  split: ComponentType<any>;
}

export type SplitMapButtonProps = {
  isSplit: boolean;
  mapIndex: number;
  onToggleSplitMap: (index?: number) => void;
  onSetMapSplitMode?: (payload: {mapSplitMode: MapSplitMode}) => void;
  actionIcons: SplitMapButtonIcons;
  readOnly: boolean;
  mapControls: MapControls;
  mapState?: MapState;
};

const StyledSplitModeMenu = styled.div`
  position: absolute;
  top: 0;
  left: -160px;
  background: ${props => props.theme.dropdownListBgd || '#3A414C'};
  border-radius: 4px;
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);
  padding: 4px 0;
  z-index: 1000;
  min-width: 140px;
`;

const StyledMenuItem = styled.div<{$active?: boolean}>`
  padding: 8px 16px;
  color: ${props =>
    props.$active
      ? props.theme.activeColor || '#1FBAD6'
      : props.theme.textColor || '#A0A7B4'};
  cursor: pointer;
  font-size: 12px;
  font-weight: ${props => (props.$active ? 500 : 400)};
  &:hover {
    background: ${props => props.theme.dropdownListHighlightBg || '#4B5464'};
    color: ${props => props.theme.textColorHl || '#FFFFFF'};
  }
`;

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
  {id: MapSplitMode.SINGLE_MAP, label: 'Single'},
  {id: MapSplitMode.DUAL_MAP, label: 'Dual'},
  {id: MapSplitMode.SWIPE_COMPARE, label: 'Swipe'}
];

function SplitMapButtonFactory(MapControlTooltip) {
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
    actionIcons = defaultActionIcons,
    mapControls,
    readOnly,
    mapState
  }) => {
    const splitMap = mapControls?.splitMap || ({} as MapControlItem);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const currentMode = mapState?.mapSplitMode || MapSplitMode.SINGLE_MAP;

    const onClick = useCallback(
      event => {
        event.preventDefault();
        if (onSetMapSplitMode) {
          setMenuOpen(prev => !prev);
        } else {
          onToggleSplitMap(isSplit ? mapIndex : undefined);
        }
      },
      [isSplit, mapIndex, onToggleSplitMap, onSetMapSplitMode]
    );

    const handleModeSelect = useCallback(
      (mode: string) => {
        if (onSetMapSplitMode) {
          onSetMapSplitMode({mapSplitMode: mode as MapSplitMode});
        }
        setMenuOpen(false);
      },
      [onSetMapSplitMode]
    );

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setMenuOpen(false);
        }
      };
      if (menuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [menuOpen]);

    const isVisible = useMemo(() => splitMap.show && readOnly !== true, [splitMap.show, readOnly]);

    if (!splitMap.show) {
      return null;
    }
    return isVisible ? (
      <div style={{position: 'relative'}} ref={menuRef}>
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
        {menuOpen && onSetMapSplitMode && (
          <StyledSplitModeMenu>
            {SPLIT_MODE_OPTIONS.map(option => (
              <StyledMenuItem
                key={option.id}
                $active={currentMode === option.id}
                onClick={() => handleModeSelect(option.id)}
              >
                {option.label}
              </StyledMenuItem>
            ))}
          </StyledSplitModeMenu>
        )}
      </div>
    ) : null;
  };

  SplitMapButton.displayName = 'SplitMapButton';
  return React.memo(SplitMapButton);
}

export default SplitMapButtonFactory;
