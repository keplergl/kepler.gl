// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext, useId, useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {CameraBookmark, MapState} from '@kepler.gl/types';
import {MapStateActions, VisStateActions, UIStateActions} from '@kepler.gl/actions';
import {generateHashId} from '@kepler.gl/common-utils';
import {getCameraSnapshot, hexToRgb} from '@kepler.gl/utils';
import {DataVizColors} from '@kepler.gl/constants';
import {Button, InlineInput, PanelContent, StyledPanelHeader} from '../../common/styled-components';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {DND_MODIFIERS} from '../../common/dnd-layer-items';
import {DragHandle} from '../layer-panel/layer-panel-header';
import PanelHeaderActionFactory from '../panel-header-action';
import {LocationMarker, Replace, Delete, MapPin, VertDots} from '../../common/icons';
import CameraPanelHeader, {CameraPanel, CameraIconButton} from './camera-panel-header';
import {cameraTransition} from '../../camera-navigation';
import {MapViewStateContext} from '../../map-view-state-context';
import {Hint} from './zoom-opacity-config';

const PanelHeaderAction = PanelHeaderActionFactory();
const bookmarkColors = Object.values(DataVizColors).map(hexToRgb);

// Derive a display-only color from the stable ID; never add it to saved bookmark data.
function bookmarkColor(id: string) {
  const hash = Array.from(id).reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0);
  return bookmarkColors[hash % bookmarkColors.length];
}
const BookmarkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
`;
const BookmarkRow = styled(StyledPanelHeader)`
  height: 36px;
  position: relative;
  padding: 0 8px 0 4px;
  gap: 4px;
  &:hover {
    background-color: ${props => props.theme.panelBackgroundHover};
  }
  .bookmark__drag-handle {
    flex: 0 0 20px;
    touch-action: none;
    opacity: 1;
    cursor: grab;
    &:focus-visible {
      outline: 2px solid ${props => props.theme.activeColor};
    }
    &[aria-pressed='true'] {
      cursor: grabbing;
    }
  }
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
    flex: 1;
    min-width: 0;
    width: 0;
    margin: 0;
  }
`;
const Actions = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  height: 24px;
  gap: 2px;
`;
const ActionButton = styled(CameraIconButton)`
  width: 20px;
  height: 24px;
`;

function SortableBookmark({
  bookmark,
  index,
  bookmarks,
  panelId,
  enabled,
  canNavigate,
  canCapture,
  onNavigate,
  onUpdate,
  onChange
}: {
  bookmark: CameraBookmark;
  index: number;
  bookmarks: CameraBookmark[];
  panelId: string;
  enabled: boolean;
  canNavigate: boolean;
  canCapture: boolean;
  onNavigate: (bookmark: CameraBookmark) => void;
  onUpdate: (bookmark: CameraBookmark) => void;
  onChange: (bookmarks: CameraBookmark[]) => void;
}) {
  const intl = useIntl();
  const message = (key: string, fallback: string) =>
    intl.formatMessage({id: `camera.${key}`, defaultMessage: fallback});
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: bookmark.id});
  const reorderLabel = `${message('reorderBookmark', 'Reorder bookmark')}: ${bookmark.name}`;
  const actions = [
    {
      key: 'goTo',
      label: message('goTo', 'Go to'),
      Icon: LocationMarker,
      disabled: !enabled || !canNavigate,
      onClick: () => onNavigate(bookmark)
    },
    {
      key: 'updateView',
      label: message('updateView', 'Update view'),
      Icon: Replace,
      disabled: !canCapture,
      onClick: () => onUpdate(bookmark)
    },
    {
      key: 'delete',
      label: message('delete', 'Delete'),
      Icon: Delete,
      onClick: () => onChange(bookmarks.filter(item => item.id !== bookmark.id))
    }
  ];
  return (
    <BookmarkRow
      ref={setNodeRef}
      className="bookmark-row"
      data-bookmark-id={bookmark.id}
      labelRCGColorValues={bookmarkColor(bookmark.id)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : undefined
      }}
    >
      <DragHandle
        className="bookmark__drag-handle"
        listeners={{
          ...attributes,
          ...listeners,
          ref: setActivatorNodeRef,
          'aria-label': reorderLabel,
          title: reorderLabel
        }}
      >
        <VertDots height="20px" aria-hidden="true" />
      </DragHandle>
      <InlineInput
        aria-label={`${message('bookmarkName', 'Bookmark name')} ${index + 1}`}
        value={bookmark.name}
        onChange={event =>
          onChange(
            bookmarks.map(item =>
              item.id === bookmark.id ? {...item, name: event.target.value} : item
            )
          )
        }
      />
      <Actions className="bookmark-actions">
        {actions.map(({key, label, Icon, disabled, onClick}) => (
          <ActionButton
            key={key}
            aria-label={label}
            title={label}
            type="button"
            disabled={disabled}
            onClick={onClick}
          >
            <PanelHeaderAction
              id={`${panelId}-${bookmark.id}-${key}`}
              tooltip={`camera.${key}`}
              flush
              disabled={disabled}
              IconComponent={Icon}
            />
          </ActionButton>
        ))}
      </Actions>
    </BookmarkRow>
  );
}

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
  const sensors = useSensors(
    useSensor(PointerSensor, {activationConstraint: {distance: 4}}),
    useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
  );

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
              <Hint>
                {message('bookmarksHint', 'Save the current map view and return to it later.')}
              </Hint>
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
              <DndContext
                id={panelId}
                sensors={sensors}
                modifiers={DND_MODIFIERS}
                collisionDetection={args =>
                  args.pointerCoordinates ? pointerWithin(args) : closestCenter(args)
                }
                onDragEnd={({active, over}) => {
                  if (!over || active.id === over.id) return;
                  const from = bookmarks.findIndex(item => item.id === active.id);
                  const to = bookmarks.findIndex(item => item.id === over.id);
                  if (from >= 0 && to >= 0) commit(arrayMove(bookmarks, from, to));
                }}
              >
                <SortableContext
                  items={bookmarks.map(bookmark => bookmark.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <BookmarkList>
                    {bookmarks.map((bookmark, index) => (
                      <SortableBookmark
                        key={bookmark.id}
                        bookmark={bookmark}
                        index={index}
                        bookmarks={bookmarks}
                        panelId={panelId}
                        enabled={enabled}
                        canNavigate={Boolean(mapStateActions)}
                        canCapture={Boolean(readCamera())}
                        onChange={commit}
                        onNavigate={item =>
                          mapStateActions?.updateMap(cameraTransition(item.camera))
                        }
                        onUpdate={item => {
                          const camera = readCamera();
                          if (camera)
                            commit(
                              bookmarks.map(saved =>
                                saved.id === item.id ? {...saved, camera} : saved
                              )
                            );
                        }}
                      />
                    ))}
                  </BookmarkList>
                </SortableContext>
              </DndContext>
            </>
          )}
        </PanelContent>
      )}
    </CameraPanel>
  );
}
