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
