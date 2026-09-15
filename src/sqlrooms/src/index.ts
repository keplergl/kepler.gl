// SPDX-License-Identifier: MIT
// Copyright SQLRooms Contributors and contributors to the kepler.gl project

/**
 * {@include ../README.md}
 * @packageDocumentation
 */

export {createDefaultKeplerConfig, createKeplerSlice, useStoreWithKepler} from './KeplerSlice';
export type {
  AddTableToMapFn,
  AddTableToMapLoadOptions,
  AddTableToMapParams,
  CreateInitialMapKeplerStateContext,
  CreateKeplerSliceOptions,
  KeplerModalPortalTarget,
  KeplerSliceState
} from './KeplerSlice';
export {
  buildKeplerTableLayerOptions,
  findKeplerTableForDatasetId,
  getKeplerDatasetIdForTable,
  getKeplerTableLabel,
  shouldIncludeKeplerTable
} from './keplerTableSelection';
export type {
  KeplerDbSchemaReference,
  KeplerTableLayerOption,
  KeplerTableSelectionOptions
} from './keplerTableSelection';

export {FileDropInput} from './components/FileDropInput';
export {KeplerAddDataDialog} from './components/KeplerAddDataDialog';
export type {AddDataMethods, KeplerAddDataDialogProps} from './components/KeplerAddDataDialog';
export {KeplerAddTileSetDialog} from './components/KeplerAddTileSetDialog';
export type {LoadTileSet} from './components/KeplerAddTileSetDialog';
export {KeplerImageExport} from './components/KeplerImageExport';
export {
  configureKeplerInjector,
  getKeplerFactory,
  getKeplerInjector,
  KeplerInjector,
  resetKeplerInjectorRecipes
} from './components/KeplerInjector';
export type {KeplerFactoryRecipe, KeplerFactoryRecipeMode} from './components/KeplerInjector';
export {KeplerMapContainer} from './components/KeplerMapContainer';
export {SplitMapIndexContext} from './components/SplitMapIndexContext';
export {KeplerPlotContainer} from './components/KeplerPlotContainer';
export {KeplerProvider} from './components/KeplerProvider';
export {KeplerS3Browser} from './components/KeplerS3Browser';
export type {KeplerS3BrowserProps} from './components/KeplerS3Browser';
export {KeplerSidePanels} from './components/KeplerSidePanels';
export {useKeplerStateActions} from './hooks/useKeplerStateActions';

// Configuration is also available through the lightweight /config entry point.
// Values also export their corresponding types automatically (Zod pattern)
export {KeplerMapSchema, KeplerSliceConfig, migrateKeplerTabsToArtifacts} from './config';
export type {KeplerTabsArtifactsMigrationOptions} from './config';

export {CustomDndContextFactory} from './components/CustomDndContext';
export {CustomFilterPanelHeaderFactory} from './components/CustomFilterPanelHeader';
export {CustomMapControlTooltipFactory} from './components/CustomMapControlTooltipFactory';
export {CustomMapLegendFactory} from './components/CustomMapLegend';
export {CustomMapLegendPanelFactory} from './components/CustomMapLegendPanel';
export {CustomAddDataButtonFactory, CustomPanelTitleFactory} from './components/KeplerInjector';

export {createKeplerTheme, darkTheme} from './styles/theme';
export type {KeplerThemeOverrides} from './styles/theme';
export type {KeplerGLBasicProps} from './KeplerSlice';

export {KeplerAppShell, SqlroomsSidebarFactory} from './components/KeplerAppShell';
export type {KeplerAppShellProps} from './components/KeplerAppShell';
