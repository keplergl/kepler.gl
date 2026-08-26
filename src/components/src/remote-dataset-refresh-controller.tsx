// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useEffect, useMemo} from 'react';
import {DatasetType, getDatasetRefreshIntervalMs} from '@kepler.gl/constants';
import {Datasets} from '@kepler.gl/table';

type RemoteDatasetRefreshControllerProps = {
  datasets: Datasets;
  refreshDataset?: (dataId: string) => void;
};

/**
 * Polls remotely hosted datasets that have metadata.refreshIntervalMs set.
 * Lives on KeplerGl so polling continues when the side panel is closed.
 */
export default function RemoteDatasetRefreshController({
  datasets,
  refreshDataset
}: RemoteDatasetRefreshControllerProps) {
  const pollTargets = useMemo(
    () =>
      Object.values(datasets)
        .filter(
          dataset =>
            dataset.type === DatasetType.EXTERNALLY_HOSTED &&
            getDatasetRefreshIntervalMs(dataset.metadata) > 0
        )
        .map(dataset => ({
          id: dataset.id,
          intervalMs: getDatasetRefreshIntervalMs(dataset.metadata)
        })),
    [datasets]
  );

  const pollKey = pollTargets
    .map(target => `${target.id}:${target.intervalMs}`)
    .sort()
    .join('|');

  useEffect(() => {
    if (!refreshDataset || !pollKey) {
      return undefined;
    }
    const targets = pollKey.split('|').map(entry => {
      const sep = entry.lastIndexOf(':');
      return {id: entry.slice(0, sep), intervalMs: Number(entry.slice(sep + 1))};
    });
    const timers = targets.map(target =>
      window.setInterval(() => refreshDataset(target.id), target.intervalMs)
    );
    return () => {
      timers.forEach(timer => window.clearInterval(timer));
    };
  }, [pollKey, refreshDataset]);

  return null;
}
