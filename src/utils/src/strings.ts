// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Capitalize first letter of a string
 */
export function capitalizeFirstLetter(str: string): string {
  return typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}
