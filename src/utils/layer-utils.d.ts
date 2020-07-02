import {Layer, LayerClasses} from 'layers';
import {VisState, Dataset, InteractionConfig, Tooltip, TooltipField} from 'reducers/vis-state-updaters';

export function calculateLayerData(
  layer: Layer,
  state: VisState,
  oldLayerData?: any
): {
  layerData: any;
  layer: Layer;
};
type FoundLayerProp = {
  type: string;
  dataId: string;
};

export type LayersToRender = {
  [layerId: string]: boolean;
};

export type LayerHoverProp = {
  data: any[];
  fields: Field[];
  fieldsToShow: TooltipField[];
  layer: Layer;
};

export function findDefaultLayer(dataset: Dataset, layerClasses: LayerClasses): FoundLayerProp[];
export function getLayerHoverProp(arg: {
  interactionConfig: VisState['interactionConfig'];
  hoverInfo: VisState['hoverInfo'];
  layers: VisState['layers'];
  layersToRender: LayersToRender;
  datasets: VisState['datasets'];
}): LayerHoverProp | null;
