// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {MAP_INFO_CHARACTER} from '@kepler.gl/constants';

/** Keep a name or description only when it has visible text. Blank stays unset. */
export function optionalMapText(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }
  return value;
}

/** Title and description to persist. Omitted when both are unset. */
export function optionalMapInfo(
  info?: {title?: unknown; description?: unknown} | null
): {title?: string; description?: string} | undefined {
  const title = optionalMapText(info?.title);
  const description = optionalMapText(info?.description);
  if (title === undefined && description === undefined) {
    return undefined;
  }
  return {
    ...(title !== undefined ? {title} : {}),
    ...(description !== undefined ? {description} : {})
  };
}

export function isValidMapInfo(mapInfo) {
  const title = mapInfo?.title || '';
  const description = mapInfo?.description || '';
  return (
    title.length <= MAP_INFO_CHARACTER.title && description.length <= MAP_INFO_CHARACTER.description
  );
}
