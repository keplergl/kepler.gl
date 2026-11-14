// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {ColorSchema, ColorRangeSchema, FieldSchema, NumberPairSchema, ObjectSchema} from './common';

export const TextLabelSchema = z.looseObject({
  field: z
    .union([
      FieldSchema.partial(),
      z.array(z.object({field: FieldSchema.partial().nullable(), format: z.string().nullish()}))
    ])
    .nullish(),
  size: z.number().optional(),
  color: ColorSchema.optional(),
  offset: NumberPairSchema.optional(),
  anchor: z.enum(['start', 'middle', 'end']).optional(),
  alignment: z.enum(['top', 'center', 'bottom']).optional(),
  background: z.boolean().optional(),
  backgroundColor: ColorSchema.nullish(),
  outlineColor: ColorSchema.optional(),
  outlineWidth: z.number().optional()
});

export const VisualChannelsSchema = z.record(
  z.string(),
  z.union([FieldSchema.partial(), z.string(), z.null()])
);
export const BaseLayerConfigSchema = z
  .object({
    dataId: z.string().nullable(),
    columnMode: z.string(),
    label: z.string(),
    color: ColorSchema,
    highlightColor: ColorSchema.nullable(),
    uniqueIdField: z.string().nullable(),
    columns: z.record(z.string(), z.string().nullable()),
    isVisible: z.boolean(),
    isIncludedInLegend: z.boolean(),
    visConfig: ObjectSchema,
    hidden: z.boolean(),
    textLabel: z.array(TextLabelSchema)
  })
  .partial();
export const LayerFieldsSchema = z.object({
  id: z.string(),
  type: z.string(),
  config: BaseLayerConfigSchema,
  visualChannels: VisualChannelsSchema.optional()
});

// Partial persisted configs are valid; constructors still own defaults.
function layer<Type extends string, Columns extends z.ZodRawShape, Vis extends z.ZodRawShape>(
  type: Type,
  columns: Columns,
  vis: Vis
) {
  return LayerFieldsSchema.extend({
    type: z.literal(type),
    config: BaseLayerConfigSchema.extend({
      columns: z.looseObject(columns).partial().optional(),
      // Preserve settings supplied by plugins and newer versions.
      visConfig: z.looseObject(vis).partial().optional()
    })
  });
}

export const PointLayerSchema = layer(
  'point',
  {
    lat: z.string().nullable(),
    lng: z.string().nullable(),
    geojson: z.string().nullable(),
    geoarrow: z.string().nullable(),
    altitude: z.string().nullable(),
    neighbors: z.string().nullable()
  },
  {
    pulseTrigger: z.string(),
    pulseTimeField: z.string(),
    pulseDurationMs: z.number(),
    glowEnabled: z.boolean(),
    glowExtent: z.number(),
    glowStrength: z.number(),
    pulseEnabled: z.boolean(),
    pulseMode: z.string(),
    pulseSpeed: z.number(),
    pulseExpansion: z.number(),
    radius: z.number(),
    fixedRadius: z.boolean(),
    opacity: z.number(),
    outline: z.boolean(),
    thickness: z.number(),
    strokeColor: ColorSchema.nullable(),
    colorRange: ColorRangeSchema.nullable(),
    strokeColorRange: ColorRangeSchema.nullable(),
    radiusRange: z.array(z.number()),
    filled: z.boolean(),
    billboard: z.boolean(),
    allowHover: z.boolean(),
    showNeighborOnHover: z.boolean(),
    showHighlightColor: z.boolean()
  }
);
export const ArcLayerSchema = layer(
  'arc',
  {
    lat0: z.string().nullable(),
    lng0: z.string().nullable(),
    lat1: z.string().nullable(),
    lng1: z.string().nullable(),
    lat: z.string().nullable(),
    lng: z.string().nullable(),
    neighbors: z.string().nullable(),
    geoarrow0: z.string().nullable(),
    geoarrow1: z.string().nullable()
  },
  {
    opacity: z.number(),
    thickness: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    sizeRange: z.array(z.number()),
    targetColor: ColorSchema.nullable(),
    targetArrowEnabled: z.boolean(),
    targetArrowShape: z.string(),
    targetArrowSize: z.number()
  }
);
export const LineLayerSchema = layer(
  'line',
  {
    lat0: z.string().nullable(),
    lng0: z.string().nullable(),
    lat1: z.string().nullable(),
    lng1: z.string().nullable(),
    lat: z.string().nullable(),
    lng: z.string().nullable(),
    neighbors: z.string().nullable(),
    geoarrow0: z.string().nullable(),
    geoarrow1: z.string().nullable(),
    alt0: z.string().nullable(),
    alt1: z.string().nullable(),
    alt: z.string().nullable()
  },
  {
    opacity: z.number(),
    thickness: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    sizeRange: z.array(z.number()),
    targetColor: ColorSchema.nullable(),
    targetArrowEnabled: z.boolean(),
    targetArrowShape: z.string(),
    targetArrowSize: z.number(),
    elevationScale: z.number()
  }
);
export const GridLayerSchema = layer(
  'grid',
  {lat: z.string().nullable(), lng: z.string().nullable(), geojson: z.string().nullable()},
  {
    opacity: z.number(),
    worldUnitSize: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    coverage: z.number(),
    sizeRange: z.array(z.number()),
    percentile: z.array(z.number()),
    elevationPercentile: z.array(z.number()),
    elevationScale: z.number(),
    enableElevationZoomFactor: z.boolean(),
    fixedHeight: z.boolean(),
    colorAggregation: z.string(),
    sizeAggregation: z.string(),
    enable3d: z.boolean()
  }
);
export const HexagonLayerSchema = layer(
  'hexagon',
  {lat: z.string().nullable(), lng: z.string().nullable(), geojson: z.string().nullable()},
  {
    opacity: z.number(),
    worldUnitSize: z.number(),
    resolution: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    coverage: z.number(),
    sizeRange: z.array(z.number()),
    percentile: z.array(z.number()),
    elevationPercentile: z.array(z.number()),
    elevationScale: z.number(),
    enableElevationZoomFactor: z.boolean(),
    fixedHeight: z.boolean(),
    colorAggregation: z.string(),
    sizeAggregation: z.string(),
    enable3d: z.boolean()
  }
);
export const GeojsonLayerSchema = layer(
  'geojson',
  {
    geojson: z.string().nullable(),
    id: z.string().nullable(),
    lat: z.string().nullable(),
    lng: z.string().nullable(),
    altitude: z.string().nullable(),
    sortBy: z.string().nullable()
  },
  {
    opacity: z.number(),
    strokeOpacity: z.number(),
    thickness: z.number(),
    strokeColor: ColorSchema.nullable(),
    colorRange: ColorRangeSchema.nullable(),
    strokeColorRange: ColorRangeSchema.nullable(),
    radius: z.number(),
    sizeRange: z.array(z.number()),
    radiusRange: z.array(z.number()),
    heightRange: z.array(z.number()),
    elevationScale: z.number(),
    elevationOffset: z.number(),
    elevationOffsetRange: z.array(z.number()),
    stroked: z.boolean(),
    filled: z.boolean(),
    enable3d: z.boolean(),
    wireframe: z.boolean(),
    fixedHeight: z.boolean(),
    invertHeight: z.boolean(),
    fixedElevation: z.boolean(),
    allowHover: z.boolean()
  }
);
export const ClusterLayerSchema = layer(
  'cluster',
  {lat: z.string().nullable(), lng: z.string().nullable(), geojson: z.string().nullable()},
  {
    opacity: z.number(),
    clusterRadius: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    radiusRange: z.array(z.number()),
    minClusterSize: z.number(),
    colorAggregation: z.string()
  }
);
export const IconLayerSchema = layer(
  'icon',
  {
    lat: z.string().nullable(),
    lng: z.string().nullable(),
    icon: z.string().nullable(),
    altitude: z.string().nullable(),
    angle: z.string().nullable()
  },
  {
    radius: z.number(),
    fixedRadius: z.boolean(),
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    radiusRange: z.array(z.number()),
    billboard: z.boolean()
  }
);
export const HeatmapLayerSchema = layer(
  'heatmap',
  {
    lat: z.string().nullable(),
    lng: z.string().nullable(),
    geojson: z.string().nullable(),
    geoarrow: z.string().nullable()
  },
  {
    surfaceEnabled: z.boolean(),
    surfaceHeight: z.number(),
    surfaceLighting: z.boolean(),
    surfaceContours: z.boolean(),
    surfaceContourStep: z.number(),
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    radius: z.number(),
    intensity: z.number(),
    threshold: z.number(),
    aggregation: z.string()
  }
);
export const ContourLayerSchema = layer(
  'contour',
  {
    lat: z.string().nullable(),
    lng: z.string().nullable(),
    geojson: z.string().nullable(),
    value: z.string().nullable()
  },
  {
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    colorByLevel: z.boolean(),
    gridResolution: z.number(),
    levels: z.number(),
    smoothing: z.number(),
    fillOpacity: z.number(),
    thickness: z.number(),
    filled: z.boolean(),
    stroked: z.boolean(),
    below: z.boolean(),
    customRange: z.boolean(),
    minimum: z.number(),
    maximum: z.number()
  }
);
export const VoronoiLayerSchema = layer(
  'voronoi',
  {lat: z.string().nullable(), lng: z.string().nullable(), geojson: z.string().nullable()},
  {
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    filled: z.boolean(),
    stroked: z.boolean(),
    strokeColor: ColorSchema.nullable(),
    thickness: z.number(),
    boundsPadding: z.number()
  }
);
export const HexagonIdLayerSchema = layer(
  'hexagonId',
  {hex_id: z.string().nullable()},
  {
    colorRange: ColorRangeSchema.nullable(),
    filled: z.boolean(),
    opacity: z.number(),
    outline: z.boolean(),
    strokeColor: ColorSchema.nullable(),
    strokeColorRange: ColorRangeSchema.nullable(),
    strokeOpacity: z.number(),
    thickness: z.number(),
    coverage: z.number(),
    enable3d: z.boolean(),
    sizeRange: z.array(z.number()),
    coverageRange: z.array(z.number()),
    elevationScale: z.number(),
    enableElevationZoomFactor: z.boolean(),
    fixedHeight: z.boolean()
  }
);
export const ScenegraphLayerSchema = layer(
  '3D',
  {
    lat: z.string().nullable(),
    lng: z.string().nullable(),
    geojson: z.string().nullable(),
    altitude: z.string().nullable()
  },
  {
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    sizeScale: z.number(),
    angleX: z.number(),
    angleY: z.number(),
    angleZ: z.number(),
    scenegraph: z.string(),
    scenegraphColorEnabled: z.boolean(),
    scenegraphColor: ColorSchema.nullable(),
    scenegraphCustomModelUrl: z.string()
  }
);
export const TripLayerSchema = layer(
  'trip',
  {
    geojson: z.string().nullable(),
    id: z.string().nullable(),
    lat: z.string().nullable(),
    lng: z.string().nullable(),
    timestamp: z.string().nullable(),
    altitude: z.string().nullable()
  },
  {
    opacity: z.number(),
    thickness: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    trailLength: z.number(),
    fadeTrail: z.boolean(),
    billboard: z.boolean(),
    sizeRange: z.array(z.number()),
    sizeScale: z.number(),
    scenegraph: z.string().nullable(),
    scenegraphEnabled: z.boolean(),
    scenegraphColorEnabled: z.boolean(),
    scenegraphUseTrailColor: z.boolean(),
    scenegraphColor: ColorSchema.nullable(),
    scenegraphCustomModelUrl: z.string(),
    adjustRoll: z.number(),
    adjustPitch: z.number(),
    adjustYaw: z.number(),
    invertRoll: z.boolean(),
    invertPitch: z.boolean(),
    invertYaw: z.boolean(),
    fixedRoll: z.boolean(),
    fixedPitch: z.boolean(),
    fixedYaw: z.boolean()
  }
);
export const S2LayerSchema = layer(
  's2',
  {token: z.string().nullable()},
  {
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    filled: z.boolean(),
    thickness: z.number(),
    strokeColor: ColorSchema.nullable(),
    strokeColorRange: ColorRangeSchema.nullable(),
    sizeRange: z.array(z.number()),
    stroked: z.boolean(),
    enable3d: z.boolean(),
    elevationScale: z.number(),
    enableElevationZoomFactor: z.boolean(),
    fixedHeight: z.boolean(),
    heightRange: z.array(z.number()),
    wireframe: z.boolean()
  }
);
export const A5LayerSchema = layer(
  'a5',
  {token: z.string().nullable()},
  {
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    filled: z.boolean(),
    thickness: z.number(),
    strokeColor: ColorSchema.nullable(),
    strokeColorRange: ColorRangeSchema.nullable(),
    sizeRange: z.array(z.number()),
    stroked: z.boolean(),
    enable3d: z.boolean(),
    elevationScale: z.number(),
    enableElevationZoomFactor: z.boolean(),
    fixedHeight: z.boolean(),
    heightRange: z.array(z.number()),
    wireframe: z.boolean()
  }
);
export const GeohashLayerSchema = layer(
  'geohash',
  {token: z.string().nullable()},
  {
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    filled: z.boolean(),
    thickness: z.number(),
    strokeColor: ColorSchema.nullable(),
    strokeColorRange: ColorRangeSchema.nullable(),
    sizeRange: z.array(z.number()),
    stroked: z.boolean(),
    enable3d: z.boolean(),
    elevationScale: z.number(),
    enableElevationZoomFactor: z.boolean(),
    fixedHeight: z.boolean(),
    heightRange: z.array(z.number()),
    wireframe: z.boolean()
  }
);
export const FlowLayerSchema = layer(
  'flow',
  {
    lat0: z.string().nullable(),
    lng0: z.string().nullable(),
    lat1: z.string().nullable(),
    lng1: z.string().nullable(),
    sourceH3: z.string().nullable(),
    targetH3: z.string().nullable(),
    count: z.string().nullable(),
    sourceName: z.string().nullable(),
    targetName: z.string().nullable()
  },
  {
    colorRange: ColorRangeSchema.nullable(),
    opacity: z.number(),
    flowLinesRenderingMode: z.string(),
    flowAdaptiveScalesEnabled: z.boolean(),
    flowFadeEnabled: z.boolean(),
    flowFadeAmount: z.number(),
    maxTopFlowsDisplayNum: z.number(),
    flowLocationTotalsEnabled: z.boolean(),
    flowClusteringEnabled: z.boolean(),
    flowLineThicknessScale: z.number(),
    flowLineCurviness: z.number(),
    darkBaseMapEnabled: z.boolean()
  }
);
export const FlowFieldLayerSchema = layer(
  'flowField',
  {
    u: z.string().nullable(),
    v: z.string().nullable(),
    speed: z.string().nullable(),
    direction: z.string().nullable(),
    altitude: z.string().nullable(),
    lat: z.string().nullable(),
    lng: z.string().nullable(),
    geojson: z.string().nullable()
  },
  {
    opacity: z.number(),
    linesPerScreen: z.number(),
    zoomResponse: z.number(),
    strokeWidth: z.number(),
    colorBySpeed: z.boolean(),
    colorRange: ColorRangeSchema.nullable(),
    trailLength: z.number(),
    cycleSeconds: z.number(),
    lineLifetime: z.number(),
    seamlessLoop: z.boolean(),
    smoothing: z.number(),
    gridResolution: z.number(),
    elevationMultiplier: z.number(),
    debugGrid: z.boolean()
  }
);
export const VectorTileLayerSchema = layer(
  'vectorTile',
  {},
  {
    strokeColor: ColorSchema.nullable(),
    strokeOpacity: z.number(),
    radius: z.number(),
    radiusUnits: z.boolean(),
    enable3d: z.boolean(),
    stroked: z.boolean(),
    transition: z.boolean(),
    heightRange: z.array(z.number()),
    elevationScale: z.number(),
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    dynamicColor: z.boolean(),
    strokeColorRange: ColorRangeSchema.nullable(),
    sizeRange: z.array(z.number()),
    strokeWidth: z.number(),
    radiusRange: z.array(z.number()),
    hideNulls: z.boolean()
  }
);
export const RasterTileLayerSchema = layer(
  'rasterTile',
  {},
  {
    preset: z.string(),
    useSTACSearching: z.boolean(),
    stacSearchProvider: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    dynamicColor: z.boolean(),
    colormapId: z.string(),
    colorRange: ColorRangeSchema.nullable(),
    linearRescalingFactor: z.array(z.number()),
    nonLinearRescaling: z.boolean(),
    gammaContrastFactor: z.number(),
    sigmoidalContrastFactor: z.number(),
    sigmoidalBiasFactor: z.number(),
    saturationValue: z.number(),
    filterEnabled: z.boolean(),
    filterRange: z.array(z.number()),
    opacity: z.number(),
    allowHover: z.boolean(),
    _stacQuery: z.string().nullable(),
    singleBandName: z.string().nullable(),
    enableTerrain: z.boolean(),
    enableTerrainTopView: z.boolean(),
    showTileBorders: z.boolean(),
    showTileDebugInfo: z.boolean(),
    zoomOffset: z.number(),
    bandOverrides: z.record(z.string(), z.string()).nullable()
  }
);
export const WMSLayerSchema = layer(
  'wms',
  {},
  {
    strokeColor: ColorSchema.nullable(),
    strokeOpacity: z.number(),
    radius: z.number(),
    radiusUnits: z.boolean(),
    enable3d: z.boolean(),
    stroked: z.boolean(),
    transition: z.boolean(),
    heightRange: z.array(z.number()),
    elevationScale: z.number(),
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    dynamicColor: z.boolean(),
    allowHover: z.boolean(),
    wmsLayer: z
      .looseObject({
        name: z.string(),
        title: z.string(),
        boundingBox: z.array(z.array(z.number())),
        queryable: z.boolean(),
        legendUrl: z.string().nullish()
      })
      .nullable(),
    transparent: z.boolean()
  }
);
export const Tile3DLayerSchema = layer(
  'tile3d',
  {},
  {
    opacity: z.number(),
    pointSize: z.number()
  }
);
export const BitmapLayerSchema = layer(
  'bitmap',
  {},
  {
    opacity: z.number(),
    showBounds: z.boolean(),
    editBounds: z.boolean(),
    alignMode: z.boolean(),
    boundsWest: z.number(),
    boundsSouth: z.number(),
    boundsEast: z.number(),
    boundsNorth: z.number()
  }
);
export const ZarrLayerSchema = layer(
  'zarr',
  {},
  {
    zarrAxis: z.union([
      z.object({kind: z.enum(['auto', 'off']).optional()}),
      z.object({kind: z.literal('dimension'), dimension: z.string()}),
      z.object({kind: z.literal('forecast'), referenceTime: z.string(), leadTime: z.string()})
    ]),
    zarrFrame: z.number(),
    opacity: z.number(),
    colorRange: ColorRangeSchema.nullable(),
    rescale: NumberPairSchema.nullable(),
    zarrVariable: z.string().nullable(),
    dimensionIndexes: z.record(z.string(), z.number())
  }
);

export const BuiltInLayerSchemas = {
  point: PointLayerSchema,
  arc: ArcLayerSchema,
  line: LineLayerSchema,
  grid: GridLayerSchema,
  hexagon: HexagonLayerSchema,
  geojson: GeojsonLayerSchema,
  cluster: ClusterLayerSchema,
  icon: IconLayerSchema,
  heatmap: HeatmapLayerSchema,
  contour: ContourLayerSchema,
  voronoi: VoronoiLayerSchema,
  hexagonId: HexagonIdLayerSchema,
  '3D': ScenegraphLayerSchema,
  trip: TripLayerSchema,
  s2: S2LayerSchema,
  a5: A5LayerSchema,
  geohash: GeohashLayerSchema,
  flow: FlowLayerSchema,
  flowField: FlowFieldLayerSchema,
  vectorTile: VectorTileLayerSchema,
  rasterTile: RasterTileLayerSchema,
  wms: WMSLayerSchema,
  tile3d: Tile3DLayerSchema,
  bitmap: BitmapLayerSchema,
  zarr: ZarrLayerSchema
};
export const BuiltInLayerSchema = z.discriminatedUnion('type', [
  PointLayerSchema,
  ArcLayerSchema,
  LineLayerSchema,
  GridLayerSchema,
  HexagonLayerSchema,
  GeojsonLayerSchema,
  ClusterLayerSchema,
  IconLayerSchema,
  HeatmapLayerSchema,
  ContourLayerSchema,
  VoronoiLayerSchema,
  HexagonIdLayerSchema,
  ScenegraphLayerSchema,
  TripLayerSchema,
  S2LayerSchema,
  A5LayerSchema,
  GeohashLayerSchema,
  FlowLayerSchema,
  FlowFieldLayerSchema,
  VectorTileLayerSchema,
  RasterTileLayerSchema,
  WMSLayerSchema,
  Tile3DLayerSchema,
  BitmapLayerSchema,
  ZarrLayerSchema
]);
export const CustomLayerSchema = LayerFieldsSchema.extend({
  type: z
    .string()
    .refine(
      type => !Object.prototype.hasOwnProperty.call(BuiltInLayerSchemas, type),
      'Expected a custom layer type'
    )
});
// Invalid built-ins cannot pass validation through the custom-layer branch.
export const LayerSchema = z.union([BuiltInLayerSchema, CustomLayerSchema]);
export type Layer = z.infer<typeof LayerSchema>;
export type BuiltInLayer = z.infer<typeof BuiltInLayerSchema>;
export type PointLayer = z.infer<typeof PointLayerSchema>;
export type ArcLayer = z.infer<typeof ArcLayerSchema>;
export type LineLayer = z.infer<typeof LineLayerSchema>;
export type GridLayer = z.infer<typeof GridLayerSchema>;
export type HexagonLayer = z.infer<typeof HexagonLayerSchema>;
export type GeojsonLayer = z.infer<typeof GeojsonLayerSchema>;
export type ClusterLayer = z.infer<typeof ClusterLayerSchema>;
export type IconLayer = z.infer<typeof IconLayerSchema>;
export type HeatmapLayer = z.infer<typeof HeatmapLayerSchema>;
export type ContourLayer = z.infer<typeof ContourLayerSchema>;
export type VoronoiLayer = z.infer<typeof VoronoiLayerSchema>;
export type HexagonIdLayer = z.infer<typeof HexagonIdLayerSchema>;
export type ScenegraphLayer = z.infer<typeof ScenegraphLayerSchema>;
export type TripLayer = z.infer<typeof TripLayerSchema>;
export type S2Layer = z.infer<typeof S2LayerSchema>;
export type A5Layer = z.infer<typeof A5LayerSchema>;
export type GeohashLayer = z.infer<typeof GeohashLayerSchema>;
export type FlowLayer = z.infer<typeof FlowLayerSchema>;
export type FlowFieldLayer = z.infer<typeof FlowFieldLayerSchema>;
export type VectorTileLayer = z.infer<typeof VectorTileLayerSchema>;
export type RasterTileLayer = z.infer<typeof RasterTileLayerSchema>;
export type WMSLayer = z.infer<typeof WMSLayerSchema>;
export type Tile3DLayer = z.infer<typeof Tile3DLayerSchema>;
export type BitmapLayer = z.infer<typeof BitmapLayerSchema>;
export type ZarrLayer = z.infer<typeof ZarrLayerSchema>;
