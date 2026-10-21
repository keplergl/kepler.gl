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
import {StyledPanelHeader} from '../common/styled-components';
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
const Row = styled(StyledPanelHeader)`
  position: relative;
  width: 100%;
  height: 28px;
  min-width: 0;
  margin-bottom: 4px;
  padding: 0;
  border: 0;
  color: ${props => props.theme.textColor};
  &:hover {
    background-color: ${props => props.theme.panelBackgroundHover};
  }
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
const NavigateButton = styled.button`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  min-width: 0;
  justify-content: flex-start;
  gap: 8px;
  padding: 0 40px 0 9px;
  border: 0;
  border-radius: inherit;
  background: transparent;
  color: inherit;
  font-family: ${props => props.theme.btnFontFamily};
  font-size: ${props => props.theme.primaryBtnFontSizeSmall};
  font-weight: 500;
  line-height: 14px;
  text-align: left;
  cursor: pointer;
  outline: 0;
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
  }
  svg {
    flex: 0 0 auto;
  }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const CopyButton = styled(NavigateButton)`
  position: absolute;
  top: 0;
  right: 4px;
  width: 28px;
  height: 28px;
  justify-content: center;
  padding: 0;
  color: ${props => props.theme.panelHeaderIcon};
  &:hover {
    color: ${props => props.theme.panelHeaderIconHover};
  }
  &:disabled {
    cursor: default;
    opacity: 0.3;
  }
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
                title={name}
                onClick={() => mapStateActions.updateMap(cameraTransition(bookmark.camera))}
              >
                <LocationMarker height="16px" aria-hidden="true" />
                <span>{name}</span>
              </NavigateButton>
              <CopyButton
                className="camera-bookmark-copy"
                type="button"
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
