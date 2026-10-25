// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export type FileCacheItem = {
  data: any;
  /**
   * Cumulative Arrow snapshots replayed after the user confirms Add Data.
   * Kept outside `data` so the final staged dataset remains available for
   * validation and row-count display without being added to the map early.
   */
  progressiveData?: any[];
  info: {
    id?: string;
    label: string;
    format: string;
    type?: string;
  };
  metadata?: {
    source?: string;
    format?: string;
    sourceFormat?: string;
    [key: string]: unknown;
  };
};

export type ValidKeplerGlMap = {
  datasets: unknown;
  config: unknown;
  info: Record<string, string>;
};
