// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// git@github.com:holdenmatt/duckdb-wasm-kit.git
const FgRed = '\x1b[31m';
const ResetColors = '\x1b[0m';

/**
 * Format a time interval between start/end timestamps.
 *
 * If no end time is given, use the current time.
 */
const formatElapsedTime = (
  label: string,
  start: number,
  end: number | undefined = undefined
): string => {
  const endTime = end ?? performance.now();
  const elapsed = endTime - start;

  let timeString: string;
  switch (true) {
    case elapsed >= 1000:
      timeString = `${(elapsed / 1000).toFixed(1)}s`;
      break;
    case elapsed >= 1:
      timeString = `${elapsed.toFixed(0)}ms`;
      break;
    default:
      timeString = `${elapsed.toFixed(3)}ms`;
      break;
  }

  const message = `${FgRed}[${timeString}] ${ResetColors}${label}`;
  return message;
};

/**
 * Print the elapsed time to console.debug.
 */
export const logElapsedTime = (
  label: string,
  start: number,
  end: number | undefined = undefined
) => {
  console.debug(formatElapsedTime(label, start, end));
};
