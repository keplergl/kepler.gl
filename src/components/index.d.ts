import React from 'react';
import {FeatureFlags} from './context';

export {withState} from './injector';

export * from './context';
export * from './bottom-widget';
export * from './kepler-gl';
export * from './map-container';
export * from './maps-layout';
export * from './modal-container';
export * from './side-panel';
export * from './container';

// TODO: we need more specific types for the following components
export * from './map/map-legend';
export * from './map/split-map-button';
export * from './side-panel/common/dataset-tag';
export * from './common/checkbox';
export * from './common/styled-components';
export * from './common/tippy-tooltip'
export * as Icons from './common/icons';
export * from './common/file-uploader/file-drop';
export * from './common/file-uploader/upload-button';
export {default as Portaled} from './common/portaled';

export const PanelHeaderAction: (...props: any[]) => JSX.Element;
export const TippyTooltip: (...props: any[]) => JSX.Element;
export const Toggle3dButtonFactory: (...deps: any) => React.ElementType;
export const ToggleGlobeButtonFactory: (...deps: any) => React.ElementType;
export const MapsLayoutFactory: (...deps: any) => React.ElementType;
export const PanelHeaderDropdownFactory: (...deps: any) => React.ElementType;
export const NotificationItemFactory: (...deps: any) => React.ElementType;
export const DropdownList: React.ElementType;
export const VerticalToolbar: React.ElementType;
export const ToolbarItem: React.ElementType;
export const ModalTitle: React.ElementType;
export const ItemSelector: React.ElementType;
export const Slider: React.ElementType;
export const LoadingSpinner: React.ElementType;
export const LayerConfigGroup: React.ElementType;
export const ChannelByValueSelector: React.ElementType;
export const LayerColorRangeSelector: React.ElementType;
export const LayerColorSelector: React.ElementType;
export const VisConfigSlider: React.ElementType;
export const ConfigGroupCollapsibleContent: React.ElementType;
export const PanelLabel: React.ElementType;

export const useFeatureFlags: () => FeatureFlags;
