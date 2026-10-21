// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useContext, useId, useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {
  CameraBookmark,
  CameraSnapshot,
  CameraTour,
  CameraTourStop,
  MapState
} from '@kepler.gl/types';
import {MapStateActions, UIStateActions, VisStateActions} from '@kepler.gl/actions';
import {generateHashId} from '@kepler.gl/common-utils';
import {getCameraSnapshot, normalizeCameraTour} from '@kepler.gl/utils';
import {Button, Input, PanelContent, PanelLabel} from '../../common/styled-components';
import {MapViewStateContext} from '../../map-view-state-context';
import useCameraTourPlayback from './use-camera-tour-playback';
import CameraPanelHeader, {CameraPanel} from './camera-panel-header';
import {Play} from '../../common/icons';

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
`;
const StopList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;
const Timing = styled.div`
  display: flex;
  gap: 8px;
  margin: 8px 0;
  label {
    flex: 1;
    min-width: 0;
  }
  input {
    width: 100%;
  }
`;
const Timeline = styled.div`
  margin-top: 16px;
  input {
    width: 100%;
  }
`;
const Markers = styled.div`
  position: relative;
  height: 28px;
  margin: 0 12px;
  button {
    position: absolute;
    transform: translateX(-50%);
    padding: 2px 5px;
  }
  [aria-current='step'] {
    outline: 2px solid ${props => props.theme.textColor};
  }
`;
const BookmarkSelect = styled.select`
  background: ${props => props.theme.inputBgd};
  color: ${props => props.theme.textColor};
  border: 1px solid ${props => props.theme.panelBorderColor};
  max-width: 100%;
  padding: 6px;
`;

export type CameraTourConfigProps = {
  tour?: CameraTour | null;
  enabled?: boolean;
  uiStateActions?: typeof UIStateActions;
  bookmarks?: CameraBookmark[];
  mapState?: MapState;
  mapStateActions?: typeof MapStateActions;
  visStateActions: typeof VisStateActions;
};

export default function CameraTourConfig({
  tour,
  enabled = true,
  uiStateActions,
  bookmarks = [],
  mapState,
  mapStateActions,
  visStateActions
}: CameraTourConfigProps) {
  const panelId = `camera-tour-${useId()}`;
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const intl = useIntl();
  const message = (key: string, fallback: string) =>
    intl.formatMessage({id: `camera.${key}`, defaultMessage: fallback});
  const seconds = (time: number) =>
    `${intl.formatNumber(time / 1000, {maximumFractionDigits: 2})} s`;
  const {getInternalViewState} = useContext(MapViewStateContext);
  const readCamera = () => getCameraSnapshot(getInternalViewState()) || getCameraSnapshot(mapState);
  const supported = Boolean(mapState && !mapState.isSplit && !mapState.globe?.enabled);
  const playback = useCameraTourPlayback(tour, mapStateActions?.updateMap, supported && enabled);
  const stops = tour?.stops || [];
  const selected = stops.find(stop => stop.id === selectedId) || stops[0];
  const selectedIndex = selected ? stops.indexOf(selected) : -1;
  let time = 0;
  const starts = stops.map(stop => {
    const start = time;
    time += stop.holdDurationMs + stop.travelDurationMs;
    return start;
  });
  const currentIndex = starts.reduce(
    (current, start, index) => (start <= playback.elapsed ? index : current),
    0
  );
  const commit = (next: CameraTourStop[]) => {
    // Reject unsafe combined durations without clearing the existing tour.
    if (next.length && !normalizeCameraTour({stops: next})) return;
    playback.pause();
    visStateActions.setCameraTour(next.length ? {stops: next} : null);
  };
  const add = (camera: CameraSnapshot | null, name?: string) => {
    if (!camera) return;
    const id = generateHashId(6);
    commit([
      ...stops,
      {
        id,
        name: name || `${message('stop', 'Stop')} ${stops.length + 1}`,
        camera,
        holdDurationMs: 2000,
        travelDurationMs: 3000
      }
    ]);
    setSelectedId(id);
  };
  const update = (changes: Partial<CameraTourStop>) => {
    if (selected)
      commit(stops.map(stop => (stop.id === selected.id ? {...stop, ...changes} : stop)));
  };
  const move = (offset: number) => {
    const next = [...stops];
    [next[selectedIndex], next[selectedIndex + offset]] = [
      next[selectedIndex + offset],
      next[selectedIndex]
    ];
    commit(next);
  };
  const select = (index: number) => {
    setSelectedId(stops[index].id);
    playback.seek(starts[index]);
  };

  return (
    <CameraPanel className="interaction-camera-tour">
      <CameraPanelHeader
        id={panelId}
        title={message('animation', 'Camera animation')}
        enableLabel={message('enableAnimation', 'Enable camera animation')}
        open={open}
        enabled={enabled}
        onToggleOpen={() => setOpen(!open)}
        onToggleEnabled={
          uiStateActions
            ? () => {
                playback.pause();
                uiStateActions.setMapControlVisibility('cameraTour', !enabled);
              }
            : undefined
        }
        Icon={Play}
      />
      {open && (
        <PanelContent id={`${panelId}-content`}>
          {!supported ? (
            <p>{message('singleMap', 'Use a single 2D or 3D map to edit camera views.')}</p>
          ) : (
            <>
              <Actions>
                <Button
                  type="button"
                  secondary
                  small
                  disabled={!readCamera()}
                  onClick={() => add(readCamera())}
                >
                  {message('captureStop', 'Add current view')}
                </Button>
                {bookmarks.length > 0 && (
                  <BookmarkSelect
                    value=""
                    aria-label={message('fromBookmark', 'Add from bookmark')}
                    onChange={event => {
                      const bookmark = bookmarks.find(item => item.id === event.target.value);
                      if (bookmark) add(getCameraSnapshot(bookmark.camera), bookmark.name);
                    }}
                  >
                    <option value="">{message('fromBookmark', 'Add from bookmark')}</option>
                    {bookmarks.map(bookmark => (
                      <option key={bookmark.id} value={bookmark.id}>
                        {bookmark.name}
                      </option>
                    ))}
                  </BookmarkSelect>
                )}
              </Actions>
              {!stops.length && <p>{message('tourEmpty', 'Add views to create a camera tour.')}</p>}
              <StopList>
                {stops.map((stop, index) => (
                  <Button
                    key={stop.id}
                    type="button"
                    secondary
                    small
                    aria-pressed={selected?.id === stop.id}
                    onClick={() => select(index)}
                  >
                    {index + 1}. {stop.name}
                  </Button>
                ))}
              </StopList>
              {selected && (
                <>
                  <Input
                    aria-label={message('stopName', 'Stop name')}
                    value={selected.name}
                    onChange={event => update({name: event.target.value})}
                  />
                  <Timing>
                    {(['holdDurationMs', 'travelDurationMs'] as const).map(key =>
                      key === 'travelDurationMs' && selectedIndex === stops.length - 1 ? null : (
                        <PanelLabel key={key}>
                          {key === 'holdDurationMs'
                            ? message('hold', 'Hold (seconds)')
                            : message('travel', 'Travel to next (seconds)')}
                          <Input
                            type="number"
                            min={0}
                            step={0.1}
                            value={selected[key] / 1000}
                            onChange={event => {
                              const secondsValue = event.target.valueAsNumber;
                              if (
                                Number.isFinite(secondsValue) &&
                                secondsValue >= 0 &&
                                secondsValue * 1000 <= Number.MAX_SAFE_INTEGER
                              )
                                update({[key]: secondsValue * 1000});
                            }}
                          />
                        </PanelLabel>
                      )
                    )}
                  </Timing>
                  <Actions>
                    <Button
                      type="button"
                      secondary
                      small
                      disabled={!readCamera()}
                      onClick={() => {
                        const camera = readCamera();
                        if (camera) update({camera});
                      }}
                    >
                      {message('updateView', 'Update view')}
                    </Button>
                    <Button
                      type="button"
                      secondary
                      small
                      onClick={() => {
                        const id = generateHashId(6);
                        const next = [...stops];
                        next.splice(selectedIndex + 1, 0, {
                          ...selected,
                          id,
                          camera: {...selected.camera}
                        });
                        commit(next);
                        setSelectedId(id);
                      }}
                    >
                      {message('duplicate', 'Duplicate')}
                    </Button>
                    <Button
                      type="button"
                      secondary
                      small
                      disabled={selectedIndex === 0}
                      onClick={() => move(-1)}
                    >
                      {message('up', 'Up')}
                    </Button>
                    <Button
                      type="button"
                      secondary
                      small
                      disabled={selectedIndex === stops.length - 1}
                      onClick={() => move(1)}
                    >
                      {message('down', 'Down')}
                    </Button>
                    <Button
                      type="button"
                      secondary
                      small
                      onClick={() => commit(stops.filter(stop => stop.id !== selected.id))}
                    >
                      {message('delete', 'Delete')}
                    </Button>
                  </Actions>
                  <Timeline>
                    <Markers>
                      {stops.map((stop, index) => (
                        <Button
                          key={stop.id}
                          type="button"
                          secondary
                          small
                          title={stop.name}
                          disabled={!enabled || !mapStateActions}
                          aria-label={`${message('goToStop', 'Go to stop')} ${index + 1}: ${
                            stop.name
                          }`}
                          aria-current={currentIndex === index ? 'step' : undefined}
                          style={{
                            left: `${
                              playback.duration ? (starts[index] / playback.duration) * 100 : 0
                            }%`
                          }}
                          onClick={() => select(index)}
                        >
                          {index + 1}
                        </Button>
                      ))}
                    </Markers>
                    <input
                      type="range"
                      min={0}
                      max={playback.duration}
                      step="any"
                      value={playback.elapsed}
                      disabled={!enabled || !playback.duration || !mapStateActions}
                      aria-label={message('scrub', 'Camera tour time')}
                      aria-valuetext={seconds(playback.elapsed)}
                      onChange={event => playback.seek(Number(event.target.value))}
                    />
                    <p>
                      <output aria-label={message('elapsed', 'Elapsed time')}>
                        {seconds(playback.elapsed)}
                      </output>{' '}
                      /{' '}
                      <output aria-label={message('duration', 'Tour duration')}>
                        {seconds(playback.duration)}
                      </output>
                    </p>
                    <Actions>
                      <Button
                        type="button"
                        secondary
                        small
                        disabled={!enabled || !playback.duration || !mapStateActions}
                        onClick={playback.playing ? playback.pause : playback.play}
                      >
                        {playback.playing ? message('pause', 'Pause') : message('play', 'Play')}
                      </Button>
                      <Button
                        type="button"
                        secondary
                        small
                        disabled={!enabled || !mapStateActions}
                        onClick={() => playback.seek(0)}
                      >
                        {message('restart', 'Restart')}
                      </Button>
                    </Actions>
                  </Timeline>
                </>
              )}
            </>
          )}
        </PanelContent>
      )}
    </CameraPanel>
  );
}
