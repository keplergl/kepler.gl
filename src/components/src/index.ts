// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// Context
export {default as KeplerGlContext, RootContext} from './context';

import TimeRangeSliderFactory from './common/time-range-slider';
import RangeSliderFactory from './common/range-slider';
import VisConfigSliderFactory from './side-panel/layer-panel/vis-config-slider';
import VisConfigSwitchFactory from './side-panel/layer-panel/vis-config-switch';
import LayerConfigGroupFactory from './side-panel/layer-panel/layer-config-group';
import LayerColumnConfigFactory from './side-panel/layer-panel/layer-column-config';
import LayerTypeListItemFactory from './side-panel/layer-panel/layer-type-list-item';
import {ChannelByValueSelectorFactory} from './side-panel/layer-panel/layer-configurator';
import FieldSelectorFactory, {FieldListItemFactoryFactory} from './common/field-selector';
import FieldTokenFactory from './common/field-token';
import PanelHeaderActionFactory from './side-panel/panel-header-action';
import InfoHelperFactory from './common/info-helper';
import ColorSelectorFactory from './side-panel/layer-panel/color-selector';
import {
  LayerColorSelectorFactory,
  LayerColorRangeSelectorFactory,
  ArcLayerColorSelectorFactory
} from './side-panel/layer-panel/layer-color-selector';
import {appInjector} from './container';

// Components
export {default as KeplerGl, default, injectComponents, ContainerFactory, ERROR_MSG} from './container';

// factories
export {default as KeplerGlFactory, DEFAULT_KEPLER_GL_PROPS, getVisibleDatasets, makeGetActionCreators, mapFieldsSelector, plotContainerSelector} from './kepler-gl';
export {default as SidePanelFactory} from './side-panel';
export {default as PanelTitleFactory} from './side-panel/panel-title';
export {default as MapContainerFactory, Attribution} from './map-container';
export {default as MapsLayoutFactory} from './maps-layout';
export {default as BottomWidgetFactory} from './bottom-widget';
export {default as LayerAnimationControllerFactory} from './layer-animation-controller';
export {default as FilterAnimationControllerFactory} from './filter-animation-controller';
export {default as ModalContainerFactory} from './modal-container';
export {default as PlotContainerFactory} from './plot-container';
export {default as GeocoderPanelFactory, getUpdateVisDataPayload} from './geocoder-panel';
export {testForCoordinates} from './geocoder/geocoder';

// // side panel factories
export {
  default as PanelHeaderFactory,
  SaveExportDropdownFactory,
  PanelHeaderDropdownFactory,
  CloudStorageDropdownFactory,
  PanelAction
} from './side-panel/panel-header';
export {default as PanelHeaderActionFactory} from './side-panel/panel-header-action';
export {CollapseButtonFactory, default as SidebarFactory} from './side-panel/side-bar';
export {default as PanelToggleFactory} from './side-panel/panel-toggle';
export {default as PanelTabFactory} from './side-panel/panel-tab';

export {default as LayerManagerFactory, LayerBlendingSelector} from './side-panel/layer-manager';
export {ColorSelectorInput, ColorBlock} from './side-panel/layer-panel/color-selector';
export {default as CustomSelector} from './side-panel/layer-panel/color-selector';
export {default as ColorPalette} from './side-panel/layer-panel/color-palette';
export {default as ColorRangeSelector, PaletteConfig, ColorPaletteGroup, ALL_TYPES} from './side-panel/layer-panel/color-range-selector';
export {default as LayerPanelFactory} from './side-panel/layer-panel/layer-panel';
export {default as SingleColorPalette} from './side-panel/layer-panel/single-color-palette';
export {
  default as LayerConfiguratorFactory,
  getLayerConfiguratorProps,
  getLayerDataset,
  getVisConfiguratorProps,
} from './side-panel/layer-panel/layer-configurator';
export {default as TextLabelPanelFactory} from './side-panel/layer-panel/text-label-panel';

export {
  AddDataButtonFactory,
  default as DatasetSectionFactory
} from './side-panel/layer-panel/dataset-section';
export {default as DatasetLayerSectionFactory} from './side-panel/layer-panel/dataset-layer-section';
export {default as DatasetLayerGroupFactory} from './side-panel/layer-panel/dataset-layer-group';
export {default as PanelViewListToggleFactory} from './side-panel/panel-view-list-toggle';
export {default as AddLayerButtonFactory} from './side-panel/layer-panel/add-layer-button';
export {default as LayerListFactory} from './side-panel/layer-panel/layer-list';
export {default as CustomPicker} from './side-panel/layer-panel/custom-picker';
export {default as CustomPalette} from './side-panel/layer-panel/custom-palette';
export * from './side-panel/layer-panel/custom-palette';

export {default as SourceDataCatalogFactory} from './side-panel/common/source-data-catalog';
export {default as SourceDataSelectorFactory} from './side-panel/common/source-data-selector';
export {default as DatasetTitleFactory} from './side-panel/common/dataset-title';
export {default as DatasetInfoFactory} from './side-panel/common/dataset-info';
export {default as DatasetTagFactory} from './side-panel/common/dataset-tag';

export {default as FilterManagerFactory} from './side-panel/filter-manager';
export {default as FilterPanelFactory} from './side-panel/filter-panel/filter-panel';
export {default as AddFilterButtonFactory} from './side-panel/filter-panel/add-filter-button';

export {default as InteractionManagerFactory} from './side-panel/interaction-manager';
export {default as BrushConfigFactory} from './side-panel/interaction-panel/brush-config';
export {default as TooltipConfigFactory} from './side-panel/interaction-panel/tooltip-config';

export {default as MapManagerFactory} from './side-panel/map-manager';
export {default as LayerGroupSelectorFactory} from './side-panel/map-style-panel/map-layer-selector';
export {default as MapStyleSelectorFactory} from './side-panel/map-style-panel/map-style-selector';
export {default as LayerGroupColorPickerFactory} from './side-panel/map-style-panel/map-layer-group-color-picker';
export {default as CustomPanelsFactory} from './side-panel/custom-panel';
export {default as DndContextFactory} from './dnd-context';

// // map factories
export {default as MapPopoverFactory} from './map/map-popover';
export {default as MapPopoverContentFactory} from './map/map-popover-content';
export {default as MapControlFactory} from './map/map-control';
export {default as LayerHoverInfoFactory} from './map/layer-hover-info';
export {default as CoordinateInfoFactory} from './map/coordinate-info';
export {default as LayerSelectorPanelFactory} from './map/layer-selector-panel';
export {default as LocalePanelFactory} from './map/locale-panel';
export {default as MapControlPanelFactory} from './map/map-control-panel';
export {default as MapControlTooltipFactory} from './map/map-control-tooltip';
export {
  default as MapLegendFactory,
  LayerLegendHeaderFactory,
  LayerLegendContentFactory,
  StyledMapControlLegend,
  LayerColorLegend,
  VisualChannelMetric,
  LayerSizeLegend,
  SingleColorLegend
} from './map/map-legend';
export {default as MapDrawPanelFactory} from './map/map-draw-panel';
export {default as SplitMapButtonFactory} from './map/split-map-button';
export {default as MapLegendPanelFactory} from './map/map-legend-panel';
export {default as Toggle3dButtonFactory} from './map/toggle-3d-button';
export {default as LazzyTippy} from './map/lazy-tippy';
export {default as MapControlToolbarFactory} from './map/map-control-toolbar';

// // modal factories
export {default as ModalDialogFactory} from './modals/modal-dialog';
export {default as DeleteDatasetModalFactory} from './modals/delete-data-modal';
export {default as DataTableModalFactory, DatasetTabs, DatasetModalTab} from './modals/data-table-modal';
export {default as LoadDataModalFactory} from './modals/load-data-modal';
export {default as SaveMapModalFactory} from './modals/save-map-modal';
export {default as StatusPanel} from './modals/status-panel';
export {default as ExportImageModalFactory} from './modals/export-image-modal';
export {default as ExportDataModalFactory} from './modals/export-data-modal';
export {default as AddMapStyleModalFactory} from './modals/add-map-style-modal';
export {default as ExportMapModalFactory} from './modals/export-map-modal/export-map-modal';
export {default as ModalTabsFactory, ModalTabItem} from './modals/modal-tabs';
export {default as LoadStorageMapFactory} from './modals/load-storage-map';
export {default as ExportJsonMapFactory} from './modals/export-map-modal/export-json-map';
export {default as ExportHtmlMapFactory} from './modals/export-map-modal/export-html-map';

// // notification panel
export {default as NotificationPanelFactory} from './notification-panel';
export {default as NotificationItemFactory} from './notification-panel/notification-item';

// // common factory
export {default as AnimationControlFactory} from './common/animation-control/animation-control';
export {default as AnimationControllerFactory} from './common/animation-control/animation-controller';
export {default as PlaybackControlsFactory} from './common/animation-control/playback-controls';
export {default as WindowActionControlFactory} from './common/animation-control/window-action-control';
export {default as PlayControlFactory} from './common/animation-control/play-control';
export {default as ResetControlFactory} from './common/animation-control/reset-control';
export {default as SpeedControlFactory} from './common/animation-control/speed-control';
export {default as AnimationWindowControlFactory} from './common/animation-control/animation-window-control';
export {default as FloatingTimeDisplayFactory} from './common/animation-control/floating-time-display';
export {default as AnimationSpeedSliderFactory} from './common/animation-control/animation-speed-slider';
export {default as RangePlotFactory} from './common/range-plot';
export {default as ImagePreview} from './common/image-preview';
export {default as HistogramPlotFactory} from './common/histogram-plot';
export {default as LineChartFactory} from './common/line-chart';
export {default as RangeBrushFactory} from './common/range-brush';
export {default as TimeSliderMarkerFactory, getTickFormat, getXAxis, updateAxis} from './common/time-slider-marker';
export {default as TimeRangeSliderTimeTitleFactory} from './common/time-range-slider-time-title';
export {default as IconButton} from './common/icon-button';
// // Filters factory
export {default as TimeWidgetFactory} from './filters/time-widget';
export {default as TimeWidgetTopFactory} from './filters/time-widget-top';
export {default as SingleSelectFilterFactory} from './filters/single-select-filter';
export {default as MultiSelectFilterFactory} from './filters/multi-select-filter';
export {default as NewFilterPanelFactory} from './filters/filter-panels/new-filter-panel';
export {
  timeRangeSliderFieldsSelector,
  default as TimeRangeFilterFactory
} from './filters/time-range-filter';
export {default as RangeFilterFactory} from './filters/range-filter';

// // Editor Factory
export {default as EditorFactory} from './editor/editor';
export {default as FeatureActionPanelFactory, PureFeatureActionPanelFactory} from './editor/feature-action-panel';

// Injector
export {injector, provideRecipesToInjector, withState} from './injector';

// Common Components
export {default as CloudTile} from './modals/cloud-tile';
export {default as FileUploadFactory, FileUpload, WarningMsg} from './common/file-uploader/file-upload';
export {default as FileDrop} from './common/file-uploader/file-drop';
export {default as UploadButton} from './common/file-uploader/upload-button';
export {default as DatasetLabel} from './common/dataset-label';
export {default as Accessor} from './common/item-selector/accessor';
export {default as ChickletedInput, ChickletButton} from './common/item-selector/chickleted-input';
export {default as ItemSelector} from './common/item-selector/item-selector';
export {default as Typeahead} from './common/item-selector/typeahead';
export {default as DropdownList, ListItem, classList as dropdownListClassList} from './common/item-selector/dropdown-list';
export {default as FieldSelectorFactory} from './common/field-selector';
export {default as Modal, ModalFooter, ModalTitle} from './common/modal';
export {default as AppLogo} from './common/logo';
export {default as Switch} from './common/switch';
export {default as Checkbox} from './common/checkbox';
export {default as ColorLegend, LegendRow} from './common/color-legend';
export {default as EffectControlFactory} from './map/effects/effect-control';
export {default as LoadingSpinner} from './common/loading-spinner';
export {default as LoadingDialog} from './modals/loading-dialog';
export {MapViewStateContext, MapViewStateContextProvider} from './map-view-state-context';
export {default as FieldTokenFactory} from './common/field-token';
export {default as Portaled} from './common/portaled';
export {default as ProgressBar} from './common/progress-bar';
export {default as FileUploadProgress} from './common/file-uploader/file-upload-progress';
export {default as Slider} from './common/slider/slider';
export {default as SliderHandle} from './common/slider/slider-handle';
export {default as SliderBarHandle} from './common/slider/slider-bar-handle';
export {default as ActionPanel, ActionPanelItem} from './common/action-panel';
export {default as HeaderCellFactory} from './common/data-table/header-cell';
export {default as DataTableConfigFactory, NumberFormatConfig} from './common/data-table/display-format';
export {default as DataTableFactory} from './common/data-table';
export {default as CanvasHack} from './common/data-table/canvas';
export {default as OptionDropdown, FormatterDropdown} from './common/data-table/option-dropdown';
export {default as MapLayerSelector} from './common/map-layer-selector';
export {default as VerticalToolbar} from './common/vertical-toolbar';
export {default as ToolbarItem} from './common/toolbar-item';
export {default as ShareMapUrlModalFactory, SharingUrl} from './modals/share-map-modal';
export {default as TippyTooltip} from './common/tippy-tooltip';

// side pane components
export {default as LayerTypeSelectorFactory} from './side-panel/layer-panel/layer-type-selector';
export {default as LayerTypeDropdownListFactory} from './side-panel/layer-panel/layer-type-dropdown-list';
export {ConfigGroupCollapsibleContent, StyledConfigGroupHeader, LayerConfigGroupLabelFactory} from './side-panel/layer-panel/layer-config-group';
export {default as ColumnSelectorFactory} from './side-panel/layer-panel/column-selector';
export {default as StyledDropdownSelect} from './common/item-selector/item-selector';
export {
  DragHandle,
  LayerLabelEditor,
  LayerTitleSectionFactory,
  LayerPanelHeaderActionSectionFactory,
  default as LayerPanelHeaderFactory
} from './side-panel/layer-panel/layer-panel-header';
export {default as FilterPanelHeaderFactory} from './side-panel/filter-panel/filter-panel-header';

export {default as EffectManagerFactory} from './effects/effect-manager';
export {default as EffectListFactory} from './effects/effect-list';
export {default as SidePanelTitleFactory} from './effects/side-panel-title';
export {default as EffectTypeSelectorFactory} from './effects/effect-type-selector';
export {default as EffectConfiguratorFactory} from './effects/effect-configurator';
export {default as EffectTimeConfiguratorFactory} from './effects/effect-time-configurator';

export {default as HowToButton} from './side-panel/layer-panel/how-to-button';
// eslint-disable-next-line prettier/prettier
export type {
  ButtonProps,
  StyledPanelHeaderProps,
  StyledExportSectionProps
} from './common';

export type {CollapseButtonProps} from './side-panel/side-bar';
export type {PanelTabProps} from './side-panel/panel-tab';
export type {MapStyleSelectorProps} from './side-panel/map-style-panel/map-style-selector';
export type {LayerGroupSelectorProps} from './side-panel/map-style-panel/map-layer-selector';
export type {MapManagerProps} from './side-panel/map-manager';
export type {SourceDataSelectorProps} from './side-panel/common/types';
export type {DatasetTitleProps} from './side-panel/common/dataset-title';
export type {SourceDataCatalogProps} from './side-panel/common/source-data-catalog';
export type {DatasetInfoProps} from './side-panel/common/dataset-info';
export type {DatasetTagProps} from './side-panel/common/dataset-tag';
export type {CustomPanelsProps} from './side-panel/custom-panel';
export type {LayerTypeListItemProps, LayerTypeListItemType} from './side-panel/layer-panel/layer-type-list-item';
export type {LayerGroupColorPickerProps} from './side-panel/map-style-panel/map-layer-group-color-picker';
export type {MapLegendPanelProps, MapLegendPanelFactoryDeps} from './map/map-legend-panel';
export type {OptionDropdownProps, FormatterDropdownProps} from './common/data-table/option-dropdown';
export type {LayerListProps, LayerListFactoryDeps} from './side-panel/layer-panel/layer-list';
export type {MapContainerProps} from './map-container';
export type {MapControlProps} from './map/map-control';
export type {MapDrawPanelProps} from './map/map-draw-panel';
export type {PanelHeaderProps} from './side-panel/panel-header';
export type {LayerLabelEditorProps, LayerTitleSectionProps, LayerPanelHeaderProps, LayerPanelHeaderActionSectionProps} from './side-panel/layer-panel/layer-panel-header';
export type {FilterPanelHeaderProps} from './side-panel/filter-panel/filter-panel-header';
export type {LayerTypeOption} from './side-panel/layer-panel/layer-type-dropdown-list';
export type {LayerConfigGroupLabelProps, LayerConfigGroupProps} from './side-panel/layer-panel/layer-config-group';
export type {FilterManagerProps} from './side-panel/filter-manager';
export type {PanelMeta} from './side-panel/common/types';
export type {SideBarProps} from './side-panel/side-bar';
export type {FeatureActionPanelProps} from './editor/feature-action-panel';
export type {SingleColorPaletteProps} from './side-panel/layer-panel/single-color-palette';
export type {DndContextProps, DndContextComponent} from './dnd-context';

export {
  Icons,
  SelectText,
  SelectTextBold,
  IconRoundSmall,
  CenterFlexbox,
  CenterVerticalFlexbox,
  SpaceBetweenFlexbox,
  SBFlexboxItem,
  SBFlexboxNoMargin,
  PanelLabel,
  PanelLabelWrapper,
  PanelLabelBold,
  PanelHeaderTitle,
  PanelHeaderContent,
  PanelContent,
  SidePanelSection,
  SidePanelDivider,
  Tooltip,
  Button,
  Input,
  InputLight,
  TextArea,
  TextAreaLight,
  InlineInput,
  StyledPanelHeader,
  StyledPanelDropdown,
  ButtonGroup,
  DatasetSquare,
  SelectionButton,
  StyledModalContent,
  StyledModalVerticalPanel,
  StyledModalSection,
  StyledModalInputFootnote,
  StyledMapContainer,
  StyledAttrbution,
  StyledExportSection,
  StyledFilteredOption,
  StyledType,
  WidgetContainer,
  BottomWidgetInner,
  MapControlButton,
  StyledFilterContent,
  TruncatedTitleText,
  CheckMark
} from './common';

// Individual Component from Dependency Tree
export const TimeRangeSlider = appInjector.get(TimeRangeSliderFactory);
export const RangeSlider = appInjector.get(RangeSliderFactory);
export const VisConfigSlider = appInjector.get(VisConfigSliderFactory);
export const VisConfigSwitch = appInjector.get(VisConfigSwitchFactory);
export const LayerConfigGroup = appInjector.get(LayerConfigGroupFactory);
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
export {
  appInjector,
  TimeRangeSliderFactory,
  RangeSliderFactory,
  VisConfigSliderFactory,
  VisConfigSwitchFactory,
  LayerConfigGroupFactory,
  LayerColumnConfigFactory,
  LayerTypeListItemFactory,
  ChannelByValueSelectorFactory,
  FieldListItemFactoryFactory,
  InfoHelperFactory,
  ColorSelectorFactory,
  LayerColorSelectorFactory,
  LayerColorRangeSelectorFactory,
  ArcLayerColorSelectorFactory
};

// hooks
export {default as useFeatureFlags} from './hooks/use-feature-flags';
export {default as useDndLayers} from './hooks/use-dnd-layers';
export {default as useDndEffects} from './hooks/use-dnd-effects';
export {CloudListProvider, useCloudListProvider} from './hooks/use-cloud-list-provider';

