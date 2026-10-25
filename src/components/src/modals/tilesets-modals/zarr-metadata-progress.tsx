// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled, {keyframes, useTheme} from 'styled-components';
import type {ZarrMetadataProgress} from '@kepler.gl/table';
import ProgressBar from '../../common/progress-bar';

const move = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(300%); }
`;

const Container = styled.div<{$indeterminate: boolean}>`
  width: 100%;
  padding: 24px;
  color: ${props => props.theme.textColor};
  font-size: 12px;

  .progress-bar {
    margin: 12px 0;
    overflow: hidden;
  }

  .progress-bar__bar {
    animation: ${props => (props.$indeterminate ? move : 'none')} 1.5s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .progress-bar__bar {
      animation: none;
    }
  }
`;

function formatBytes(bytes: number): string {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1)} kB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

export default function ZarrMetadataLoading({progress}: {progress: ZarrMetadataProgress}) {
  const theme = useTheme();
  const {phase, loadedBytes, totalBytes} = progress;
  const percent =
    phase === 'downloading' && totalBytes
      ? Math.min(99, Math.floor((loadedBytes / totalBytes) * 100))
      : undefined;
  const label =
    phase === 'connecting'
      ? loadedBytes
        ? 'Waiting for metadata response…'
        : 'Connecting to Zarr store…'
      : phase === 'downloading'
      ? 'Downloading metadata…'
      : 'Reading variables and coordinates…';
  const detail =
    phase === 'connecting'
      ? `${
          loadedBytes ? `${formatBytes(loadedBytes)} received · ` : ''
        }Waiting for the server to respond.`
      : percent !== undefined && totalBytes !== undefined
      ? `${formatBytes(loadedBytes)} / ${formatBytes(totalBytes)} received (${percent}%)`
      : `${formatBytes(loadedBytes)} received${
          phase === 'downloading' ? ' · total size unavailable' : ''
        }`;

  return (
    <Container $indeterminate={percent === undefined}>
      <div role="status">{label}</div>
      <div
        role="progressbar"
        aria-label="Zarr metadata loading"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${label} ${detail}`}
      >
        <ProgressBar
          percent={percent === undefined ? '35%' : `${percent}%`}
          height={6}
          isLoading
          barColor={theme.activeColor || ''}
          theme={theme}
        />
      </div>
      <div>{detail}</div>
    </Container>
  );
}
