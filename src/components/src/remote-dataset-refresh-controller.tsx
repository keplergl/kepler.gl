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

  const pollKey = JSON.stringify(
    pollTargets.slice().sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  );

  useEffect(() => {
    const targets: {id: string; intervalMs: number}[] = JSON.parse(pollKey);
    if (!refreshDataset || !targets.length) {
      return undefined;
    }
    const timers = targets.map(target =>
      window.setInterval(() => refreshDataset(target.id), target.intervalMs)
    );
    return () => {
      timers.forEach(timer => window.clearInterval(timer));
    };
  }, [pollKey, refreshDataset]);

  return null;
}
