// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

/**
 * {@include ../README.md}
 * @packageDocumentation
 */

import z from 'zod';

export const KeplerMapSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastOpenedAt: z.number().optional(),
  config: z
    .object({
      version: z.literal('v1'),
      config: z.object({
        visState: z.object({}).passthrough(),
        mapState: z.object({}).passthrough(),
        mapStyle: z.object({}).passthrough(),
        uiState: z.object({}).passthrough()
      })
    })
    .optional()
});
export type KeplerMapSchema = z.infer<typeof KeplerMapSchema>;

const LegacyKeplerSliceConfig = z.object({
  currentMapId: z.string().optional(),
  maps: z.array(KeplerMapSchema).default([]),
  openTabs: z.array(z.string()).optional()
});

export const KeplerSliceConfig = z.preprocess(
  val => val,
  z.object({
    maps: z.array(KeplerMapSchema).default([])
  })
);
export type KeplerSliceConfig = z.infer<typeof KeplerSliceConfig>;

export type KeplerTabsArtifactsMigrationOptions = {
  artifactType?: string;
};

export function migrateKeplerTabsToArtifacts(
  input: unknown,
  options: KeplerTabsArtifactsMigrationOptions = {}
) {
  const legacyConfig = LegacyKeplerSliceConfig.parse(input);
  const artifactType = options.artifactType ?? 'kepler-map';
  const mapIds = legacyConfig.maps.map(map => map.id);
  const knownMapIds = new Set(mapIds);
  const openTabs = legacyConfig.openTabs?.filter(mapId => knownMapIds.has(mapId)) ?? mapIds;
  const openTabSet = new Set(openTabs);
  const currentArtifactId =
    legacyConfig.currentMapId && knownMapIds.has(legacyConfig.currentMapId)
      ? legacyConfig.currentMapId
      : openTabs[0] ?? mapIds[0];

  return {
    keplerConfig: KeplerSliceConfig.parse({
      maps: legacyConfig.maps
    }),
    artifactsConfig: {
      artifactsById: Object.fromEntries(
        legacyConfig.maps.map(map => [
          map.id,
          {
            id: map.id,
            type: artifactType,
            title: map.name
          }
        ])
      ),
      artifactOrder: mapIds,
      currentArtifactId
    },
    hiddenArtifactIds: mapIds.filter(mapId => !openTabSet.has(mapId))
  };
}
