// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Checks if the current device is an Apple device (Mac, iPhone, iPod, or iPad)
 * @returns {boolean} True if the current device is an Apple device
 */
export function isAppleDevice(): boolean {
  return /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);
}
