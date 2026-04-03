/**
 * Type augmentation for deck.gl 9.x packages.
 *
 * deck.gl 9 uses .js extensions in its index.d.ts re-exports
 * (e.g. `export { default as Layer } from "./lib/layer.js"`).
 * Some TypeScript/environment combinations with moduleResolution "node"
 * cannot resolve these, making all exports invisible. This file
 * re-declares the module exports by referencing the .d.ts files directly.
 */

declare module '@deck.gl/core' {
  export {default as Deck} from '@deck.gl/core/dist/lib/deck';
  export {default as DeckRenderer} from '@deck.gl/core/dist/lib/deck-renderer';
  export {default as LayerManager} from '@deck.gl/core/dist/lib/layer-manager';
  export {default as Layer} from '@deck.gl/core/dist/lib/layer';
  export {default as CompositeLayer} from '@deck.gl/core/dist/lib/composite-layer';
  export {default as LayerExtension} from '@deck.gl/core/dist/lib/layer-extension';
  export {default as Viewport} from '@deck.gl/core/dist/viewports/viewport';
  export {default as WebMercatorViewport} from '@deck.gl/core/dist/viewports/web-mercator-viewport';
  export {default as MapView} from '@deck.gl/core/dist/views/map-view';
  export {default as View} from '@deck.gl/core/dist/views/view';
  export {default as FlyToInterpolator} from '@deck.gl/core/dist/transitions/fly-to-interpolator';
  export {default as PostProcessEffect} from '@deck.gl/core/dist/effects/post-process-effect';
  export {default as LightingEffect} from '@deck.gl/core/dist/effects/lighting/lighting-effect';
  export {AmbientLight} from '@deck.gl/core/dist/effects/lighting/ambient-light';
  export {default as _SunLight} from '@deck.gl/core/dist/effects/lighting/sun-light';
  export {COORDINATE_SYSTEM, OPERATION, UNIT} from '@deck.gl/core/dist/lib/constants';
  export {color, picking, project, project32, shadow} from '@deck.gl/core/dist/shaderlib/index';
  export {default as Attribute} from '@deck.gl/core/dist/lib/attribute/attribute';
  export {default as AttributeManager} from '@deck.gl/core/dist/lib/attribute/attribute-manager';
  export {default as Tesselator} from '@deck.gl/core/dist/utils/tesselator';
  export {deepEqual as _deepEqual} from '@deck.gl/core/dist/deep-equal';
  export {Widget} from '@deck.gl/core/dist/lib/widget';

  export type {LayersList, LayerContext} from '@deck.gl/core/dist/lib/layer-manager';
  export type {UpdateParameters} from '@deck.gl/core/dist/lib/layer';
  export type {DeckProps} from '@deck.gl/core/dist/lib/deck';
  export type {
    LayerProps,
    CompositeLayerProps,
    Accessor,
    AccessorContext,
    AccessorFunction,
    LayerData,
    LayerDataSource,
    Unit,
    Operation,
    Position,
    Color,
    TextureSource,
    Material
  } from '@deck.gl/core/dist/types/layer-props';
  export type {PickingInfo, GetPickingInfoParams} from '@deck.gl/core/dist/lib/picking/pick-info';
  export type {DefaultProps} from '@deck.gl/core/dist/lifecycle/prop-types';
  export type {CoordinateSystem} from '@deck.gl/core/dist/lib/constants';
  export type {ChangeFlags} from '@deck.gl/core/dist/lib/layer-state';
  export type {MapViewState} from '@deck.gl/core/dist/views/map-view';
  export type {Effect, PreRenderOptions, PostRenderOptions} from '@deck.gl/core/dist/lib/effect';
  export type {ControllerProps} from '@deck.gl/core/dist/controllers/controller';
  export type {BinaryAttribute} from '@deck.gl/core/dist/lib/attribute/attribute';
  export type {_ConstructorOf} from '@deck.gl/core/dist/types/types';
  export type {LightingEffectProps} from '@deck.gl/core/dist/effects/lighting/lighting-effect';
  export type {WidgetProps} from '@deck.gl/core/dist/lib/widget';
}

declare module '@deck.gl/layers' {
  export {default as ArcLayer} from '@deck.gl/layers/dist/arc-layer/arc-layer';
  export {default as BitmapLayer} from '@deck.gl/layers/dist/bitmap-layer/bitmap-layer';
  export {default as IconLayer} from '@deck.gl/layers/dist/icon-layer/icon-layer';
  export {default as LineLayer} from '@deck.gl/layers/dist/line-layer/line-layer';
  export {default as ScatterplotLayer} from '@deck.gl/layers/dist/scatterplot-layer/scatterplot-layer';
  export {default as ColumnLayer} from '@deck.gl/layers/dist/column-layer/column-layer';
  export {default as GridCellLayer} from '@deck.gl/layers/dist/column-layer/grid-cell-layer';
  export {default as PathLayer} from '@deck.gl/layers/dist/path-layer/path-layer';
  export {default as PolygonLayer} from '@deck.gl/layers/dist/polygon-layer/polygon-layer';
  export {default as GeoJsonLayer} from '@deck.gl/layers/dist/geojson-layer/geojson-layer';
  export {default as TextLayer} from '@deck.gl/layers/dist/text-layer/text-layer';
  export {default as SolidPolygonLayer} from '@deck.gl/layers/dist/solid-polygon-layer/solid-polygon-layer';
  export {default as PointCloudLayer} from '@deck.gl/layers/dist/point-cloud-layer/point-cloud-layer';

  export type {ArcLayerProps} from '@deck.gl/layers/dist/arc-layer/arc-layer';
  export type {
    BitmapLayerProps,
    BitmapBoundingBox,
    BitmapLayerPickingInfo
  } from '@deck.gl/layers/dist/bitmap-layer/bitmap-layer';
  export type {ColumnLayerProps} from '@deck.gl/layers/dist/column-layer/column-layer';
  export type {ScatterplotLayerProps} from '@deck.gl/layers/dist/scatterplot-layer/scatterplot-layer';
  export type {IconLayerProps} from '@deck.gl/layers/dist/icon-layer/icon-layer';
  export type {LineLayerProps} from '@deck.gl/layers/dist/line-layer/line-layer';
  export type {PolygonLayerProps} from '@deck.gl/layers/dist/polygon-layer/polygon-layer';
  export type {GeoJsonLayerProps} from '@deck.gl/layers/dist/geojson-layer/geojson-layer';
  export type {GridCellLayerProps} from '@deck.gl/layers/dist/column-layer/grid-cell-layer';
  export type {TextLayerProps} from '@deck.gl/layers/dist/text-layer/text-layer';
  export type {PathLayerProps} from '@deck.gl/layers/dist/path-layer/path-layer';
  export type {SolidPolygonLayerProps} from '@deck.gl/layers/dist/solid-polygon-layer/solid-polygon-layer';
  export type {PointCloudLayerProps} from '@deck.gl/layers/dist/point-cloud-layer/point-cloud-layer';
}

declare module '@deck.gl/geo-layers' {
  export {default as H3HexagonLayer} from '@deck.gl/geo-layers/dist/h3-layers/h3-hexagon-layer';
  export {default as H3ClusterLayer} from '@deck.gl/geo-layers/dist/h3-layers/h3-cluster-layer';
  export {default as S2Layer} from '@deck.gl/geo-layers/dist/s2-layer/s2-layer';
  export {default as TripsLayer} from '@deck.gl/geo-layers/dist/trips-layer/trips-layer';
  export {default as TileLayer} from '@deck.gl/geo-layers/dist/tile-layer/tile-layer';
  export {default as MVTLayer} from '@deck.gl/geo-layers/dist/mvt-layer/mvt-layer';
  export {default as TerrainLayer} from '@deck.gl/geo-layers/dist/terrain-layer/terrain-layer';
  export {default as Tile3DLayer} from '@deck.gl/geo-layers/dist/tile-3d-layer/tile-3d-layer';
  export {WMSLayer as _WMSLayer} from '@deck.gl/geo-layers/dist/wms-layer/wms-layer';

  export type {H3HexagonLayerProps} from '@deck.gl/geo-layers/dist/h3-layers/h3-hexagon-layer';
  export type {S2LayerProps} from '@deck.gl/geo-layers/dist/s2-layer/s2-layer';
  export type {
    TileLayerProps,
    TileLayerPickingInfo
  } from '@deck.gl/geo-layers/dist/tile-layer/tile-layer';
  export type {TripsLayerProps} from '@deck.gl/geo-layers/dist/trips-layer/trips-layer';
  export type {MVTLayerProps} from '@deck.gl/geo-layers/dist/mvt-layer/mvt-layer';
  export type {GeoBoundingBox, NonGeoBoundingBox} from '@deck.gl/geo-layers/dist/tileset-2d/index';
  export {Tile2DHeader as _Tile2DHeader} from '@deck.gl/geo-layers/dist/tileset-2d/index';
}

declare module '@deck.gl/aggregation-layers' {
  export {default as GridLayer} from '@deck.gl/aggregation-layers/dist/grid-layer/grid-layer';
  export {default as HexagonLayer} from '@deck.gl/aggregation-layers/dist/hexagon-layer/hexagon-layer';
  export {default as HeatmapLayer} from '@deck.gl/aggregation-layers/dist/heatmap-layer/heatmap-layer';
  export {default as ScreenGridLayer} from '@deck.gl/aggregation-layers/dist/screen-grid-layer/screen-grid-layer';
  export {default as ContourLayer} from '@deck.gl/aggregation-layers/dist/contour-layer/contour-layer';

  export type {
    GridLayerProps,
    GridLayerPickingInfo
  } from '@deck.gl/aggregation-layers/dist/grid-layer/grid-layer';
  export type {
    HexagonLayerProps,
    HexagonLayerPickingInfo
  } from '@deck.gl/aggregation-layers/dist/hexagon-layer/hexagon-layer';
  export type {HeatmapLayerProps} from '@deck.gl/aggregation-layers/dist/heatmap-layer/heatmap-layer';
  export type {ScreenGridLayerProps} from '@deck.gl/aggregation-layers/dist/screen-grid-layer/screen-grid-layer';
}

declare module '@deck.gl/mesh-layers' {
  export {default as ScenegraphLayer} from '@deck.gl/mesh-layers/dist/scenegraph-layer/scenegraph-layer';
  export {default as SimpleMeshLayer} from '@deck.gl/mesh-layers/dist/simple-mesh-layer/simple-mesh-layer';

  export type {ScenegraphLayerProps} from '@deck.gl/mesh-layers/dist/scenegraph-layer/scenegraph-layer';
  export type {SimpleMeshLayerProps} from '@deck.gl/mesh-layers/dist/simple-mesh-layer/simple-mesh-layer';
}

declare module '@deck.gl/extensions' {
  export {default as BrushingExtension} from '@deck.gl/extensions/dist/brushing/brushing-extension';
  export {default as DataFilterExtension} from '@deck.gl/extensions/dist/data-filter/data-filter-extension';
  export {default as PathStyleExtension} from '@deck.gl/extensions/dist/path-style/path-style-extension';
  export {default as FillStyleExtension} from '@deck.gl/extensions/dist/fill-style/fill-style-extension';
  export {default as ClipExtension} from '@deck.gl/extensions/dist/clip/clip-extension';
  export {default as CollisionFilterExtension} from '@deck.gl/extensions/dist/collision-filter/collision-filter-extension';
  export {default as MaskExtension} from '@deck.gl/extensions/dist/mask/mask-extension';

  export type {BrushingExtensionProps} from '@deck.gl/extensions/dist/brushing/brushing-extension';
  export type {
    DataFilterExtensionProps,
    DataFilterExtensionOptions
  } from '@deck.gl/extensions/dist/data-filter/data-filter-extension';
  export type {PathStyleExtensionProps} from '@deck.gl/extensions/dist/path-style/path-style-extension';
  export type {FillStyleExtensionProps} from '@deck.gl/extensions/dist/fill-style/fill-style-extension';
  export type {CollisionFilterExtensionProps} from '@deck.gl/extensions/dist/collision-filter/collision-filter-extension';
  export type {MaskExtensionProps} from '@deck.gl/extensions/dist/mask/mask-extension';
}

declare module '@luma.gl/core' {
  export {Texture, type TextureProps} from '@luma.gl/core/dist/adapter/resources/texture';
}
