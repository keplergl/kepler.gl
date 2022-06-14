import keyMirror from 'keymirror';

export const LAYER_TYPES = keyMirror({
    point: null,
    arc: null,
    line: null,
    grid: null,
    hexagon: null,
    geojson: null,
    cluster: null,
    icon: null,
    heatmap: null,
    hexagonId: null,
    '3D': null,
    trip: null,
    s2: null
  });
  
  export const EDITOR_AVAILABLE_LAYERS: string[] = [
    LAYER_TYPES.point,
    LAYER_TYPES.hexagon,
    LAYER_TYPES.arc,
    LAYER_TYPES.line,
    LAYER_TYPES.hexagonId
  ];