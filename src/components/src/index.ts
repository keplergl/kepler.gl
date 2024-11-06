// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Context
export {default as KeplerGlContext, RootContext} from './context';

import FieldSelectorFactory, {FieldListItemFactoryFactory} from './common/field-selector';
import FieldTokenFactory from './common/field-token';
import InfoHelperFactory from './common/info-helper';
import RangeSliderFactory from './common/range-slider';
import TimeRangeSliderFactory from './common/time-range-slider';
import {appInjector} from './container';
import ChannelByValueSelectorFactory from './side-panel/layer-panel/channel-by-value-selector';
import ColorSelectorFactory from './side-panel/layer-panel/color-selector';
import {
  ArcLayerColorSelectorFactory,
  LayerColorRangeSelectorFactory,
  LayerColorSelectorFactory
} from './side-panel/layer-panel/layer-color-selector';
import LayerColumnConfigFactory from './side-panel/layer-panel/layer-column-config';
import LayerConfigGroupFactory from './side-panel/layer-panel/layer-config-group';
import LayerTypeListItemFactory from './side-panel/layer-panel/layer-type-list-item';
import VisConfigSliderFactory from './side-panel/layer-panel/vis-config-slider';
import VisConfigSwitchFactory from './side-panel/layer-panel/vis-config-switch';
import PanelHeaderActionFactory from './side-panel/panel-header-action';
import {
  default as LayerColumnModeConfigFactory,
  ColumnModeConfigFactory
} from './side-panel/layer-panel/layer-column-mode-config';

// Components
export {
  ContainerFactory,
  ERROR_MSG,
  default as KeplerGl,
  default,
  injectComponents
} from './container';

// factories
export {default as BottomWidgetFactory} from './bottom-widget';
export {default as FilterAnimationControllerFactory} from './filter-animation-controller';
export {default as GeocoderPanelFactory, getUpdateVisDataPayload} from './geocoder-panel';
export {testForCoordinates} from './geocoder/geocoder';
export {
  DEFAULT_KEPLER_GL_PROPS,
  default as KeplerGlFactory,
  getVisibleDatasets,
  makeGetActionCreators,
  mapFieldsSelector,
  plotContainerSelector
} from './kepler-gl';
export {default as LayerAnimationControllerFactory} from './layer-animation-controller';
export {Attribution, default as MapContainerFactory} from './map-container';
export {default as MapsLayoutFactory} from './maps-layout';
export {default as ModalContainerFactory} from './modal-container';
export {default as PlotContainerFactory} from './plot-container';
export {default as SidePanelFactory} from './side-panel';
export {default as PanelTitleFactory} from './side-panel/panel-title';

// // side panel factories
export {
  CloudStorageDropdownFactory,
  PanelAction,
  PanelHeaderDropdownFactory,
  default as PanelHeaderFactory,
  SaveExportDropdownFactory
} from './side-panel/panel-header';
export {default as PanelHeaderActionFactory} from './side-panel/panel-header-action';
export {default as PanelTabFactory} from './side-panel/panel-tab';
export {default as PanelToggleFactory} from './side-panel/panel-toggle';
export {CollapseButtonFactory, default as SidebarFactory} from './side-panel/side-bar';

export {LayerBlendingSelector, default as LayerManagerFactory} from './side-panel/layer-manager';
export {default as ColorPalette} from './side-panel/layer-panel/color-palette';
export {
  ALL_TYPES,
  ColorPaletteGroup,
  default as ColorRangeSelector,
  PaletteConfig
} from './side-panel/layer-panel/color-range-selector';
export {
  ColorBlock,
  ColorSelectorInput,
  default as CustomSelector
} from './side-panel/layer-panel/color-selector';
export {
  default as LayerConfiguratorFactory,
  getLayerConfiguratorProps,
  getLayerDataset,
  getVisConfiguratorProps
} from './side-panel/layer-panel/layer-configurator';
export {default as LayerPanelFactory} from './side-panel/layer-panel/layer-panel';
export {default as SingleColorPalette} from './side-panel/layer-panel/single-color-palette';
export {default as TextLabelPanelFactory} from './side-panel/layer-panel/text-label-panel';

export {default as AddLayerButtonFactory} from './side-panel/layer-panel/add-layer-button';
export * from './side-panel/layer-panel/channel-by-value-selector';
export * from './side-panel/layer-panel/color-breaks-panel';
export * from './side-panel/layer-panel/color-range-selector';
export * from './side-panel/layer-panel/color-scale-selector';
export * from './side-panel/layer-panel/custom-palette';
export {default as CustomPalette} from './side-panel/layer-panel/custom-palette';
export {default as CustomPicker} from './side-panel/layer-panel/custom-picker';
export {default as DatasetLayerGroupFactory} from './side-panel/layer-panel/dataset-layer-group';
export {default as DatasetLayerSectionFactory} from './side-panel/layer-panel/dataset-layer-section';
export {
  AddDataButtonFactory,
  default as DatasetSectionFactory
} from './side-panel/layer-panel/dataset-section';
export * from './side-panel/layer-panel/dimension-scale-selector';

export {default as LayerListFactory} from './side-panel/layer-panel/layer-list';
export * from './side-panel/layer-panel/vis-config-by-field-selector';
export {default as PanelViewListToggleFactory} from './side-panel/panel-view-list-toggle';
export {default as DatasetInfoFactory} from './side-panel/common/dataset-info';
export {default as DatasetTagFactory} from './side-panel/common/dataset-tag';
export {default as DatasetTitleFactory} from './side-panel/common/dataset-title';
export {default as SourceDataCatalogFactory} from './side-panel/common/source-data-catalog';
export {default as SourceDataSelectorFactory} from './side-panel/common/source-data-selector';

export {default as FilterManagerFactory} from './side-panel/filter-manager';
export {default as AddFilterButtonFactory} from './side-panel/filter-panel/add-filter-button';
export {default as FilterPanelFactory} from './side-panel/filter-panel/filter-panel';

export {default as InteractionManagerFactory} from './side-panel/interaction-manager';
export {default as BrushConfigFactory} from './side-panel/interaction-panel/brush-config';
export {default as TooltipConfigFactory} from './side-panel/interaction-panel/tooltip-config';

export {default as DndContextFactory} from './dnd-context';
export {default as CustomPanelsFactory} from './side-panel/custom-panel';
export {default as MapManagerFactory} from './side-panel/map-manager';
export {default as LayerGroupColorPickerFactory} from './side-panel/map-style-panel/map-layer-group-color-picker';
export {default as LayerGroupSelectorFactory} from './side-panel/map-style-panel/map-layer-selector';
export {default as MapStyleSelectorFactory} from './side-panel/map-style-panel/map-style-selector';

// map factories
export {default as CoordinateInfoFactory} from './map/coordinate-info';
export {default as LayerHoverInfoFactory} from './map/layer-hover-info';
export {default as LayerSelectorPanelFactory} from './map/layer-selector-panel';
export {default as LazzyTippy} from './map/lazy-tippy';
export {default as LocalePanelFactory} from './map/locale-panel';
export {default as MapControlFactory} from './map/map-control';
export {default as MapControlPanelFactory} from './map/map-control-panel';
export {default as MapControlToolbarFactory} from './map/map-control-toolbar';
export {default as MapControlTooltipFactory} from './map/map-control-tooltip';
export {default as MapDrawPanelFactory} from './map/map-draw-panel';
export {
  LayerColorLegendFactory,
  LayerDefaultLegend,
  LayerLegendContentFactory,
  LayerLegendHeaderFactory,
  default as MapLegendFactory,
  SingleColorLegendFactory,
  StyledMapControlLegend,
  VisualChannelMetric
} from './map/map-legend';

export {default as MapLegendPanelFactory} from './map/map-legend-panel';
export {default as MapPopoverFactory} from './map/map-popover';
export {default as MapPopoverContentFactory} from './map/map-popover-content';
export {default as SplitMapButtonFactory} from './map/split-map-button';
export {default as Toggle3dButtonFactory} from './map/toggle-3d-button';

// modal factories
export {default as AddMapStyleModalFactory} from './modals/add-map-style-modal';
export {
  default as DataTableModalFactory,
  DatasetModalTab,
  DatasetTabs
} from './modals/data-table-modal';
export {default as DeleteDatasetModalFactory} from './modals/delete-data-modal';
export {default as ExportDataModalFactory} from './modals/export-data-modal';
export {default as ExportImageModalFactory} from './modals/export-image-modal';
export {default as ExportHtmlMapFactory} from './modals/export-map-modal/export-html-map';
export {default as ExportJsonMapFactory} from './modals/export-map-modal/export-json-map';
export {default as ExportMapModalFactory} from './modals/export-map-modal/export-map-modal';
export {default as LoadDataModalFactory} from './modals/load-data-modal';

export {default as LoadStorageMapFactory} from './modals/load-storage-map';
export {default as ModalDialogFactory} from './modals/modal-dialog';
export {ModalTabItem, default as ModalTabsFactory} from './modals/modal-tabs';
export {default as SaveMapModalFactory} from './modals/save-map-modal';
export {default as StatusPanel} from './modals/status-panel';

// // notification panel
export {default as NotificationPanelFactory} from './notification-panel';
export {default as NotificationItemFactory} from './notification-panel/notification-item';

// // common factory
export {default as AnimationControlFactory} from './common/animation-control/animation-control';
export {default as AnimationControllerFactory} from './common/animation-control/animation-controller';
export {default as AnimationSpeedSliderFactory} from './common/animation-control/animation-speed-slider';
export {default as AnimationWindowControlFactory} from './common/animation-control/animation-window-control';
export {default as FloatingTimeDisplayFactory} from './common/animation-control/floating-time-display';
export {default as PlayControlFactory} from './common/animation-control/play-control';
export {default as PlaybackControlsFactory} from './common/animation-control/playback-controls';
export {default as ResetControlFactory} from './common/animation-control/reset-control';
export {default as SpeedControlFactory} from './common/animation-control/speed-control';
export {default as WindowActionControlFactory} from './common/animation-control/window-action-control';

export {default as HistogramPlotFactory} from './common/histogram-plot';
export {default as IconButton} from './common/icon-button';
export {default as ImagePreview} from './common/image-preview';
export {default as LineChartFactory} from './common/line-chart';
export {default as RangeBrushFactory} from './common/range-brush';
export {default as RangePlotFactory} from './common/range-plot';
export {default as TimeRangeSliderTimeTitleFactory} from './common/time-range-slider-time-title';
export {
  default as TimeSliderMarkerFactory,
  getTickFormat,
  getXAxis,
  updateAxis
} from './common/time-slider-marker';
export {
  SYNC_TIMELINE_ANIMATION_ITEMS,
  default as SyncTimelineControlFactory
} from './common/sync-timeline-control';
// Filters factory
export {default as NewFilterPanelFactory} from './filters/filter-panels/new-filter-panel';
export {default as MultiSelectFilterFactory} from './filters/multi-select-filter';
export {default as RangeFilterFactory} from './filters/range-filter';
export {default as SingleSelectFilterFactory} from './filters/single-select-filter';
export {default as TimeRangeFilterPanelFactory} from './filters/filter-panels/time-range-filter-panel';
export {
  default as TimeRangeFilterFactory,
  timeRangeSliderFieldsSelector
} from './filters/time-range-filter';
export {default as TimeWidgetFactory} from './filters/time-widget';
export {default as TimeWidgetTopFactory} from './filters/time-widget-top';

// // Editor Factory
export {default as EditorFactory} from './editor/editor';
export {
  default as FeatureActionPanelFactory,
  PureFeatureActionPanelFactory
} from './editor/feature-action-panel';

// Injector
export * from './injector';

// Common Components
export {default as ActionPanel, ActionPanelItem} from './common/action-panel';
export {default as Checkbox} from './common/checkbox';
export {
  default as ColorLegendFactory,
  LegendColorDisplayFactory,
  LegendRowEditorFactory,
  LegendRowFactory,
  ResetColorLabelFactory
} from './common/color-legend';
export {default as DataTableFactory} from './common/data-table';
export {default as CanvasHack} from './common/data-table/canvas';
export {
  default as DataTableConfigFactory,
  NumberFormatConfig
} from './common/data-table/display-format';
export {default as HeaderCellFactory} from './common/data-table/header-cell';
export {FormatterDropdown, default as OptionDropdown} from './common/data-table/option-dropdown';
export {default as DatasetLabel} from './common/dataset-label';
export {default as FieldSelectorFactory} from './common/field-selector';
export * from './common/field-token';
export {default as FieldTokenFactory} from './common/field-token';
export {default as FileDrop} from './common/file-uploader/file-drop';
export {
  FileUpload,
  default as FileUploadFactory,
  WarningMsg
} from './common/file-uploader/file-upload';
export {default as FileUploadProgress} from './common/file-uploader/file-upload-progress';
export {default as UploadButton} from './common/file-uploader/upload-button';
export {default as Accessor} from './common/item-selector/accessor';
export {ChickletButton, default as ChickletedInput} from './common/item-selector/chickleted-input';
export {
  default as DropdownList,
  ListItem,
  classList as dropdownListClassList
} from './common/item-selector/dropdown-list';
export * from './common/item-selector/dropdown-select';
export {default as ItemSelector} from './common/item-selector/item-selector';
export {default as Typeahead} from './common/item-selector/typeahead';
export {default as DropdownSelect} from './common/item-selector/dropdown-select';
export {default as LoadingSpinner} from './common/loading-spinner';
export {default as AppLogo} from './common/logo';
export {default as MapLayerSelector} from './common/map-layer-selector';
export {default as Modal, ModalFooter, ModalTitle} from './common/modal';
export {default as Portaled} from './common/portaled';
export {default as ProgressBar} from './common/progress-bar';
export {default as Slider} from './common/slider/slider';
export {default as SliderBarHandle} from './common/slider/slider-bar-handle';
export {default as SliderHandle} from './common/slider/slider-handle';
export {default as Switch} from './common/switch';
export {default as TippyTooltip} from './common/tippy-tooltip';
export {default as ToolbarItem} from './common/toolbar-item';
export {default as VerticalToolbar} from './common/vertical-toolbar';
export {MapViewStateContext, MapViewStateContextProvider} from './map-view-state-context';
export {default as EffectControlFactory} from './map/effects/effect-control';
export {default as CloudTile} from './modals/cloud-tile';
export {default as LoadingDialog} from './modals/loading-dialog';
export {default as ShareMapUrlModalFactory, SharingUrl} from './modals/share-map-modal';
export {default as ColorRangeSelectorFactory} from './side-panel/layer-panel/color-range-selector';
export {default as CustomPaletteFactory} from './side-panel/layer-panel/custom-palette';

// side pane components
export {default as StyledDropdownSelect} from './common/item-selector/item-selector';
export {default as FilterPanelHeaderFactory} from './side-panel/filter-panel/filter-panel-header';
export {default as ColumnSelectorFactory} from './side-panel/layer-panel/column-selector';
export {
  ConfigGroupCollapsibleContent,
  LayerConfigGroupLabelFactory,
  StyledConfigGroupHeader
} from './side-panel/layer-panel/layer-config-group';
export {
  DragHandle,
  LayerLabelEditor,
  LayerPanelHeaderActionSectionFactory,
  default as LayerPanelHeaderFactory,
  LayerTitleSectionFactory
} from './side-panel/layer-panel/layer-panel-header';
export {default as LayerTypeDropdownListFactory} from './side-panel/layer-panel/layer-type-dropdown-list';
export {default as LayerTypeSelectorFactory} from './side-panel/layer-panel/layer-type-selector';

export {default as EffectConfiguratorFactory} from './effects/effect-configurator';
export {default as EffectListFactory} from './effects/effect-list';
export {default as EffectManagerFactory} from './effects/effect-manager';
export {default as EffectTimeConfiguratorFactory} from './effects/effect-time-configurator';
export {default as EffectTypeSelectorFactory} from './effects/effect-type-selector';
export {default as SidePanelTitleFactory} from './effects/side-panel-title';
export {default as ColorBreaksPanelFactory} from './side-panel/layer-panel/color-breaks-panel';
export {default as DimensionScaleSelectorFactory} from './side-panel/layer-panel/dimension-scale-selector';
export {default as HowToButton} from './side-panel/layer-panel/how-to-button';
// eslint-disable-next-line prettier/prettier
export type {ButtonProps, StyledExportSectionProps, StyledPanelHeaderProps} from './common';
export type {
  FormatterDropdownProps,
  OptionDropdownProps
} from './common/data-table/option-dropdown';
export type {DndContextComponent, DndContextProps} from './dnd-context';
export type {FeatureActionPanelProps} from './editor/feature-action-panel';
export type {PlaybackControlsProps} from './common/animation-control/playback-controls';
export type {MapContainerProps} from './map-container';
export type {MapControlProps} from './map/map-control';
export type {MapDrawPanelProps} from './map/map-draw-panel';
export type {MapLegendPanelFactoryDeps, MapLegendPanelProps} from './map/map-legend-panel';
export type {DatasetInfoProps} from './side-panel/common/dataset-info';
export type {DatasetTagProps} from './side-panel/common/dataset-tag';
export type {DatasetTitleProps} from './side-panel/common/dataset-title';
export type {SourceDataCatalogProps} from './side-panel/common/source-data-catalog';
export type {PanelMeta, SourceDataSelectorProps} from './side-panel/common/types';
export type {CustomPanelsProps} from './side-panel/custom-panel';
export type {FilterManagerProps} from './side-panel/filter-manager';
export type {FilterPanelHeaderProps} from './side-panel/filter-panel/filter-panel-header';
export type {
  LayerConfigGroupLabelProps,
  LayerConfigGroupProps
} from './side-panel/layer-panel/layer-config-group';
export type {LayerListFactoryDeps, LayerListProps} from './side-panel/layer-panel/layer-list';
export type {
  LayerLabelEditorProps,
  LayerPanelHeaderActionSectionProps,
  LayerPanelHeaderProps,
  LayerTitleSectionProps
} from './side-panel/layer-panel/layer-panel-header';
export type {LayerTypeOption} from './side-panel/layer-panel/layer-type-dropdown-list';
export type {
  LayerTypeListItemProps,
  LayerTypeListItemType
} from './side-panel/layer-panel/layer-type-list-item';
export type {SingleColorPaletteProps} from './side-panel/layer-panel/single-color-palette';
export type {MapManagerProps} from './side-panel/map-manager';
export type {LayerGroupColorPickerProps} from './side-panel/map-style-panel/map-layer-group-color-picker';
export type {LayerGroupSelectorProps} from './side-panel/map-style-panel/map-layer-selector';
export type {MapStyleSelectorProps} from './side-panel/map-style-panel/map-style-selector';
export type {PanelHeaderProps} from './side-panel/panel-header';
export type {PanelTabProps} from './side-panel/panel-tab';
export type {CollapseButtonProps, SideBarProps} from './side-panel/side-bar';

export {
  BottomWidgetInner,
  Button,
  ButtonGroup,
  CenterFlexbox,
  CenterVerticalFlexbox,
  CheckMark,
  DatasetSquare,
  Edit,
  IconRoundSmall,
  Icons,
  InlineInput,
  Input,
  InputLight,
  MapControlButton,
  PanelContent,
  PanelHeaderContent,
  PanelHeaderTitle,
  PanelLabel,
  PanelLabelBold,
  PanelLabelWrapper,
  SBFlexboxItem,
  SBFlexboxNoMargin,
  SelectText,
  SelectTextBold,
  SelectionButton,
  SidePanelDivider,
  SidePanelSection,
  SpaceBetweenFlexbox,
  StyledAttrbution,
  StyledExportSection,
  StyledFilterContent,
  StyledFilteredOption,
  StyledMapContainer,
  StyledModalContent,
  StyledModalInputFootnote,
  StyledModalSection,
  StyledModalVerticalPanel,
  StyledPanelDropdown,
  StyledPanelHeader,
  StyledType,
  TextArea,
  TextAreaLight,
  Tooltip,
  TruncatedTitleText,
  WidgetContainer
} from './common';
export {
  ArcLayerColorSelectorFactory,
  ChannelByValueSelectorFactory,
  ColorSelectorFactory,
  ColumnModeConfigFactory,
  FieldListItemFactoryFactory,
  InfoHelperFactory,
  LayerColorRangeSelectorFactory,
  LayerColorSelectorFactory,
  LayerColumnConfigFactory,
  LayerColumnModeConfigFactory,
  LayerConfigGroupFactory,
  LayerTypeListItemFactory,
  RangeSliderFactory,
  TimeRangeSliderFactory,
  VisConfigSliderFactory,
  VisConfigSwitchFactory,
  appInjector
};

// Individual Component from Dependency Tree
export const TimeRangeSlider = appInjector.get(TimeRangeSliderFactory);
export const RangeSlider = appInjector.get(RangeSliderFactory);
export const VisConfigSlider = appInjector.get(VisConfigSliderFactory);
export const VisConfigSwitch = appInjector.get(VisConfigSwitchFactory);
export const LayerConfigGroup = appInjector.get(LayerConfigGroupFactory);
export const LayerColumnModeConfig = appInjector.get(LayerColumnModeConfigFactory);
export const LayerColumnConfig = appInjector.get(LayerColumnConfigFactory);
export const ChannelByValueSelector = appInjector.get(ChannelByValueSelectorFactory);
export const FieldSelector = appInjector.get(FieldSelectorFactory);
export const FieldToken = appInjector.get(FieldTokenFactory);
export const PanelHeaderAction = appInjector.get(PanelHeaderActionFactory);
export const FieldListItemFactory = appInjector.get(FieldListItemFactoryFactory);
export const LayerTypeListItem = appInjector.get(LayerTypeListItemFactory);
export const InfoHelper = appInjector.get(InfoHelperFactory);
export const ColorSelector = appInjector.get(ColorSelectorFactory);
export const LayerColorSelector = appInjector.get(LayerColorSelectorFactory);
export const LayerColorRangeSelector = appInjector.get(LayerColorRangeSelectorFactory);
export const ArcLayerColorSelector = appInjector.get(ArcLayerColorSelectorFactory);

// hooks
export {CloudListProvider, useCloudListProvider} from './hooks/use-cloud-list-provider';
export {default as useDndEffects} from './hooks/use-dnd-effects';
export {default as useDndLayers} from './hooks/use-dnd-layers';
export {default as useFeatureFlags} from './hooks/use-feature-flags';
