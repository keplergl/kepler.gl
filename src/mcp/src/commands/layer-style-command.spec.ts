import {getUpdateLayerColorCommand} from './layer-style-command';

// A box-map layer's colorRange, exactly as applyColorConfig builds it: 6
// classes (breaks -6.5, 1, 2, 6, 13.5), last colorMap entry [null, color] for
// the highest bucket.
const boxMapColorRange = {
  name: 'color.customPalette',
  type: 'custom',
  category: 'Custom',
  colors: ['#005a9c', '#6ea3d6', '#d9e8f5', '#fbd3a4', '#e07a3f', '#b30000'],
  colorMap: [
    [-6.5, '#005a9c'],
    [1, '#6ea3d6'],
    [2, '#d9e8f5'],
    [6, '#fbd3a4'],
    [13.5, '#e07a3f'],
    [null, '#b30000']
  ]
};

const boxMapLayer = {
  id: 'oa48cne',
  config: {dataId: 'rxv7za', visConfig: {colorRange: boxMapColorRange}}
};

// A plain layer with no colorMap (default quantile scale).
const plainLayer = {
  id: 'plain',
  config: {dataId: 'rxv7za', visConfig: {colorRange: {colors: ['#1f77b4', '#ff7f0e']}}}
};

type CommandResult = {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
};

function makeCtx(layer: {id: string; config: {dataId: string; visConfig: {colorRange: any}}}) {
  let dispatched: any = null;
  const ctx = {
    getVisState: () => ({layers: [layer]}),
    dispatch: (action: any) => {
      dispatched = action;
    }
  };
  return {ctx, getDispatched: () => dispatched};
}

async function runUpdateColor(
  layer: {id: string; config: {dataId: string; visConfig: {colorRange: any}}},
  input: {layerId: string; numberOfColors: number; customColors: string[]}
) {
  const {ctx, getDispatched} = makeCtx(layer);
  const cmd = getUpdateLayerColorCommand(ctx as any);
  const result = (await cmd.execute({} as any, input)) as CommandResult;
  return {result, getDispatched};
}

describe('map.update-layer-color', () => {
  it('rejects a palette whose color count does not match the layer class count', async () => {
    const {result} = await runUpdateColor(boxMapLayer, {
      layerId: 'oa48cne',
      numberOfColors: 5,
      customColors: ['#2166ac', '#67a9cf', '#f7f7f7', '#ef8a62', '#b2182b']
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/has 6 classes/);
    expect(result.error).toMatch(/provide exactly 6 colors, got 5/);
  });

  it('applies a palette whose color count matches the layer class count', async () => {
    const {result, getDispatched} = await runUpdateColor(boxMapLayer, {
      layerId: 'oa48cne',
      numberOfColors: 6,
      customColors: ['#2166ac', '#67a9cf', '#d9e8f5', '#f7f7f7', '#ef8a62', '#b2182b']
    });

    expect(result.success).toBe(true);
    const action = getDispatched();
    expect(action).toBeTruthy();
    const colorMap = action.newVisConfig.colorRange.colorMap as [unknown, string][];
    expect(colorMap).toHaveLength(6);
    // every entry keeps its break value and gets a real color — no undefined
    colorMap.forEach(([k, v]) => {
      expect(typeof v).toBe('string');
      expect(v).toMatch(/^#/);
      expect(k).not.toBeUndefined();
    });
    expect(colorMap[5]).toEqual([null, '#b2182b']);
  });

  it('still allows changing the color count on a layer without a colorMap', async () => {
    const {result, getDispatched} = await runUpdateColor(plainLayer, {
      layerId: 'plain',
      numberOfColors: 3,
      customColors: ['#2166ac', '#f7f7f7', '#b2182b']
    });

    expect(result.success).toBe(true);
    const action = getDispatched();
    expect(action.newVisConfig.colorRange.colors).toEqual(['#2166ac', '#f7f7f7', '#b2182b']);
  });
});
