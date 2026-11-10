// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

export function requireValue<T>(value: T): NonNullable<T> {
  if (value == null) {
    throw new Error(`Expected a test value, received ${value}.`);
  }
  return value;
}
