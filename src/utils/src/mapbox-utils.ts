// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * This method validates mapbox token.
 * This token provides a simple synchronous validation
 * @param {string} token the Mapbox token to validate
 * @return {boolean} true if token is valid, false otherwise
 */
export const validateToken = (token: string): boolean => (token || '') !== '';
