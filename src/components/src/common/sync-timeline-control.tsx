// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {Tooltip} from '../common/styled-components';
import {FormattedMessage} from '@kepler.gl/localization';
import {SYNC_TIMELINE_MODES} from '@kepler.gl/constants';
import IconButton from './icon-button';

export type SyncTimelineAnimationItem = {
  id: string;
  content: React.ElementType;
  tooltip: string;
};

export type SyncTimelineControlProps = {
  syncTimelineMode: string;
  setFilterSyncTimelineMode: (id: string) => void;
  syncTimelineAnimationItems: SyncTimelineAnimationItem[];
  btnStyle: Record<string, any>;
};

export const SYNC_TIMELINE_ANIMATION_ITEMS: Record<
  string,
  {
    id: number;
    content: React.ElementType;
    tooltip: string;
  }
> = {
  [SYNC_TIMELINE_MODES.start]: {
    id: SYNC_TIMELINE_MODES.start,
    content: () => <span>Start</span>,
    tooltip: 'tooltip.syncTimelineStart'
  },
  [SYNC_TIMELINE_MODES.end]: {
    id: SYNC_TIMELINE_MODES.end,
    content: () => <span>End</span>,
    tooltip: 'tooltip.syncTimelineEnd'
  }
};

function SyncTimelineControlFactory() {
  const SyncTimelineControl = ({
    syncTimelineAnimationItems = SYNC_TIMELINE_ANIMATION_ITEMS,
    syncTimelineMode,
    btnStyle,
    setFilterSyncTimelineMode
  }) => {
    return (
      <div>
        {Object.values(syncTimelineAnimationItems)
          .filter((item, index) => item.id !== syncTimelineMode)
          .map(item => (
            <IconButton
              key={item.id}
              data-tip
              data-for={`${item.id}-tooltip`}
              className="playback-control-button"
              onClick={() => setFilterSyncTimelineMode(item.id)}
              {...btnStyle}
            >
              <item.content />
              {item.tooltip ? (
                <Tooltip id={`${item.id}-tooltip`} effect="solid" place="top">
                  <FormattedMessage id={item.tooltip} />
                </Tooltip>
              ) : null}
            </IconButton>
          ))}
      </div>
    );
  };

  return SyncTimelineControl;
}

export default SyncTimelineControlFactory;
