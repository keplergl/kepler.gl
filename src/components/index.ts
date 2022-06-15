// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import TimeRangeSliderFactory from './common/time-range-slider';
import RangeSliderFactory from './common/range-slider';
import VisConfigSliderFactory from './side-panel/layer-panel/vis-config-slider';
import VisConfigSwitchFactory from './side-panel/layer-panel/vis-config-switch';
import LayerConfigGroupFactory from './side-panel/layer-panel/layer-config-group';
import {ChannelByValueSelectorFactory} from './side-panel/layer-panel/layer-configurator';
import FieldSelectorFactory, {FieldListItemFactoryFactory} from './common/field-selector';
import FieldTokenFactory from './common/field-token';
import PanelHeaderActionFactory from './side-panel/panel-header-action';
import InfoHelperFactory from 'components/common/info-helper';
import {appInjector} from './container';

// Components
export {default as KeplerGl, default, injectComponents, ContainerFactory} from './container';

// factories
export {default as KeplerGlFactory, DEFAULT_KEPLER_GL_PROPS} from './kepler-gl';
export {default as SidePanelFactory} from './side-panel';
export {default as PanelTitleFactory} from './side-panel/panel-title';
export {default as MapContainerFactory, Attribution} from './map-container';
export {default as MapsLayoutFactory} from './maps-layout';
export {
  default as BottomWidgetFactory,
  LayerAnimationControllerFactory,
  FilterAnimationControllerFactory
} from './bottom-widget';
export {default as ModalContainerFactory} from './modal-container';
export {default as PlotContainerFactory} from './plot-container';
export {default as GeocoderPanelFactory} from './geocoder-panel';

// // side panel factories
export {
  default as PanelHeaderFactory,
  SaveExportDropdownFactory,
  PanelHeaderDropdownFactory
} from './side-panel/panel-header';
export {default as PanelHeaderActionFactory} from './side-panel/panel-header-action';
export {CollapseButtonFactory, default as SidebarFactory} from './side-panel/side-bar';
export {default as PanelToggleFactory} from './side-panel/panel-toggle';
export {default as PanelTabFactory} from './side-panel/panel-tab';

export {default as LayerManagerFactory} from './side-panel/layer-manager';
export {default as LayerPanelFactory} from './side-panel/layer-panel/layer-panel';
export {default as LayerPanelHeaderFactory} from './side-panel/layer-panel/layer-panel-header';
export {default as LayerConfiguratorFactory} from './side-panel/layer-panel/layer-configurator';
export {default as TextLabelPanelFactory} from './side-panel/layer-panel/text-label-panel';
export {LayerConfigGroupLabelFactory} from './side-panel/layer-panel/layer-config-group';
export {
  AddDataButtonFactory,
  default as DatasetSectionFactory
} from './side-panel/layer-panel/dataset-section';
export {default as DatasetLayerSectionFactory} from './side-panel/layer-panel/dataset-layer-section';
export {default as DatasetLayerGroupFactory} from './side-panel/layer-panel/dataset-layer-group';
export {default as PanelViewListToggleFactory} from './side-panel/layer-panel/panel-view-list-toggle';
export {default as AddLayerButtonFactory} from './side-panel/layer-panel/add-layer-button';
export {default as LayerListFactory} from './side-panel/layer-panel/layer-list';

export {default as SourceDataCatalogFactory} from './side-panel/common/source-data-catalog';
export {default as SourceDataSelectorFactory} from './side-panel/common/source-data-selector';
export {default as DatasetTitleFactory} from './side-panel/common/dataset-title';
export {default as DatasetInfoFactory} from './side-panel/common/dataset-info';
export {default as DatasetTagFactory} from './side-panel/common/dataset-tag';

export {default as FilterManagerFactory} from './side-panel/filter-manager';
export {default as FilterPanelFactory} from './side-panel/filter-panel/filter-panel';

export {default as InteractionManagerFactory} from './side-panel/interaction-manager';
export {default as BrushConfigFactory} from './side-panel/interaction-panel/brush-config';
export {default as TooltipConfigFactory} from './side-panel/interaction-panel/tooltip-config';

export {default as MapManagerFactory} from './side-panel/map-manager';
export {default as LayerGroupSelectorFactory} from './side-panel/map-style-panel/map-layer-selector';
export {default as MapStyleSelectorFactory} from './side-panel/map-style-panel/map-style-selector';
export {default as CustomPanelsFactory} from './side-panel/custom-panel';
// // map factories
export {default as MapPopoverFactory} from './map/map-popover';
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
  LayerLegendContentFactory
} from './map/map-legend';
export {default as MapDrawPanelFactory} from './map/map-draw-panel';
export {default as SplitMapButtonFactory} from './map/split-map-button';
export {default as MapLegendPanelFactory} from './map/map-legend-panel';
export {default as Toggle3dButtonFactory} from './map/toggle-3d-button';
export {default as MapControlToolbarFactory} from './map/map-control-toolbar';

// // modal factories
export {default as ModalDialogFactory} from './modals/modal-dialog';
export {default as DeleteDatasetModalFactory} from './modals/delete-data-modal';
export {default as DataTableModalFactory} from './modals/data-table-modal';
export {default as LoadDataModalFactory} from './modals/load-data-modal';
export {default as ExportImageModalFactory} from './modals/export-image-modal';
export {default as ExportDataModalFactory} from './modals/export-data-modal';
export {default as AddMapStyleModalFactory} from './modals/add-map-style-modal';
export {default as ExportMapModalFactory} from './modals/export-map-modal/export-map-modal';
export {default as ModalTabsFactory} from './modals/modal-tabs';
export {default as LoadStorageMapFactory} from './modals/load-storage-map';
export {default as ExportJsonMapFactory} from './modals/export-map-modal/export-json-map';
export {default as ExportHtmlMapFactory} from './modals/export-map-modal/export-html-map';

// // notification panel
export {default as NotificationItemFactory} from './notification-panel/notification-item';

// // common factory
export {default as AnimationControlFactory} from './common/animation-control/animation-control';
export {default as AnimationControllerFactory} from './common/animation-control/animation-controller';
export {default as SpeedControlFactory} from './common/animation-control/speed-control';
export {default as PlaybackControlsFactory} from './common/animation-control/playback-controls';
export {default as FloatingTimeDisplayFactory} from './common/animation-control/floating-time-display';
export {default as AnimationSpeedSliderFactory} from './common/animation-control/animation-speed-slider';
export {default as RangePlotFactory} from './common/range-plot';
export {default as HistogramPlotFactory} from './common/histogram-plot';
export {default as LineChartFactory} from './common/line-chart';
export {default as RangeBrushFactory} from './common/range-brush';
export {default as TimeSliderMarkerFactory} from './common/time-slider-marker';
export {default as TimeRangeSliderTimeTitleFactory} from './common/time-range-slider-time-title';

// // Filters factory
export {default as TimeWidgetFactory, TimeWidgetTopFactory} from './filters/time-widget';
export {default as SingleSelectFilterFactory} from './filters/single-select-filter';
export {default as MultiSelectFilterFactory} from './filters/multi-select-filter';
export {
  timeRangeSliderFieldsSelector,
  default as TimeRangeFilterFactory
} from './filters/time-range-filter';
export {default as RangeFilterFactory} from './filters/range-filter';

// // Editor Factory
export {default as EditorFactory} from './editor/editor';
export {default as FeatureActionPanelFactory} from './editor/feature-action-panel';

// Injector
export {injector, provideRecipesToInjector, withState} from './injector';

// Common Components
export {default as CloudTile} from './modals/cloud-tile';
export {default as FileUploadFactory, FileUpload} from './common/file-uploader/file-upload';
export {default as FileDrop} from './common/file-uploader/file-drop';
export {default as UploadButton} from './common/file-uploader/upload-button';
export {default as DatasetLabel} from './common/dataset-label';
export {default as ItemSelector} from './common/item-selector/item-selector';
export {default as Typeahead} from './common/item-selector/typeahead';
export {default as DropdownList} from './common/item-selector/dropdown-list';
export {default as FieldSelectorFactory} from './common/field-selector';
export {default as Modal, ModalFooter, ModalTitle} from './common/modal';
export {default as AppLogo} from './common/logo';
export {default as Switch} from './common/switch';
export {default as Checkbox} from './common/checkbox';
export {default as LoadingSpinner} from './common/loading-spinner';
export {default as LoadingDialog} from './modals/loading-dialog';
export {default as FieldTokenFactory} from './common/field-token';
export {default as Portaled} from './common/portaled';
export {default as ProgressBar} from './common/progress-bar';
export {default as FileUploadProgress} from './common/file-uploader/file-upload-progress';
export {default as Slider} from './common/slider/slider';
export {DatasetSquare} from './common/styled-components';
export {default as ActionPanel, ActionPanelItem} from './common/action-panel';
export {default as DataTableFactory} from './common/data-table';
export {default as CanvasHack} from './common/data-table/canvas';
export {default as MapLayerSelector} from './common/map-layer-selector';
export {default as VerticalToolbar} from './common/vertical-toolbar';
export {default as ToolbarItem} from './common/toolbar-item';
export {SharingUrl} from './modals/share-map-modal';
export {default as TippyTooltip} from './common/tippy-tooltip';

// side pane components
export {default as LayerTypeSelectorFactory} from './side-panel/layer-panel/layer-type-selector';
export {default as LayerTypeDropdownListFactory} from './side-panel/layer-panel/layer-type-dropdown-list';
export {default as LayerTypeListItemFactory} from './side-panel/layer-panel/layer-type-list-item';
export {ConfigGroupCollapsibleContent} from './side-panel/layer-panel/layer-config-group';
export {default as ColumnSelectorFactory} from './side-panel/layer-panel/column-selector';
export {default as FilterPanelHeaderFactory} from './side-panel/filter-panel/filter-panel-header';
export {default as StyledDropdownSelect} from './common/item-selector/item-selector';
export {
  LayerLabelEditor,
  LayerTitleSectionFactory
} from './side-panel/layer-panel/layer-panel-header';

export {
  HowToButton,
  LayerColorRangeSelector,
  LayerColorSelector
} from './side-panel/layer-panel/layer-configurator';

export * from './common';

// Individual Component from Dependency Tree
export const TimeRangeSlider = appInjector.get(TimeRangeSliderFactory);
export const RangeSlider = appInjector.get(RangeSliderFactory);
export const VisConfigSlider = appInjector.get(VisConfigSliderFactory);
export const VisConfigSwitch = appInjector.get(VisConfigSwitchFactory);
export const LayerConfigGroup = appInjector.get(LayerConfigGroupFactory);
export const ChannelByValueSelector = appInjector.get(ChannelByValueSelectorFactory);
export const FieldSelector = appInjector.get(FieldSelectorFactory);
export const FieldToken = appInjector.get(FieldTokenFactory);
export const PanelHeaderAction = appInjector.get(PanelHeaderActionFactory);
export const FieldListItemFactory = appInjector.get(FieldListItemFactoryFactory);
export const InfoHelper = appInjector.get(InfoHelperFactory);

export {
  appInjector,
  TimeRangeSliderFactory,
  RangeSliderFactory,
  VisConfigSliderFactory,
  VisConfigSwitchFactory,
  LayerConfigGroupFactory,
  ChannelByValueSelectorFactory,
  FieldListItemFactoryFactory,
  InfoHelperFactory
};

// Context
export {default as KeplerGlContext, RootContext} from 'components/context';
