// Copyright (c) 2018 Uber Technologies, Inc.
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

// Components
export {default as KeplerGl, default, injectComponents} from './container';

// factories
export {default as KeplerGlFactory} from './kepler-gl';
export {default as SidePanelFactory} from './side-panel';
export {default as MapContainerFactory} from './map-container';
export {default as BottomWidgetFactory} from './bottom-widget';
export {default as ModalContainerFactory} from './modal-container';
export {default as PlotContainerFactory} from './plot-container';

// // side panel factories
export {default as PanelHeaderFactory} from './side-panel/panel-header'

// // map container factories
export {default as MapPopoverFactory} from './map/map-popover';
export {default as MapControlFactory} from './map/map-control';

// // modal container factories
export {default as DeleteDatasetModalFactory} from './modals/delete-data-modal';
export {default as DataTableModalFactory} from './modals/data-table-modal';
export {default as LoadDataModalFactory} from './modals/load-data-modal';

// // Bottom widget factory
export {default as TimeWidgetFactory} from './filters/time-widget';

// Injector
export {
  injector as injector,
  withState as withState
} from './injector'

// Common Components
export {default as FileUpload} from './common/file-uploader/file-upload';
export {default as ItemSelector} from './common/item-selector/item-selector';
export {default as FieldSelector} from './common/field-selector';
export {default as RangeSlider} from './common/range-slider';
export {default as TimeRangeSlider} from './common/time-range-slider';
export {default as Modal, ModalFooter, ModalTitle} from './common/modal';
export {default as AppLogo} from './common/logo';
export {default as Switch} from './common/switch';
export {default as LoadingSpinner} from './common/loading-spinner';
export * from './common/styled-components';
export * as Icons from './common/icons';
