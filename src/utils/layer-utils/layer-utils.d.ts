import {Layer, LayerClasses} from 'layers';
import {VisState, Dataset} from 'reducers/vis-state-updaters';

export function calculateLayerData(
  layer: Layer,
  state: VisState,
  oldLayerData?: any
): {
  layerData: any;
  layer: Layer;
};
type FoundLayerProp = {
  type: string; dataId: string
};

export function findDefaultLayer(
  dataset: Dataset,
  layerClasses: LayerClasses
): Layer[]