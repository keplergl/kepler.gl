// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {CameraBookmark, MapState} from '@kepler.gl/types';
import {MapStateActions, VisStateActions} from '@kepler.gl/actions';
import {generateHashId} from '@kepler.gl/common-utils';
import {getCameraSnapshot} from '@kepler.gl/utils';
import {Button, Input, PanelContent, PanelHeaderTitle} from '../../common/styled-components';
import {cameraTransition} from '../../camera-navigation';
import {MapViewStateContext} from '../../map-view-state-context';

const Header = styled.button`
  background: ${props => props.theme.panelBackground};
  border: 0;
  padding: 12px;
  width: 100%;
  text-align: left;
  cursor: pointer;
`;
const BookmarkRow = styled.div`
  margin-top: 12px;
  input {
    width: 100%;
    margin-bottom: 6px;
  }
`;
const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export type CameraBookmarksProps = {
  bookmarks?: CameraBookmark[];
  mapState?: MapState;
  mapStateActions?: typeof MapStateActions;
  visStateActions: typeof VisStateActions;
};

export default function CameraBookmarks({
  bookmarks = [],
  mapState,
  mapStateActions,
  visStateActions
}: CameraBookmarksProps) {
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
    <section className="interaction-camera-bookmarks">
      <Header type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        <PanelHeaderTitle>{message('bookmarks', 'Bookmarks')}</PanelHeaderTitle>
      </Header>
      {open && (
        <PanelContent>
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
                  <Actions>
                    <Button
                      type="button"
                      secondary
                      small
                      disabled={!mapStateActions}
                      onClick={() => mapStateActions?.updateMap(cameraTransition(bookmark.camera))}
                    >
                      {message('goTo', 'Go to')}
                    </Button>
                    <Button
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
                      {message('updateView', 'Update view')}
                    </Button>
                    <Button
                      type="button"
                      secondary
                      small
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      {message('up', 'Up')}
                    </Button>
                    <Button
                      type="button"
                      secondary
                      small
                      disabled={index === bookmarks.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      {message('down', 'Down')}
                    </Button>
                    <Button
                      type="button"
                      secondary
                      small
                      onClick={() => commit(bookmarks.filter(item => item.id !== bookmark.id))}
                    >
                      {message('delete', 'Delete')}
                    </Button>
                  </Actions>
                </BookmarkRow>
              ))}
            </>
          )}
        </PanelContent>
      )}
    </section>
  );
}
