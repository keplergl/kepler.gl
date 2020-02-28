# Upgrade Guide

## Upgrade from v1.1 to v2.0

## Upgrade from v1.1.11 to v1.1.12

### Breaking Changes

#### Dependency Upgrade

* **react** and **react-dom**: minimum required version is now `^16.3`
* **react-redux** is upgraded to `^7.1.3`. If you have older version of `react-redux` in your app. You will have error loading kepler.gl, likely due to multiple version of `react-redux` installed.
* **react-palm**: required version is now `^3.1.2`.
* **react-route**: if you are using `react-router`, we suggest using `^3.2.5` to avoid `React 16.8` lifecycle deprecation warning in the console.

### Bug Fixes

* **Cluster Layer**: Fix incorrect cluster point count. Fix cluster layer missing in exported image.

