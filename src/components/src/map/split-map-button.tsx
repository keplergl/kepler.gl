// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
