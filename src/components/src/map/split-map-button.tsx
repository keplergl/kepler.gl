// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback, useMemo} from 'react';
import classnames from 'classnames';
import {MapControlButton} from '../common/styled-components';
import {Delete, Split} from '../common/icons';
import MapControlTooltipFactory from './map-control-tooltip';
import {MapControlItem, MapControls} from '@kepler.gl/types';

SplitMapButtonFactory.deps = [MapControlTooltipFactory];

interface SplitMapButtonIcons {
  delete: ComponentType<any>;
  split: ComponentType<any>;
}

export type SplitMapButtonProps = {
  isSplit: boolean;
  mapIndex: number;
  onToggleSplitMap: (index?: number) => void;
  actionIcons: SplitMapButtonIcons;
  readOnly: boolean;
  mapControls: MapControls;
};

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
    actionIcons = defaultActionIcons,
    mapControls,
    readOnly
  }) => {
    const splitMap = mapControls?.splitMap || ({} as MapControlItem);
    const onClick = useCallback(
      event => {
        event.preventDefault();
        onToggleSplitMap(isSplit ? mapIndex : undefined);
      },
      [isSplit, mapIndex, onToggleSplitMap]
    );

    const isVisible = useMemo(() => splitMap.show && readOnly !== true, [splitMap.show, readOnly]);

    if (!splitMap.show) {
      return null;
    }
    return isVisible ? (
      <MapControlTooltip
        id="action-toggle"
        message={isSplit ? 'tooltip.closePanel' : 'tooltip.switchToDualView'}
      >
        <MapControlButton
          active={isSplit}
          onClick={onClick}
          className={classnames('map-control-button', 'split-map', {'close-map': isSplit})}
        >
          {isSplit ? <actionIcons.delete height="18px" /> : <actionIcons.split height="18px" />}
        </MapControlButton>
      </MapControlTooltip>
    ) : null;
  };

  SplitMapButton.displayName = 'SplitMapButton';
  return React.memo(SplitMapButton);
}

export default SplitMapButtonFactory;
