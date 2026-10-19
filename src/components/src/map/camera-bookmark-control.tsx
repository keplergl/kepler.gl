// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {CameraBookmark, MapState} from '@kepler.gl/types';
import {MapStateActions} from '@kepler.gl/actions';
import {MapControlButton} from '../common/styled-components';
import {cameraTransition} from '../camera-navigation';

const Controls = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 180px;
  max-height: 140px;
  overflow-y: auto;
`;

export default function CameraBookmarkControl({
  bookmarks = [],
  mapState,
  mapStateActions,
  isExport
}: {
  bookmarks?: CameraBookmark[];
  mapState?: MapState;
  mapStateActions?: typeof MapStateActions;
  isExport?: boolean;
}) {
  const intl = useIntl();
  if (
    !bookmarks.length ||
    !mapState ||
    !mapStateActions ||
    isExport ||
    mapState.isSplit ||
    mapState.globe?.enabled
  )
    return null;
  return (
    <Controls
      aria-label={intl.formatMessage({id: 'camera.bookmarks', defaultMessage: 'Bookmarks'})}
    >
      {bookmarks.map((bookmark, index) => (
        <MapControlButton
          key={bookmark.id}
          type="button"
          title={bookmark.name}
          aria-label={bookmark.name || `${index + 1}`}
          onClick={() => mapStateActions.updateMap(cameraTransition(bookmark.camera))}
        >
          {index + 1}
        </MapControlButton>
      ))}
    </Controls>
  );
}
