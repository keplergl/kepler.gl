# Upgrade Guide

## Table of Content

- [v2.3 to v2.4](#upgrade-from-v23-to-v24)

- [v2.2 to v2.3](#upgrade-from-v22-to-v23)
- [v2.1 to v2.2](#upgrade-from-v21-to-v22)
- [v2.0 to v2.1](#upgrade-from-v20-to-v21)
- [v1.1.12 to v2.0](#upgrade-from-v1112-to-v20)
- [v1.1.11 to v1.1.12](#upgrade-from-v1111-to-v1112)

## Upgrade from v2.4 to v3.0

- TBD

## Upgrade from v2.3 to v2.4

### Breaking Changes

- Supports React 17
- Dependency Upgrades, major ones: `d3-xxx@^2`, `redux@4.0.5`, `type-analyzer@0.3.0`, `react-palm@~3.3.7`

### New Features

- Support incremental timeline animation
- Allow changing dataset in layer config
- Enable polygon filter for h3 layer
- Show last added filter at the top

### Bug Fixes

- Avoid duplicated h3 layer detection
- Fixed bug when reversing color palette not update

## Upgrade from v2.2 to v2.3

- Upgrade dependencies to `deck.gl@8.2.0`, `loaders.gl@2.2.5` and `luma.gl@8.2.0`. This should only affects projects with the above libraries in its dependencies.

## Upgrade from v2.1 to v2.2

### New Features

- **Interaction** - Added Geocoder in the interactin panel

### Improvements

- **Localization** - Added Spanish, Catalan, and Portuguese translations

### Bug Fixes

- **Layer** - Aggregation layer fix out-of-domain coloring for valid strings
- **Export** - Fixed download file for microsoft edge

### API Update

- **Components** - Exported map drawing editor factories

## Upgrade from v2.0 to v2.1

### Breaking Changes

- Upgrade Node v10 for dev development, node requirement is now at `>=10.15.0`

### New Features

- **Provider** - Add cloud provider API
- **Layer** - Added S2 Layer
- **Basemap** - Added satellite to base map styles options
- **Theme** - Added base UI theme to theme option as `base`

### Improvements

- **UI** - Improved data table and layer panel header
- **Filter** - Better handle filter steps for small domains

### Bug Fixes

- **Layer** - Remove incorrect outlier for better map center detection
- **Layer** - Fix point layer stroke width
- **Basemap** - Fix bug custom map style not saved correctly
- **Export** - Fix bug exported html blank

---

## Upgrade from v1.1.12 to v2.0

### Breaking Changes

- Upgrade deck.gl to `8.0.15`, this only affects projects with deck.gl in its dependencies. Because only one version of deck.gl can be loaded.

### New Features

- **GPU Filter** - Improved time and numeric filter performance by moving calculation to GPU
- **Geo Fitler** - Added drawing polygon function, allow filter layer based on polygon

### Improvements

- **Layer** - Improved GeoJson and H3 layer geometry rendering
- **UI** - Support custom side panel tabs. [example](https://github.com/keplergl/kepler.gl/tree/master/examples/replace-component)

### Bug Fixes

---

## Upgrade from v1.1.11 to v1.1.12

### Breaking Changes

#### Dependency Upgrade

- **react** and **react-dom**: minimum required version is now `^16.3`
- **react-redux** is upgraded to `^7.1.3`. If you have older version of `react-redux` in your app. You will have error loading kepler.gl, likely due to multiple version of `react-redux` installed.
- **react-palm**: required version is now `^3.1.2`.
- **react-route**: if you are using `react-router`, we suggest using `^3.2.5` to avoid `React 16.8` lifecycle deprecation warning in the console.

### Bug Fixes

- **Cluster Layer**: Fix incorrect cluster point count. Fix cluster layer missing in exported image.

### Moved from `kepler.gl/utils` to `@kepler.gl/table`

- `maybeToDate`
- `getNewDatasetColor`
- `createNewDataEntry`
- `setFilterGpuMode`
- `assignGpuChannels`
- `assignGpuChannel`
- `resetFilterGpuMode`
- `getGpuFilterProps`
- `getDatasetFieldIndexForFilter`

### Moved from `kepler.gl/utils` to `@kepler.gl/reducers`

- `findMapBounds`
- `exportData`
- `TOOLTIP_MINUS_SIGN`
- `getDefaultInteraction`
- `BRUSH_CONFIG`
- `findFieldsToShow`
- `getTooltipDisplayDeltaValue`
- `getTooltipDisplayValue`
- `LayersToRender`
- `AggregationLayerHoverData`
- `LayerHoverProp`
- `findDefaultLayer`
- `calculateLayerData`
- `getLayerHoverProp`
- `renderDeckGlLayer`
- `isLayerRenderable`
- `isLayerVisible`
- `prepareLayersForDeck`
- `prepareLayersToRender`
- `getCustomDeckLayers`
- `ComputeDeckLayersProps`
- `computeDeckLayers`

### Moved from `kepler.gl/processors` to `@kepler.gl/utils`

- `ACCEPTED_ANALYZER_TYPES`
- `validateInputData`
- `getSampleForTypeAnalyze`
- `getFieldsFromData`
- `renameDuplicateFields`
- `analyzerTypeToFieldType`

### Moved from `kepler.gl/templates` to `@kepler.gl/utils`

- `exportMapToHTML`

### Moved from `kepler.gl/layers` to `@kepler.gl/utils`

- `getCentroid`
- `idToPolygonGeo`
- `h3IsValid`
- `getHexFields`
