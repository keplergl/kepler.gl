// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import copy from 'copy-to-clipboard';
import {CameraBookmark, MapControlMapLegend, MapControls, MapState} from '@kepler.gl/types';
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
import {CameraTourPlaybackContext} from '../side-panel/interaction-panel/camera-tour-playback-provider';
import CameraTourPlaybackControls from '../side-panel/interaction-panel/camera-tour-playback-controls';

const ROW_HEIGHT = 28;
const ROW_GAP = 4;
const ROWS_PADDING = 8;
const MIN_CONTENT_HEIGHT = ROW_HEIGHT + ROW_GAP + ROWS_PADDING * 2;

const MapControlPanel = styled(MapControlPanelFactory())<{
  $hasPlayback: boolean;
  $hasBookmarks: boolean;
}>`
  .map-control__panel-content {
    min-height: ${props =>
      (props.$hasBookmarks ? MIN_CONTENT_HEIGHT : 0) +
      (props.$hasPlayback ? 40 : 0) +
      (props.$hasBookmarks && props.$hasPlayback ? 1 : 0)}px;
  }
`;
const PlaybackControls = styled(CameraTourPlaybackControls)`
  position: sticky;
  top: 0;
  z-index: 1;
  margin: 0;
  padding: 8px;
  background: ${props => props.theme.mapPanelBackgroundColor};
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.panelBorderColor};
  }
`;
const Rows = styled.nav`
  padding: ${ROWS_PADDING}px;
`;
const Row = styled(StyledPanelHeader)`
  position: relative;
  width: 100%;
  height: ${ROW_HEIGHT}px;
  min-width: 0;
  margin-bottom: ${ROW_GAP}px;
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
  height: ${ROW_HEIGHT}px;
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
  mapIndex = 0,
  mapStateActions,
  mapControls,
  setMapControlSettings,
  setMapControlVisibility,
  activeSidePanel,
  isExport
}: {
  bookmarks?: CameraBookmark[];
  mapState?: MapState;
  mapIndex?: number;
  mapStateActions?: typeof MapStateActions;
  mapControls?: MapControls;
  setMapControlSettings?: typeof UIStateActions.setMapControlSettings;
  setMapControlVisibility?: typeof UIStateActions.setMapControlVisibility;
  activeSidePanel?: string | null;
  isExport?: boolean;
}) {
  const intl = useIntl();
  const root = useContext(RootContext);
  const playback = useContext(CameraTourPlaybackContext);
  const showPlayback = Boolean(playback?.duration && mapControls?.cameraTour?.show);
  const showBookmarks = bookmarks.length > 0 && mapControls?.cameraBookmarks?.show === true;
  const contentHeight = (mapControls?.cameraBookmarks as MapControlMapLegend | undefined)?.settings
    ?.contentHeight;
  const previousSections = useRef({showPlayback, showBookmarks});
  useLayoutEffect(() => {
    const previous = previousSections.current;
    previousSections.current = {showPlayback, showBookmarks};
    if (
      (previous.showPlayback !== showPlayback || previous.showBookmarks !== showBookmarks) &&
      contentHeight !== undefined &&
      contentHeight > 0
    ) {
      // Return to natural height when sections change; subsequent manual resizing still applies.
      setMapControlSettings?.('cameraBookmarks', {contentHeight: 0});
    }
  }, [showPlayback, showBookmarks, contentHeight, setMapControlSettings]);
  const [status, setStatus] = useState('');
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  useEffect(() => {
    // Resolve after refs attach so an initial render stays inside its own map root.
    setPortalContainer(root?.current ?? document.body);
  }, [root]);
  const message = (key: string, fallback: string) =>
    intl.formatMessage({id: `camera.${key}`, defaultMessage: fallback});
  if ((!showBookmarks && !showPlayback) || !mapState || !mapStateActions || isExport) return null;

  const title = showBookmarks
    ? showPlayback
      ? message('animationAndBookmarks', 'Animation & Bookmarks')
      : message('bookmarks', 'Bookmarks')
    : message('animation', 'Camera animation');
  const panel = (
    <MapControlPanel
      $hasPlayback={showPlayback}
      $hasBookmarks={showBookmarks}
      header={
        showBookmarks
          ? showPlayback
            ? 'camera.animationAndBookmarks'
            : 'camera.bookmarks'
          : 'camera.animation'
      }
      disableClose={!setMapControlVisibility}
      onClick={event => {
        event.preventDefault();
        if (showBookmarks) setMapControlVisibility?.('cameraBookmarks', false);
        if (showPlayback) setMapControlVisibility?.('cameraTour', false);
      }}
      className="camera-bookmark-panel"
    >
      {showPlayback && playback && <PlaybackControls playback={playback} showTime={false} />}
      {showBookmarks && (
        <Rows aria-label={message('bookmarks', 'Bookmarks')}>
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
                  onClick={() => {
                    const viewport = cameraTransition(bookmark.camera, mapState);
                    if (mapState.isSplit) mapStateActions.updateMap(viewport, mapIndex);
                    else mapStateActions.updateMap(viewport);
                  }}
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
                  <Copy height="14px" aria-hidden="true" />
                </CopyButton>
              </Row>
            );
          })}
          <Status role="status" aria-live="polite">
            {status}
          </Status>
        </Rows>
      )}
    </MapControlPanel>
  );

  if (mapState.isSplit || !setMapControlSettings || hasPortableWidth(breakPointValues))
    return panel;
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
