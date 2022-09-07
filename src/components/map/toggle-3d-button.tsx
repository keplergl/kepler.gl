// Copyright (c) 2022 Uber Technologies, Inc.
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
import {Cube3d} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import MapControlTooltipFactory from './map-control-tooltip';
import {MapControls} from '@kepler.gl/types';

Toggle3dButtonFactory.deps = [MapControlTooltipFactory];

interface Toggle3dButtonIcons {
  cube: ComponentType<any>;
}

export type Toggle3dButtonProps = {
  dragRotate: boolean;
  onTogglePerspective: () => void;
  actionIcons: Toggle3dButtonIcons;
  mapControls: MapControls;
};

function Toggle3dButtonFactory(MapControlTooltip) {
  const defaultActionIcons = {
    cube: Cube3d
  };
  /** @type {import('./toggle-3d-button').Toggle3dButtonComponent} */
  const Toggle3dButton: React.FC<Toggle3dButtonProps> = ({
    dragRotate,
    onTogglePerspective,
    actionIcons = defaultActionIcons,
    mapControls
  }) => {
    const onClick = useCallback(
      event => {
        event.preventDefault();
        onTogglePerspective();
      },
      [onTogglePerspective]
    );

    const isVisible = useMemo(() => {
      return (mapControls?.toggle3d || {}).show;
    }, [mapControls]);

    return isVisible ? (
      <MapControlTooltip
        id="action-3d"
        message={dragRotate ? 'tooltip.disable3DMap' : 'tooltip.3DMap'}
      >
        <MapControlButton
          onClick={onClick}
          active={dragRotate}
          className={classnames('map-control-button', 'toggle-3d', {map3d: dragRotate})}
        >
          <actionIcons.cube height="22px" />
        </MapControlButton>
      </MapControlTooltip>
    ) : null;
  };

  Toggle3dButton.displayName = 'Toggle3dButton';
  return React.memo(Toggle3dButton);
}

export default Toggle3dButtonFactory;
