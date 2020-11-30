# Upgrade Guide

## Table of Content
- [v2.3 to v2.4](#upgrade-from-v23-to-v24)

- [v2.2 to v2.3](#upgrade-from-v22-to-v23)
- [v2.1 to v2.2](#upgrade-from-v21-to-v22)
- [v2.0 to v2.1](#upgrade-from-v20-to-v21)
- [v1.1.12 to v2.0](#upgrade-from-v1112-to-v20)
- [v1.1.11 to v1.1.12](#upgrade-from-v1111-to-v1112)

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
- __Interaction__  - Added Geocoder in the interactin panel

### Improvements
- __Localization__ - Added Spanish, Catalan, and Portuguese translations

### Bug Fixes
- __Layer__ - Aggregation layer fix out-of-domain coloring for valid strings
- __Export__ - Fixed download file for microsoft edge

### API Update
- __Components__ - Exported map drawing editor factories

## Upgrade from v2.0 to v2.1
### Breaking Changes
- Upgrade Node v10 for dev development, node requirement is now at `>=10.15.0`

### New Features
- __Provider__  - Add cloud provider API 
- __Layer__ - Added S2 Layer
- __Basemap__ - Added satellite to base map styles options
- __Theme__ - Added base UI theme to theme option as `base`

### Improvements
- __UI__ - Improved data table and layer panel header
- __Filter__ - Better handle filter steps for small domains

### Bug Fixes
- __Layer__ - Remove incorrect outlier for better map center detection
- __Layer__ - Fix point layer stroke width
- __Basemap__ - Fix bug custom map style not saved correctly 
- __Export__ - Fix bug exported html blank

-----
## Upgrade from v1.1.12 to v2.0

### Breaking Changes
- Upgrade deck.gl to `8.0.15`, this only affects projects with deck.gl in its dependencies. Because only one version of deck.gl can be loaded.

### New Features
- __GPU Filter__  - Improved time and numeric filter performance by moving calculation to GPU
- __Geo Fitler__ - Added drawing polygon function, allow filter layer based on polygon

### Improvements
- __Layer__ - Improved GeoJson and H3 layer geometry rendering
- __UI__ - Support custom side panel tabs. [example](https://github.com/keplergl/kepler.gl/tree/master/examples/replace-component)

### Bug Fixes


-----
## Upgrade from v1.1.11 to v1.1.12

### Breaking Changes

#### Dependency Upgrade
- __react__ and __react-dom__: minimum required version is now `^16.3`
- __react-redux__ is upgraded to `^7.1.3`. If you have older version of `react-redux` in your app. You will have error loading kepler.gl, likely due to multiple version of `react-redux` installed.
- __react-palm__: required version is now `^3.1.2`.
- __react-route__: if you are using `react-router`, we suggest using `^3.2.5` to avoid `React 16.8` lifecycle deprecation warning in the console.


### Bug Fixes
- __Cluster Layer__: Fix incorrect cluster point count. Fix cluster layer missing in exported image.
