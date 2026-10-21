// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import copy from 'copy-to-clipboard';
import {CameraBookmark, MapControls, MapState} from '@kepler.gl/types';
import {MapStateActions, UIStateActions} from '@kepler.gl/actions';
import {breakPointValues} from '@kepler.gl/styles';
import {hasPortableWidth} from '@kepler.gl/utils';
import {Button} from '../common/styled-components';
import {LocationMarker, Copy} from '../common/icons';
import {RootContext} from '../context';
import {cameraTransition} from '../camera-navigation';
import {DraggableLegend} from './map-legend-panel';
import MapControlPanelFactory from './map-control-panel';
import {formatMapCoordinate} from './coordinate-info';

const MapControlPanel = MapControlPanelFactory();
const Rows = styled.nav`
  padding: 8px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin-bottom: 4px;
  @media (hover: hover) and (pointer: fine) {
    .camera-bookmark-copy {
      opacity: 0;
      pointer-events: none;
    }
    &:hover .camera-bookmark-copy,
    &:has(:focus-visible) .camera-bookmark-copy {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;
const NavigateButton = styled(Button)`
  flex: 1;
  min-width: 0;
  justify-content: flex-start;
  gap: 8px;
  svg {
    flex: 0 0 auto;
  }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const CopyButton = styled(Button)`
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  padding: 0;
  svg {
    margin: 0;
  }
`;
const Status = styled.div`
  color: ${props => props.theme.textColor};
  font-size: 11px;
`;

export default function CameraBookmarkControl({
  bookmarks = [],
  mapState,
  mapStateActions,
  mapControls,
  setMapControlSettings,
  setMapControlVisibility,
  activeSidePanel,
  isExport
}: {
  bookmarks?: CameraBookmark[];
  mapState?: MapState;
  mapStateActions?: typeof MapStateActions;
  mapControls?: MapControls;
  setMapControlSettings?: typeof UIStateActions.setMapControlSettings;
  setMapControlVisibility?: typeof UIStateActions.setMapControlVisibility;
  activeSidePanel?: string | null;
  isExport?: boolean;
}) {
  const intl = useIntl();
  const root = useContext(RootContext);
  const [status, setStatus] = useState('');
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    // Resolve after refs attach so an initial render stays inside its own map root.
    setPortalContainer(root?.current ?? document.body);
  }, [root]);
  const message = (key: string, fallback: string) =>
    intl.formatMessage({id: `camera.${key}`, defaultMessage: fallback});
  if (
    !bookmarks.length ||
    !mapState ||
    !mapStateActions ||
    isExport ||
    mapState.isSplit ||
    mapState.globe?.enabled ||
    mapControls?.cameraBookmarks?.show === false
  )
    return null;

  const title = message('bookmarks', 'Bookmarks');
  const panel = (
    <MapControlPanel
      header="camera.bookmarks"
      disableClose={!setMapControlVisibility}
      onClick={event => {
        event.preventDefault();
        setMapControlVisibility?.('cameraBookmarks', false);
      }}
      className="camera-bookmark-panel"
    >
      <Rows aria-label={title}>
        {bookmarks.map((bookmark, index) => {
          const name = bookmark.name || `${message('bookmark', 'Bookmark')} ${index + 1}`;
          const coordinates = formatMapCoordinate([
            bookmark.camera.longitude,
            bookmark.camera.latitude
          ]);
          const copyLabel = `${message('copyCoordinates', 'Copy coordinates')}: ${name}`;
          return (
            <Row key={bookmark.id}>
              <NavigateButton
                type="button"
                secondary
                small
                title={name}
                onClick={() => mapStateActions.updateMap(cameraTransition(bookmark.camera))}
              >
                <LocationMarker height="16px" aria-hidden="true" />
                <span>{name}</span>
              </NavigateButton>
              <CopyButton
                className="camera-bookmark-copy"
                type="button"
                secondary
                small
                aria-label={copyLabel}
                title={copyLabel}
                disabled={!coordinates}
                onClick={() => {
                  const copied = coordinates && copy(coordinates);
                  setStatus(copied ? '' : message('copyFailed', 'Could not copy coordinates'));
                }}
              >
                <Copy height="16px" aria-hidden="true" />
              </CopyButton>
            </Row>
          );
        })}
        <Status role="status" aria-live="polite">
          {status}
        </Status>
      </Rows>
    </MapControlPanel>
  );

  if (!setMapControlSettings || hasPortableWidth(breakPointValues)) return panel;
  return createPortal(
    <DraggableLegend
      controlId="cameraBookmarks"
      label={title}
      isSidePanelShown={Boolean(activeSidePanel)}
      mapControls={mapControls || {}}
      setMapControlSettings={setMapControlSettings}
      mapState={mapState}
    >
      {panel}
    </DraggableLegend>,
    portalContainer ?? root?.current ?? document.body
  );
}
