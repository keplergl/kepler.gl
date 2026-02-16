// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';

import {_3DLayerSchema} from './3d-layer-schema';
import {ArcLayerSchema} from './arc-layer-schema';
import {ClusterLayerSchema} from './cluster-layer-schema';
import {GeojsonLayerSchema} from './geojson-layer-schema';
import {GridLayerSchema} from './grid-layer-schema';
import {HeatmapLayerSchema} from './heatmap-layer-schema';
import {HexagonIdLayerSchema} from './hexagon-id-layer-schema';
import {HexagonLayerSchema} from './hexagon-layer-schema';
import {IconLayerSchema} from './icon-layer-schema';
import {LineLayerSchema} from './line-layer-schema';
import {PointLayerSchema} from './point-layer-schema';
import {S2LayerSchema} from './s2-layer-schema';
import {TripLayerSchema} from './trip-layer-schema';
import {VectorTileLayerSchema} from './vector-tile-layer-schema';

export const LayerSchema = z.discriminatedUnion('type', [
  PointLayerSchema,
  LineLayerSchema,
  ArcLayerSchema,
  HeatmapLayerSchema,
  GridLayerSchema,
  HexagonLayerSchema,
  HexagonIdLayerSchema,
  S2LayerSchema,
  ClusterLayerSchema,
  IconLayerSchema,
  GeojsonLayerSchema,
  TripLayerSchema,
  _3DLayerSchema,
  VectorTileLayerSchema
]);

export type LayerSchema = z.infer<typeof LayerSchema>;
