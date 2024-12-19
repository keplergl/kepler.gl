// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Inplace quick insertion sorting algorithm for numeric values
 * 1. using a stack to eliminate recursion
 * 2. sorting inplace to reduce memory usage
 * 3. using insertion sort for small partition sizes
 * The original source code is from:
 * https://www.measurethat.net/Benchmarks/Show/3549/0/javascript-sorting-algorithms
 * https://quick.work/?page=view-blog&id=24
 *
 * @param arr
 */
export default function quickInsertionSort(arr: number[]): void {
  if (!arr || arr.length < 1) {
    return;
  }
  const stack: number[][] = [];
  stack.push([0, arr.length, 2 * Math.floor(Math.log(arr.length) / Math.log(2))]);

  while (stack.length > 0) {
    const [start, end, depth] = stack[stack.length - 1];
    stack.pop();

    if (depth === 0) {
      // for worst case of quick sort: too many partitions
      shellSortBound(arr, start, end);
    } else {
      const pivot = Math.round((start + end) / 2);
      const pivotNewIndex = inplaceQuicksortPartition(arr, start, end, pivot);
      // more than 32 elements: faster to be sorted in QuickSort partition
      // less than 32 elements: faster to be sorted in InsertionSort
      if (end - pivotNewIndex > 16) {
        stack.push([pivotNewIndex, end, depth - 1]);
      }
      if (pivotNewIndex - start > 16) {
        stack.push([start, pivotNewIndex, depth - 1]);
      }
    }
  }
  insertionSort(arr);
}

/**
 * shellsort is a generalization of insertion sort
 * shellsort perform best on partially sorted array
 * Don't use shellsort on array (>10k)
 * @param arr
 * @param start
 * @param end
 *
 * Learn more about Shellsort at https://en.wikipedia.org/wiki/Shellsort
 */
function shellSortBound(arr: number[], start: number, end: number) {
  if (arr.length <= 1) return;
  let inc = Math.round((start + end) / 2);
  let i;
  let j;
  let t;

  while (inc > start) {
    for (i = inc; i < end; i++) {
      t = arr[i];
      j = i;
      while (j >= inc && arr[j - inc] > t) {
        arr[j] = arr[j - inc];
        j -= inc;
      }
      arr[j] = t;
    }
    inc = Math.round((inc - start) / 2.2 + start);
  }
}

/**
 * Insertion sort
 * @param arr
 */
function insertionSort(arr: number[]) {
  for (let i = 1, l = arr.length; i < l; i++) {
    const value = arr[i];
    let j;
    for (j = i - 1; j >= 0; j--) {
      if (arr[j] <= value) break;
      arr[j + 1] = arr[j];
    }
    arr[j + 1] = value;
  }
}

/**
 * In-place quick sort
 * @param arr
 * @param start
 * @param end
 * @param pivotIndex
 * @returns number
 */
function inplaceQuicksortPartition(
  arr: number[],
  start: number,
  end: number,
  pivotIndex: number
): number {
  let i = start;
  let j = end;
  const pivot = arr[pivotIndex];
  const partition = true;
  while (partition) {
    while (arr[i] < pivot) {
      i++;
    }
    j--;
    while (pivot < arr[j]) {
      j--;
    }
    if (!(i < j)) {
      return i;
    }
    // swap(arr, i, j);
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
    i++;
  }
  return i;
}
