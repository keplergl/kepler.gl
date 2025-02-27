// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Validates an url
 * @param str
 */
export function validateUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
