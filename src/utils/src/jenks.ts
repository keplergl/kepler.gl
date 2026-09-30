// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import quickInsertionSort from './quick-insertion-sort';

type JenksLocalResult = {
  gvf: number;
  breakValues: number[];
};

/**
 * Permutation-based Jenks natural breaks.
 * Returns k-1 thresholds for a d3 threshold scale (or fewer when unique values < k).
 */
export default function naturalBreaks(data: number[], k: number): number[] {
  const dataSize = data.length;
  const sortedData = data.slice();

  quickInsertionSort(sortedData);

  // Unique values and the first index of each in the sorted array.
  const uniqueValPositions: number[] = [];
  for (let i = 0; i < dataSize; ++i) {
    if (i === 0 || sortedData[i] !== sortedData[i - 1]) {
      uniqueValPositions.push(i);
    }
  }
  const uniqueValuesSize = uniqueValPositions.length;

  // Rule of thumb: small data size -- more permutations; large -- fewer.
  let permutation = Math.floor(44000000 / Math.max(dataSize, 1));
  if (permutation < 10) permutation = 10;
  if (permutation > 1000) permutation = 1000;

  return run();

  function run(): number[] {
    if (k <= 1 || uniqueValuesSize <= 0) {
      return [];
    }

    if (k >= uniqueValuesSize) {
      // Each unique value is its own class. A threshold scale with k colors
      // needs exactly k-1 edges, so pad duplicate thresholds only up to that.
      let breaks = uniqueValPositions.map(i => sortedData[i]);
      if (uniqueValuesSize > 1) {
        breaks = breaks.slice(1);
      }
      const lastBreak = breaks[breaks.length - 1];
      for (let i = breaks.length; i < k - 1; ++i) {
        breaks.push(lastBreak);
      }
      return breaks;
    }

    const gssd = computeGSSD();
    return findBestBreaks(gssd, permutation);
  }

  function findBestBreaks(gssd: number, perm: number): number[] {
    let bestGvf = 0;
    let bestBreaks: number[] = [];

    for (let i = 0; i < perm; ++i) {
      const localResult = computeLocalSSD(i, gssd);
      if (localResult.gvf > bestGvf) {
        bestGvf = localResult.gvf;
        bestBreaks = localResult.breakValues;
      }
    }
    return bestBreaks;
  }

  function computeGSSD(): number {
    let sum = 0;
    for (let i = 0; i < dataSize; ++i) {
      sum += sortedData[i];
    }
    const mean = dataSize === 0 ? 0 : sum / dataSize;

    let gssd = 0;
    for (let i = 0; i < dataSize; ++i) {
      const diff = sortedData[i] - mean;
      gssd += diff * diff;
    }
    return gssd;
  }

  /**
   * A single iteration of Bob Jenkins' One-At-A-Time hashing algorithm.
   * Used as a deterministic seed for the PRNG.
   */
  function hash(x: number): number {
    x += (x << 10) >>> 0;
    if (x > 4294967295) x = x & 4294967295;
    x ^= x >> 6;
    x += (x << 3) >>> 0;
    if (x > 4294967295) x = x & 4294967295;
    x ^= x >> 11;
    x += (x << 15) >>> 0;
    if (x > 4294967295) x = x & 4294967295;
    return x;
  }

  /**
   * Seeded PRNG: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
   */
  function mulberry32(a: number): () => number {
    return () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pickRandomPositions(seed: number): number[] {
    const rng = mulberry32(seed);
    const randomPositions = new Set<number>();
    // Skip index 0: a break at the first element creates an empty first class.
    const candidatePositions = uniqueValPositions.slice(1);
    const poolSize = candidatePositions.length;
    const maxRandNumber = k - 1;
    while (randomPositions.size < maxRandNumber) {
      const i = Math.floor(rng() * poolSize);
      randomPositions.add(candidatePositions[i]);
    }
    const positions = Array.from(randomPositions);
    positions.sort((a, b) => a - b);
    return positions;
  }

  function localGvf(randomPositions: number[], gssd: number): number {
    let tssd = 0;

    for (let i = 0; i < k; ++i) {
      const s = i === 0 ? 0 : randomPositions[i - 1];
      const e = i === k - 1 ? dataSize : randomPositions[i];

      let localMean = 0;
      for (let j = s; j < e; ++j) {
        localMean += sortedData[j];
      }
      localMean = localMean / (e - s);

      let localSSD = 0;
      for (let j = s; j < e; ++j) {
        const diff = sortedData[j] - localMean;
        localSSD += diff * diff;
      }
      tssd += localSSD;
    }
    return gssd === 0 ? 1 : 1 - tssd / gssd;
  }

  function computeLocalSSD(idx: number, gssd: number): JenksLocalResult {
    const randomPositions = pickRandomPositions(hash(idx));
    return {
      gvf: localGvf(randomPositions, gssd),
      breakValues: randomPositions.map(i => sortedData[i])
    };
  }
}
