// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Utility function to create a promise that resolves after a specified number of milliseconds
 * @param ms number of milliseconds to wait
 * @returns Promise that resolves after the specified delay
 */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
