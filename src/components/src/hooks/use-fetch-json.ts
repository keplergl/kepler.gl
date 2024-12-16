// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {fetch} from 'global';
import {useCallback, useEffect, useState} from 'react';

import {JsonObjectOrArray} from '@kepler.gl/types';

export type FetchJsonProps = {
  url: string | null;
  options?: JsonObjectOrArray;
  process?: (json: JsonObjectOrArray) => JsonObjectOrArray | Error | null;
};

const DEFAULT_PROCESS_FUNCTION = (json: JsonObjectOrArray): JsonObjectOrArray => json;

export type UseFetchJsonReturn = {
  data: JsonObjectOrArray | null;
  loading: boolean;
  error: Error | null;
};

export default function useFetchJson({
  url,
  options,
  process = DEFAULT_PROCESS_FUNCTION
}: FetchJsonProps): UseFetchJsonReturn {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<JsonObjectOrArray | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const setProcessedData = useCallback(
    (value: JsonObjectOrArray) => {
      const processedData = process(value);
      if (processedData instanceof Error) {
        setError(processedData);
      } else {
        setData(processedData);
      }
    },
    [setError, setData, process]
  );

  useEffect(() => {
    setError(null);
    setData(null);
    if (url) {
      setLoading(true);

      fetch(url, options)
        .then(resp => {
          if (!resp.ok) {
            throw new Error(`Failed Fetch ${resp.status}`);
          }
          return resp.json();
        })
        .then(setProcessedData)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [url, options, setProcessedData]);

  return {data, loading, error};
}
