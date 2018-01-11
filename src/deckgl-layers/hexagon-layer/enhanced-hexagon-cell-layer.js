import {HexagonCellLayer} from 'deck.gl';
import {getCellLayerVertex} from '../layer-utils/get-cell-layer-vertext';

export default class EnhancedHexagonCellLayer extends HexagonCellLayer {
  getShaders() {
    const shaders = super.getShaders();
    const vs = getCellLayerVertex(shaders.vs, {highlightPicked: true});
    return {...shaders, vs};
  }
}

EnhancedHexagonCellLayer.layerName = 'EnhancedHexagonCellLayer';
