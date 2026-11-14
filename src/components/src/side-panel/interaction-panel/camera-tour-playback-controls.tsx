// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {Play, Pause, Reset} from '../../common/icons';
import {CameraIconButton} from './camera-panel-header';
import type {CameraTourPlaybackContext} from './camera-tour-playback-provider';

export const CameraTourActionButton = styled(CameraIconButton)`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 2px;
  color: ${props => props.theme.textColor};
  &:hover:not(:disabled) {
    background: ${props => props.theme.panelBackgroundHover};
    color: ${props => props.theme.textColorHl};
  }
  &:disabled {
    opacity: 0.4;
  }
`;
const Timeline = styled.div.attrs({className: 'camera-tour-playback-controls'})`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`;
const Scrubber = styled.input<{$progress: number}>`
  appearance: none;
  min-width: 24px;
  flex: 1;
  height: 24px;
  margin: 0 4px;
  background: transparent;
  cursor: pointer;
  &::-webkit-slider-runnable-track {
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(
      to right,
      ${props => props.theme.activeColor} ${props => props.$progress}%,
      ${props => props.theme.sliderBarBgd} ${props => props.$progress}%
    );
  }
  &::-moz-range-track {
    height: 3px;
    border-radius: 2px;
    background: ${props => props.theme.sliderBarBgd};
  }
  &::-moz-range-progress {
    height: 3px;
    background: ${props => props.theme.activeColor};
  }
  &::-webkit-slider-thumb {
    appearance: none;
    width: 9px;
    height: 9px;
    margin-top: -3px;
    border: 0;
    border-radius: 50%;
    background: ${props => props.theme.sliderHandleColor};
  }
  &::-moz-range-thumb {
    width: 9px;
    height: 9px;
    border: 0;
    border-radius: 50%;
    background: ${props => props.theme.sliderHandleColor};
  }
  &:focus-visible {
    outline: 2px solid ${props => props.theme.activeColor};
    outline-offset: 1px;
  }
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;
const TimeReadout = styled.div<{$elapsedWidth: number}>`
  color: ${props => props.theme.textColor};
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
  output:first-child {
    display: inline-block;
    // Keep the scrubber width independent of the current time text.
    width: ${props => props.$elapsedWidth}ch;
    text-align: right;
  }
`;

export default function CameraTourPlaybackControls({
  playback,
  disabled = false,
  showTime = true,
  className
}: {
  playback: NonNullable<React.ContextType<typeof CameraTourPlaybackContext>>;
  disabled?: boolean;
  showTime?: boolean;
  className?: string;
}) {
  const intl = useIntl();
  const message = (key: string, fallback: string) =>
    intl.formatMessage({id: `camera.${key}`, defaultMessage: fallback});
  const seconds = (time: number) =>
    `${intl.formatNumber(time / 1000, {maximumFractionDigits: 2})} s`;
  return (
    <Timeline className={className}>
      <CameraTourActionButton
        type="button"
        aria-label={playback.playing ? message('pause', 'Pause') : message('play', 'Play')}
        title={playback.playing ? message('pause', 'Pause') : message('play', 'Play')}
        disabled={disabled || !playback.duration}
        onClick={playback.playing ? playback.pause : playback.play}
      >
        {playback.playing ? <Pause height="16px" /> : <Play height="16px" />}
      </CameraTourActionButton>
      <CameraTourActionButton
        type="button"
        aria-label={message('restart', 'Restart')}
        title={message('restart', 'Restart')}
        disabled={disabled}
        onClick={() => playback.seek(0)}
      >
        <Reset height="14px" />
      </CameraTourActionButton>
      <Scrubber
        $progress={playback.duration ? (playback.elapsed / playback.duration) * 100 : 0}
        type="range"
        min={0}
        max={playback.duration}
        step="any"
        value={playback.elapsed}
        disabled={disabled || !playback.duration}
        aria-label={message('scrub', 'Camera tour time')}
        aria-valuetext={seconds(playback.elapsed)}
        onChange={event => playback.seek(Number(event.target.value))}
      />
      {showTime && (
        <TimeReadout $elapsedWidth={seconds(playback.duration).length + 3}>
          <output aria-label={message('elapsed', 'Elapsed time')}>
            {seconds(playback.elapsed)}
          </output>{' '}
          /{' '}
          <output aria-label={message('duration', 'Tour duration')}>
            {seconds(playback.duration)}
          </output>
        </TimeReadout>
      )}
    </Timeline>
  );
}
