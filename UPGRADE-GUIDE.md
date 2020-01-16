# Upgrade Guide

## Upgrade from v1.1.11 to v1.1.12

### Breaking Changes

#### Dependency Upgrade
- __react__ and __react-dom__: minimum required version is now `^16.3`
- __react-redux__ is upgraded to `^7.1.3`. If you have older version of `react-redux` in your app. You will have error loading kepler.gl, likely due to multiple version of `react-redux` installed.
- __react-palm__: required version is now `^3.1.2`.
- __react-route__: if you are using `react-router`, we suggest using `^3.2.5` to avoid `React 16.8` lifecycle deprecation warning in the console.


### Bug Fixes
- __Cluster Layer__: Fix incorrect cluster point count. Fix cluster layer missing in exported image.
