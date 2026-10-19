// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext, useId, useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {CameraBookmark, MapState} from '@kepler.gl/types';
import {MapStateActions, VisStateActions, UIStateActions} from '@kepler.gl/actions';
import {generateHashId} from '@kepler.gl/common-utils';
import {getCameraSnapshot} from '@kepler.gl/utils';
import {Button, Input, PanelContent} from '../../common/styled-components';
import {LocationMarker, Replace, ArrowUp, ArrowDown, Delete, MapPin} from '../../common/icons';
import CameraPanelHeader, {CameraPanel} from './camera-panel-header';
import {cameraTransition} from '../../camera-navigation';
import {MapViewStateContext} from '../../map-view-state-context';

const BookmarkRow = styled.div`
  margin-top: 12px;
  @media (hover: hover) and (pointer: fine) {
    .bookmark-actions {
      opacity: 0;
      pointer-events: none;
    }
    &:hover .bookmark-actions,
    &:focus-within .bookmark-actions {
      opacity: 1;
      pointer-events: auto;
    }
  }
  input {
    width: 100%;
    margin-bottom: 6px;
  }
`;
const Actions = styled.div`
  display: flex;
  height: 28px;
  gap: 4px;
`;

const ActionButton = styled(Button)`
  width: 28px;
  height: 28px;
  padding: 0;
  svg {
    margin: 0;
  }
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
  }
`;

export type CameraBookmarksProps = {
  bookmarks?: CameraBookmark[];
  enabled?: boolean;
  uiStateActions?: typeof UIStateActions;
  mapState?: MapState;
  mapStateActions?: typeof MapStateActions;
  visStateActions: typeof VisStateActions;
};

export default function CameraBookmarks({
  bookmarks = [],
  enabled = true,
  uiStateActions,
  mapState,
  mapStateActions,
  visStateActions
}: CameraBookmarksProps) {
  const panelId = `camera-bookmarks-${useId()}`;
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const message = (key: string, fallback: string) =>
    intl.formatMessage({id: `camera.${key}`, defaultMessage: fallback});
  const supported = mapState && !mapState.isSplit && !mapState.globe?.enabled;
  const {getInternalViewState} = useContext(MapViewStateContext);
  const readCamera = () => getCameraSnapshot(getInternalViewState()) || getCameraSnapshot(mapState);
  const commit = visStateActions.setCameraBookmarks;
  const move = (index: number, offset: number) => {
    const next = [...bookmarks];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    commit(next);
  };

  return (
    <CameraPanel className="interaction-panel interaction-camera-bookmarks">
      <CameraPanelHeader
        id={panelId}
        title={message('bookmarks', 'Bookmarks')}
        enableLabel={message('enableBookmarks', 'Enable bookmarks')}
        Icon={MapPin}
        open={open}
        enabled={enabled}
        onToggleOpen={() => setOpen(!open)}
        onToggleEnabled={
          uiStateActions
            ? () => uiStateActions.setMapControlVisibility('cameraBookmarks', !enabled)
            : undefined
        }
      />
      {open && (
        <PanelContent id={`${panelId}-content`}>
          {!supported ? (
            <p>{message('singleMap', 'Use a single 2D or 3D map to edit camera views.')}</p>
          ) : (
            <>
              <Button
                type="button"
                secondary
                small
                disabled={!readCamera()}
                onClick={() => {
                  const camera = readCamera();
                  if (camera)
                    commit([
                      ...bookmarks,
                      {
                        id: generateHashId(6),
                        name: `${message('bookmark', 'Bookmark')} ${bookmarks.length + 1}`,
                        camera
                      }
                    ]);
                }}
              >
                {message('captureBookmark', 'Bookmark current view')}
              </Button>
              {bookmarks.map((bookmark, index) => (
                <BookmarkRow key={bookmark.id}>
                  <Input
                    aria-label={`${message('bookmarkName', 'Bookmark name')} ${index + 1}`}
                    value={bookmark.name}
                    onChange={event =>
                      commit(
                        bookmarks.map(item =>
                          item.id === bookmark.id ? {...item, name: event.target.value} : item
                        )
                      )
                    }
                  />
                  <Actions className="bookmark-actions">
                    <ActionButton
                      aria-label={message('goTo', 'Go to')}
                      title={message('goTo', 'Go to')}
                      type="button"
                      secondary
                      small
                      disabled={!enabled || !mapStateActions}
                      onClick={() => mapStateActions?.updateMap(cameraTransition(bookmark.camera))}
                    >
                      <LocationMarker height="16px" aria-hidden="true" />
                    </ActionButton>
                    <ActionButton
                      aria-label={message('updateView', 'Update view')}
                      title={message('updateView', 'Update view')}
                      type="button"
                      secondary
                      small
                      disabled={!readCamera()}
                      onClick={() => {
                        const camera = readCamera();
                        if (camera)
                          commit(
                            bookmarks.map(item =>
                              item.id === bookmark.id ? {...item, camera} : item
                            )
                          );
                      }}
                    >
                      <Replace height="16px" aria-hidden="true" />
                    </ActionButton>
                    <ActionButton
                      aria-label={message('up', 'Up')}
                      title={message('up', 'Up')}
                      type="button"
                      secondary
                      small
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      <ArrowUp height="16px" aria-hidden="true" />
                    </ActionButton>
                    <ActionButton
                      aria-label={message('down', 'Down')}
                      title={message('down', 'Down')}
                      type="button"
                      secondary
                      small
                      disabled={index === bookmarks.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      <ArrowDown height="16px" aria-hidden="true" />
                    </ActionButton>
                    <ActionButton
                      aria-label={message('delete', 'Delete')}
                      title={message('delete', 'Delete')}
                      type="button"
                      secondary
                      small
                      onClick={() => commit(bookmarks.filter(item => item.id !== bookmark.id))}
                    >
                      <Delete height="16px" aria-hidden="true" />
                    </ActionButton>
                  </Actions>
                </BookmarkRow>
              ))}
            </>
          )}
        </PanelContent>
      )}
    </CameraPanel>
  );
}
