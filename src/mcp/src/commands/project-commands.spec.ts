// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createStore, applyMiddleware} from 'redux';
import {taskMiddleware} from '@kepler.gl/tasks';
import {keplerGlReducer} from '@kepler.gl/reducers';
import type {KeplerGlState} from '@kepler.gl/reducers';
import {ActionTypes, loadMapStyles, registerEntry, wrapTo} from '@kepler.gl/actions';
import {DatasetType, SURFACE_FOG_TYPE} from '@kepler.gl/constants';
import {KeplerTable} from '@kepler.gl/table';
import {
  getOpenProjectCommand,
  getSaveProjectCommand,
  getProjectStatusCommand
} from './project-commands';
import {getLayerOptionsCommand} from './layer-options-command';
import {getLayerLabelsCommand, getSetLayerLabelsCommand} from './layer-labels-command';
import {getTooltipFieldsCommand, getSetTooltipFieldsCommand} from './tooltip-fields-command';
import type {KeplerContext, RoomCommand, RoomCommandResult} from './types';

const camera = {latitude: 19, longitude: -155, zoom: 8, bearing: 10, pitch: 20};
const animation = [
  {
    id: 'lower',
    startValue: 5900,
    endValue: 900,
    startTimeMs: 0,
    endTimeMs: 2000,
    easing: 'easeInOut'
  }
];

// A complete saved-map fixture with two datasets sharing one filter.
function fixture() {
  return {
    info: {app: 'kepler.gl', title: 'Hawaii', description: 'Two observations'},
    datasets: ['first', 'second'].map((id, i) => ({
      version: 'v1',
      data: {
        id,
        label: id,
        color: [40, 100, 200],
        type: DatasetType.EXTERNALLY_HOSTED,
        metadata: {source: `https://example.com/${id}.csv`, format: 'csv'},
        fields: [
          {name: 'lat', type: 'real'},
          {name: 'lng', type: 'real'},
          {name: 'value', type: 'integer'}
        ],
        allData: [
          [19.5 + i, -155.5, 5],
          [20.5 + i, -156.5, 20]
        ]
      }
    })),
    config: {
      version: 'v1',
      config: {
        mapState: camera,
        visState: {
          layers: ['first', 'second'].map(id => ({
            id: `${id}-points`,
            type: 'point',
            config: {
              dataId: id,
              label: id,
              color: [10, 20, 30],
              isVisible: true,
              columns: {lat: 'lat', lng: 'lng'},
              visConfig: {radius: 12, opacity: 0.6, filled: true}
            }
          })),
          filters: [
            {
              id: 'shared',
              dataId: ['first', 'second'],
              name: ['value', 'value'],
              type: 'range',
              value: [5, 10],
              enlarged: false
            }
          ],
          effects: [
            {
              id: 'fog',
              type: SURFACE_FOG_TYPE,
              isEnabled: true,
              parameters: {height: 5900},
              animation: {height: animation}
            }
          ],
          cameraBookmarks: [{id: 'hawaii', name: 'Hawaii', camera}],
          interactionConfig: {
            tooltip: {
              enabled: true,
              fieldsToShow: {
                first: [{name: 'value', format: null}],
                second: [{name: 'value', format: null}]
              }
            }
          }
        }
      }
    }
  };
}

function setup() {
  const store = createStore(keplerGlReducer, applyMiddleware(taskMiddleware));
  store.dispatch(registerEntry({id: 'map'}));
  const ctx = {
    getKeplerState: () => (store.getState() as {map: KeplerGlState}).map,
    getVisState: () => (store.getState() as {map: KeplerGlState}).map.visState,
    dispatch: jest.fn(action => store.dispatch(wrapTo('map', action)))
  } as unknown as KeplerContext;
  return {ctx};
}

async function execute(command: RoomCommand, input: unknown, signal?: AbortSignal) {
  return (await command.execute({signal} as any, input)) as RoomCommandResult<any>;
}

function abortController() {
  const controller = new AbortController();
  // Jest's older jsdom lacks the method supplied by current browsers and Node.
  controller.signal.throwIfAborted ??= () => {
    if (controller.signal.aborted) throw controller.signal.reason;
  };
  return controller;
}

function serve(raw: unknown) {
  global.fetch = jest.fn(
    async url =>
      ({
        ok: true,
        json: async () =>
          ['localhost', 'example.com'].includes(new URL(String(url)).hostname)
            ? raw
            : {version: 8, sources: {}, layers: []}
      } as Response)
  );
}
const originalFetch = global.fetch;
beforeEach(() => serve(fixture()));
afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

it('round-trips the complete embedded project after both original URLs are unavailable', async () => {
  const {ctx} = setup();
  const opened = await execute(getOpenProjectCommand(ctx), {
    url: 'https://example.com/project.json'
  });
  expect(opened).toMatchObject({success: true, data: {status: 'loaded', warnings: []}});
  expect(
    await execute(getSetLayerLabelsCommand(ctx), {
      layerId: 'first-points',
      labels: [
        {
          field: 'value',
          size: 24,
          color: [10, 20, 30],
          anchor: 'middle',
          alignment: 'bottom',
          weight: 600,
          outlineWidth: 0.5,
          outlineColor: [0, 0, 0, 255],
          background: true,
          backgroundColor: [10, 20, 30, 180],
          collisionEnabled: true
        },
        {field: 'lat', size: 12}
      ]
    })
  ).toMatchObject({success: true});
  expect(
    await execute(getSetTooltipFieldsCommand(ctx), {
      dataId: 'first',
      fields: ['lng', 'value', 'lat']
    })
  ).toMatchObject({success: true});
  const labelsBefore = await execute(getLayerLabelsCommand(ctx), {layerId: 'first-points'});
  const tooltipsBefore = await execute(getTooltipFieldsCommand(ctx), {dataId: 'first'});
  const saved = await execute(getSaveProjectCommand(ctx), {
    dataMode: 'embedded',
    includeCredentials: false
  });
  expect(saved.success).toBe(true);
  const project = JSON.parse(saved.data.artifact.text);
  expect(project.datasets.map(dataset => dataset.data.allData.length)).toEqual([2, 2]);
  const other = setup();
  global.fetch = jest.fn(async url => {
    if (url === 'https://example.com/portable.json')
      return {ok: true, json: async () => project} as Response;
    if (String(url).endsWith('.csv')) throw new Error('Original dataset URLs are unavailable');
    // Basemap styles remain remote independently of the embedded datasets.
    return {ok: true, json: async () => ({version: 8, sources: {}, layers: []})} as Response;
  });
  expect(
    await execute(getOpenProjectCommand(other.ctx), {url: 'https://example.com/portable.json'})
  ).toMatchObject({success: true});
  expect(global.fetch).not.toHaveBeenCalledWith('https://example.com/first.csv', expect.anything());
  expect(global.fetch).not.toHaveBeenCalledWith(
    'https://example.com/second.csv',
    expect.anything()
  );
  const state = other.ctx.getKeplerState!()!;
  expect(state.mapState).toMatchObject(camera);
  expect(state.visState.mapInfo).toMatchObject({title: 'Hawaii', description: 'Two observations'});
  expect(state.visState.layers.map(layer => layer.config.visConfig)).toEqual([
    expect.objectContaining({radius: 12, opacity: 0.6}),
    expect.objectContaining({radius: 12, opacity: 0.6})
  ]);
  expect(state.visState.filters).toEqual([
    expect.objectContaining({id: 'shared', dataId: ['first', 'second'], value: [5, 10]})
  ]);
  for (const table of Object.values(state.visState.datasets)) {
    expect(table.dataContainer.numRows()).toBe(2);
    // Range filters run on the GPU; filteredIndex contains the CPU candidates.
    const getFilterValue = table.gpuFilter.filterValueAccessor(table.dataContainer)();
    const visibleRows = table.filteredIndex.filter(index =>
      getFilterValue({index}).every((value, channel) => {
        const [min, max] = table.gpuFilter.filterRange[channel];
        return typeof value === 'number' && value >= min && value <= max;
      })
    );
    expect(visibleRows).toEqual([0]);
  }
  expect(state.visState.effects[0]).toMatchObject({id: 'fog', animation: {height: animation}});
  expect(state.visState.cameraBookmarks).toEqual([{id: 'hawaii', name: 'Hawaii', camera}]);
  expect(state.visState.interactionConfig.tooltip.config.fieldsToShow).toEqual({
    ...fixture().config.config.visState.interactionConfig.tooltip.fieldsToShow,
    first: tooltipsBefore.data.fields
  });
  expect(await execute(getLayerLabelsCommand(other.ctx), {layerId: 'first-points'})).toEqual(
    labelsBefore
  );
  expect(await execute(getTooltipFieldsCommand(other.ctx), {dataId: 'first'})).toEqual(
    tooltipsBefore
  );
});

it('reports the legacy Surface Fog parameter without inventing animation timing', async () => {
  const project = fixture();
  (project.config.config.visState.effects[0].animation as any).height = {
    endValue: 900,
    easing: 'easeInOut'
  };
  serve(project);
  const {ctx} = setup();
  expect(await execute(getOpenProjectCommand(ctx), {url: '/legacy.json'})).toMatchObject({
    success: true,
    data: {
      warnings: [
        {
          code: 'unsupported-effect-animation',
          effectId: 'fog',
          effectType: SURFACE_FOG_TYPE,
          parameter: 'height'
        }
      ]
    }
  });
  expect(ctx.getVisState().effects[0].parameters.height).toBe(5900);
  expect(ctx.getVisState().effects[0].animation).toBeUndefined();
});

it.each([
  null,
  {},
  {datasets: [], config: {}},
  {...fixture(), config: {version: 'future', config: {visState: {}}}},
  {...fixture(), datasets: [{version: 'future', data: {}}]}
])('rejects invalid or unsupported projects before replacing the map: %j', async raw => {
  serve(raw);
  const {ctx} = setup();
  expect((await execute(getOpenProjectCommand(ctx), {url: '/invalid.json'})).success).toBe(false);
  expect(ctx.dispatch).not.toHaveBeenCalled();
});

it('reports HTTP and malformed JSON errors without replacing the map', async () => {
  const {ctx} = setup();
  global.fetch = jest.fn().mockResolvedValue({ok: false, status: 404});
  expect(await execute(getOpenProjectCommand(ctx), {url: '/missing.json'})).toMatchObject({
    success: false,
    error: expect.stringContaining('404')
  });
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => {
      throw new SyntaxError('Invalid JSON');
    }
  });
  expect(await execute(getOpenProjectCommand(ctx), {url: '/broken.json'})).toMatchObject({
    success: false,
    error: expect.stringContaining('JSON')
  });
  expect(ctx.dispatch).not.toHaveBeenCalled();
});

it('waits for delayed project data before ready and succeeds on the first layer lookup', async () => {
  const {ctx} = setup();
  const original = KeplerTable.prototype.importData;
  let release!: () => void;
  const wait = new Promise<void>(resolve => {
    release = resolve;
  });
  let started!: () => void;
  const start = new Promise<void>(resolve => {
    started = resolve;
  });
  jest
    .spyOn(KeplerTable.prototype, 'importData')
    .mockImplementation(async function (this: KeplerTable, data) {
      started();
      await wait;
      return original.call(this, data);
    });
  let finished = false;
  const pending = execute(getOpenProjectCommand(ctx), {url: '/project.json'}).then(result => {
    finished = true;
    return result;
  });
  // Fetch and parsing count as loading too, before any dataset task starts.
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({
    data: {state: 'loading', scope: 'mcp-open-project'}
  });
  await start;
  expect(finished).toBe(false);
  let ready = false;
  const status = execute(getProjectStatusCommand(ctx), {waitUntilReady: true}).then(result => {
    ready = true;
    return result;
  });
  await Promise.resolve();
  expect(ready).toBe(false);
  release();
  expect(await pending).toMatchObject({success: true});
  expect(await status).toMatchObject({success: true, data: {state: 'ready'}});
  expect(await execute(getLayerOptionsCommand(ctx), {layerId: 'first-points'})).toMatchObject({
    success: true,
    data: {layerId: 'first-points'}
  });
});

it('distinguishes an untracked empty map from a successfully opened empty project', async () => {
  const {ctx} = setup();
  expect(await execute(getProjectStatusCommand(ctx), {waitUntilReady: true})).toMatchObject({
    data: {state: 'unknown', scope: 'mcp-open-project'}
  });
  serve({datasets: [], config: {version: 'v1', config: {visState: {}}}});
  expect(await execute(getOpenProjectCommand(ctx), {url: '/empty.json'})).toMatchObject({
    success: true
  });
  expect(await execute(getProjectStatusCommand(ctx), {waitUntilReady: true})).toMatchObject({
    data: {state: 'ready', scope: 'mcp-open-project'}
  });
  expect(ctx.getVisState().layers).toEqual([]);
  expect(ctx.getVisState().datasets).toEqual({});
});

it('reports failed imports without source credentials and clears failure on retry', async () => {
  const {ctx} = setup();
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('https://example.com/?token=secret'));
  expect((await execute(getOpenProjectCommand(ctx), {url: '/project.json'})).success).toBe(false);
  expect(await execute(getProjectStatusCommand(ctx), {waitUntilReady: true})).toEqual({
    success: true,
    commandId: 'map.get-project-status',
    data: {state: 'failed', scope: 'mcp-open-project'}
  });
  const retry = execute(getOpenProjectCommand(ctx), {url: '/project.json'});
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({data: {state: 'loading'}});
  expect(await retry).toMatchObject({success: true});
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({data: {state: 'ready'}});
});

it('bounds and cancels readiness waits without cancelling the import', async () => {
  const {ctx} = setup();
  let release!: (value: Response) => void;
  (global.fetch as jest.Mock).mockImplementationOnce(
    () =>
      new Promise(resolve => {
        release = resolve;
      })
  );
  const pending = execute(getOpenProjectCommand(ctx), {url: '/project.json'});
  expect(
    await execute(getProjectStatusCommand(ctx), {waitUntilReady: true, timeoutMs: 1})
  ).toMatchObject({
    data: {state: 'loading', timedOut: true}
  });
  const controller = abortController();
  const cancelled = execute(
    getProjectStatusCommand(ctx),
    {waitUntilReady: true},
    controller.signal
  );
  controller.abort();
  expect(await cancelled).toMatchObject({
    success: false,
    error: expect.stringContaining('cancelled')
  });
  release({ok: true, json: async () => fixture()} as Response);
  expect(await pending).toMatchObject({success: true});
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({data: {state: 'ready'}});
});

it('forgets readiness after observing an untracked load or replaced map data', async () => {
  const {ctx} = setup();
  await execute(getOpenProjectCommand(ctx), {url: '/project.json'});
  const read = ctx.getVisState;
  ctx.getVisState = () => ({...read(), loadingIndicatorValue: 1});
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({data: {state: 'unknown'}});
  ctx.getVisState = read;
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({data: {state: 'unknown'}});
  await execute(getOpenProjectCommand(ctx), {url: '/project.json'});
  ctx.getVisState = () => ({...read(), datasets: {}});
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({data: {state: 'unknown'}});
});

it('reports dataset creation failure rather than successful project loading', async () => {
  const {ctx} = setup();
  jest
    .spyOn(KeplerTable.prototype, 'importData')
    .mockRejectedValue(new Error('Source unavailable'));
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
  expect(await execute(getOpenProjectCommand(ctx), {url: '/project.json'})).toMatchObject({
    success: false,
    error: expect.stringContaining('first, second')
  });
});

it('rejects overlapping imports across command instances while allowing separate maps', async () => {
  const {ctx} = setup();
  let release!: (response: Response) => void;
  (global.fetch as jest.Mock).mockImplementationOnce(
    () =>
      new Promise<Response>(resolve => {
        release = resolve;
      })
  );
  const pending = execute(getOpenProjectCommand(ctx), {url: '/first.json'});
  expect(await execute(getOpenProjectCommand(ctx), {url: '/second.json'})).toMatchObject({
    success: false,
    error: expect.stringContaining('already in progress')
  });
  expect(ctx.dispatch).not.toHaveBeenCalled();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({data: {state: 'loading'}});
  const other = setup();
  expect(await execute(getOpenProjectCommand(other.ctx), {url: '/other.json'})).toMatchObject({
    success: true
  });
  release({ok: true, json: async () => fixture()} as Response);
  expect(await pending).toMatchObject({success: true});
  expect(await execute(getOpenProjectCommand(ctx), {url: '/retry.json'})).toMatchObject({
    success: true
  });
});

it('keeps a cancelled import locked until its pending dataset tasks settle', async () => {
  const {ctx} = setup();
  const dispatch = ctx.dispatch;
  let dispatchCompletion!: Promise<void>;
  ctx.dispatch = jest.fn(action => {
    const completion = dispatch(action);
    if (action.type === ActionTypes.ADD_DATA_TO_MAP)
      dispatchCompletion = Promise.resolve(completion);
    return completion;
  });
  const original = KeplerTable.prototype.importData;
  let release!: () => void;
  const wait = new Promise<void>(resolve => {
    release = resolve;
  });
  let started!: () => void;
  const start = new Promise<void>(resolve => {
    started = resolve;
  });
  const importData = jest
    .spyOn(KeplerTable.prototype, 'importData')
    .mockImplementation(async function (this: KeplerTable, data) {
      started();
      await wait;
      return original.call(this, data);
    });
  const controller = abortController();
  const pending = execute(getOpenProjectCommand(ctx), {url: '/first.json'}, controller.signal);
  expect(await Promise.race([start.then(() => 'started'), pending])).toBe('started');
  controller.abort();
  expect(await pending).toMatchObject({
    success: false,
    error: expect.stringContaining('cancelled')
  });
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({data: {state: 'loading'}});
  const dispatchCount = (ctx.dispatch as jest.Mock).mock.calls.length;
  const fetchCount = (global.fetch as jest.Mock).mock.calls.length;
  expect(await execute(getOpenProjectCommand(ctx), {url: '/second.json'})).toMatchObject({
    success: false,
    error: expect.stringContaining('already in progress')
  });
  expect(ctx.dispatch).toHaveBeenCalledTimes(dispatchCount);
  expect(global.fetch).toHaveBeenCalledTimes(fetchCount);
  release();
  await dispatchCompletion;
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({data: {state: 'failed'}});
  importData.mockRestore();
  expect(await execute(getOpenProjectCommand(ctx), {url: '/retry.json'})).toMatchObject({
    success: true
  });
});

it('releases the import lock after dispatch rejects', async () => {
  const {ctx} = setup();
  (ctx.dispatch as jest.Mock).mockRejectedValueOnce(new Error('Reset failed'));
  expect(await execute(getOpenProjectCommand(ctx), {url: '/first.json'})).toMatchObject({
    success: false,
    error: 'Reset failed'
  });
  expect(await execute(getProjectStatusCommand(ctx), {})).toMatchObject({data: {state: 'failed'}});
  expect(await execute(getOpenProjectCommand(ctx), {url: '/retry.json'})).toMatchObject({
    success: true
  });
});

it('replaces a previous project basemap with a same-ID saved style', async () => {
  const {ctx} = setup();
  await ctx.dispatch(
    loadMapStyles({
      project: {
        id: 'project',
        label: 'Old style',
        icon: '',
        custom: 'LOCAL',
        layerGroups: [],
        url: 'https://styles.example.org/old.json',
        accessToken: 'old-token',
        style: {version: 8, name: 'Old cached style', sources: {}, layers: []}
      }
    })
  );
  const raw = fixture();
  const importedStyle = {
    id: 'project',
    label: 'New style',
    icon: '',
    custom: 'LOCAL',
    url: 'https://styles.example.org/new.json',
    accessToken: 'new-token'
  };
  const project = {
    ...raw,
    config: {
      ...raw.config,
      config: {
        ...raw.config.config,
        mapStyle: {styleType: 'project', mapStyles: {project: importedStyle}}
      }
    }
  };
  const newStyle = {version: 8, name: 'New fetched style', sources: {}, layers: []};
  global.fetch = jest.fn(
    async url =>
      ({
        ok: true,
        json: async () => (new URL(String(url)).hostname === 'localhost' ? project : newStyle)
      } as Response)
  );
  expect(await execute(getOpenProjectCommand(ctx), {url: '/project.json'})).toMatchObject({
    success: true
  });
  expect(ctx.getKeplerState!()!.mapStyle).toMatchObject({
    styleType: 'project',
    mapStyles: {project: {...importedStyle, style: newStyle}}
  });
  serve(fixture());
  expect(await execute(getOpenProjectCommand(ctx), {url: '/without-custom.json'})).toMatchObject({
    success: true
  });
  expect(ctx.getKeplerState!()!.mapStyle.mapStyles.project).toBeUndefined();
});

it('rejects custom basemap imports before mutation when the host cannot read map styles', async () => {
  const raw = fixture();
  serve({
    ...raw,
    config: {
      ...raw.config,
      config: {
        ...raw.config.config,
        mapStyle: {
          styleType: 'custom',
          mapStyles: {
            custom: {id: 'custom', custom: 'LOCAL', url: 'https://styles.example.org/style.json'}
          }
        }
      }
    }
  });
  const {ctx} = setup();
  delete ctx.getKeplerState;
  expect(await execute(getOpenProjectCommand(ctx), {url: '/project.json'})).toMatchObject({
    success: false,
    error: expect.stringContaining('getKeplerState')
  });
  expect(ctx.dispatch).not.toHaveBeenCalled();
});

it('requires an explicit credential choice and complete host state for export', async () => {
  const {ctx} = setup();
  expect((await execute(getSaveProjectCommand(ctx), {})).success).toBe(false);
  delete ctx.getKeplerState;
  expect(await execute(getSaveProjectCommand(ctx), {includeCredentials: false})).toMatchObject({
    success: false,
    error: expect.stringContaining('getKeplerState')
  });
});

it('rejects invalid URLs and pre-cancelled calls without changing the map', async () => {
  const {ctx} = setup();
  expect(
    (await execute(getOpenProjectCommand(ctx), {url: 'file:///tmp/project.json'})).success
  ).toBe(false);
  const controller = abortController();
  controller.abort();
  expect(
    (await execute(getOpenProjectCommand(ctx), {url: '/project.json'}, controller.signal)).success
  ).toBe(false);
  expect(ctx.dispatch).not.toHaveBeenCalled();
  expect(global.fetch).not.toHaveBeenCalled();
});
