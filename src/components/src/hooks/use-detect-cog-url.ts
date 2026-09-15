// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useEffect, useState} from 'react';

import {isCOGUrl, probeUrlIsCOG, shouldProbeForCOG} from '@kepler.gl/common-utils';

export const COG_PROBE_DEBOUNCE_MS = 300;

export type DetectCOGUrlResult = {
  isCOG: boolean;
  probing: boolean;
};

/**
 * Detect whether a tileset metadata URL is a Cloud Optimized GeoTIFF.
 * Extension and `/cog` path matches are synchronous. Ambiguous URLs are
 * probed via HEAD / ranged GET after a short debounce so typing does not
 * fire a request on every keystroke.
 */
export default function useDetectCOGUrl(
  url: string,
  debounceMs: number = COG_PROBE_DEBOUNCE_MS
): DetectCOGUrlResult {
  const syncCOG = isCOGUrl(url);
  const needsProbe = shouldProbeForCOG(url);
  const [probed, setProbed] = useState<{url: string; isCOG: boolean} | null>(null);

  useEffect(() => {
    if (!needsProbe || syncCOG) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const isCOG = await probeUrlIsCOG(url, controller.signal);
      if (!controller.signal.aborted) {
        setProbed({url, isCOG});
      }
    }, debounceMs);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [url, needsProbe, syncCOG, debounceMs]);

  if (syncCOG) {
    return {isCOG: true, probing: false};
  }
  if (!needsProbe) {
    return {isCOG: false, probing: false};
  }
  if (probed?.url === url) {
    return {isCOG: probed.isCOG, probing: false};
  }
  return {isCOG: false, probing: true};
}
