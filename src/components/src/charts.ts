// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Chart panel factories. Import these from `@kepler.gl/components/charts`
 * (not the main `@kepler.gl/components` barrel) so apps that disable the charts
 * panel never load `@kepler.gl/charts`.
 */
export {default as ChartManagerFactory} from './map/charts/chart-manager';
export {default as ChartPanelContentFactory} from './map/charts/chart-panel';
export {default as ChartTypeSelectorFactory} from './map/charts/chart-type-selector';
