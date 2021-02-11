// Copyright (c) 2021 Uber Technologies, Inc.
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

import React, {useCallback, useMemo} from 'react';
import classnames from 'classnames';
import {MapControlButton} from 'components/common/styled-components';
import {Delete, Split} from 'components/common/icons';
import MapControlTooltipFactory from './map-control-tooltip';
import MapControlPanelFactory from './map-control-panel';

SplitMapButtonFactory.deps = [MapControlTooltipFactory, MapControlPanelFactory];

function SplitMapButtonFactory(MapControlTooltip) {
  const defaultActionIcons = {
    delete: Delete,
    split: Split
  };

  /** @type {import('./split-map-button').SplitMapButtonComponent} */
  const SplitMapButton = ({
    isSplit,
    mapIndex,
    onToggleSplitMap,
    actionIcons = defaultActionIcons,
    mapControls,
    readOnly
  }) => {
    const splitMap = mapControls?.splitMap || {};
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
      (<MapControlButton
        active={isSplit}
        onClick={onClick}
        key={`split-${isSplit}`}
        className={classnames('map-control-button', 'split-map', {'close-map': isSplit})}
        data-tip
        data-for="action-toggle"
      >
        {isSplit ? <actionIcons.delete height="18px" /> : <actionIcons.split height="18px" />}
        <MapControlTooltip
          id="action-toggle"
          message={isSplit ? 'tooltip.closePanel' : 'tooltip.switchToDualView'}
        />
      </MapControlButton>)
    ) : null;
  };

  SplitMapButton.displayName = 'SplitMapButton';
  return React.memo(SplitMapButton);
}

export default SplitMapButtonFactory;
