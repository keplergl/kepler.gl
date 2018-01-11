import {GridCellLayer} from 'deck.gl';
import {getCellLayerVertex} from '../layer-utils/get-cell-layer-vertext';

export default class EnhancedGridCellLayer extends GridCellLayer {
  getShaders() {
    const shaders = super.getShaders();
    const vs = getCellLayerVertex(shaders.vs, {highlightPicked: true});
    return {...shaders, vs};
  }
}

EnhancedGridCellLayer.layerName = 'EnhancedGridCellLayer';
