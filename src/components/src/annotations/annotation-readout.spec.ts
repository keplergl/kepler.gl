// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AnnotationKind} from '@kepler.gl/constants';
import {Annotation, Filter} from '@kepler.gl/types';
import {KeplerTable} from '@kepler.gl/table';
import {getAnnotationReadoutValues} from './annotation-readout';

const caption = {
  id: 'caption',
  kind: AnnotationKind.TEXT,
  viewport: {anchor: 'top-left', margin: [24, 24]},
  readout: {type: 'time'}
} as Annotation;

test('follows the active data filter window before the layer time, in UTC, preserving epoch zero', () => {
  const filters = [
    {id: 'other', enabled: true, type: 'timeRange', value: [0, 86400000]},
    {id: 'active', enabled: true, type: 'timeRange', isAnimating: true, value: [-1000, 0]}
  ] as Filter[];
  expect(
    getAnnotationReadoutValues([caption], {filters, animationConfig: {currentTime: 12345}})
  ).toEqual({caption: '1970-01-01'});
  expect(
    getAnnotationReadoutValues([{...caption, readout: {type: 'time', format: 'HH:mm:ss'}}], {
      filters: [{...filters[1], value: [0, 60000]}]
    })
  ).toEqual({caption: '00:01:00'});
  expect(
    getAnnotationReadoutValues([caption], {
      filters: [{...filters[0], enabled: false}],
      animationConfig: {currentTime: 2 * 86400000}
    })
  ).toEqual({caption: '1970-01-03'});
});

test('missing or invalid time is an em dash; static/geographic annotations need no readout', () => {
  for (const currentTime of [undefined, null, NaN, Infinity, 9e15]) {
    expect(getAnnotationReadoutValues([caption], {animationConfig: {currentTime}})).toEqual({
      caption: '—'
    });
  }
  expect(getAnnotationReadoutValues([{...caption, readout: undefined}])).toEqual({});
  expect(getAnnotationReadoutValues([{...caption, viewport: undefined}])).toEqual({});
});

test('uses the synchronized start edge when the data timeline follows a filter window start', () => {
  expect(
    getAnnotationReadoutValues([caption], {
      filters: [
        {
          type: 'timeRange',
          value: [0, 86400000],
          syncedWithLayerTimeline: true,
          syncTimelineMode: 0
        } as Filter
      ]
    })
  ).toEqual({caption: '1970-01-01'});
});

test('treats inherited object names as literal annotation and dataset identifiers', () => {
  const values = getAnnotationReadoutValues([{...caption, id: '__proto__'}], {
    animationConfig: {currentTime: 0}
  });
  expect(values.__proto__).toBe('1970-01-01');
  for (const dataId of ['__proto__', 'constructor']) {
    expect(getAnnotationReadoutValues([{...caption, readout: {type: 'count', dataId}}])).toEqual({
      caption: '—'
    });
  }
});

test('counts GPU-filtered records as the timeline advances without mutating dataset state', async () => {
  const table = new KeplerTable({info: {id: 'counts'}, color: [0, 0, 0]});
  await table.importData({
    data: {
      fields: [{name: 'time', type: 'integer', analyzerType: 'INT'}],
      rows: [[0], [1], [2]]
    }
  });
  const annotation = {...caption, readout: {type: 'count' as const, dataId: table.id}};
  const filter = {
    id: 'time',
    dataId: [table.id],
    name: ['time'],
    fieldIdx: [0],
    type: 'range',
    domain: [0, 2],
    value: [0, 1],
    enabled: true,
    gpu: true,
    gpuChannel: [0]
  } as Filter;
  const filters = [filter];
  table.filterTable(filters, []);
  const originalIndex = table.filteredIdxCPU;
  const originalRecord = table.filterRecordCPU;
  const context = {datasets: {[table.id]: table}, filters};
  expect(table.filteredIndex).toEqual([0, 1, 2]);
  expect(getAnnotationReadoutValues([annotation], context)).toEqual({caption: '2'});
  expect(
    getAnnotationReadoutValues([annotation], {...context, filters: [{...filter, value: [2, 2]}]})
  ).toEqual({caption: '1'});
  expect(
    getAnnotationReadoutValues([annotation], {...context, filters: [{...filter, value: [3, 4]}]})
  ).toEqual({caption: '0'});
  expect(table.filteredIdxCPU).toBe(originalIndex);
  expect(table.filterRecordCPU).toBe(originalRecord);
  expect(getAnnotationReadoutValues([annotation])).toEqual({caption: '—'});
  expect(getAnnotationReadoutValues([annotation], {...context, filters: []})).toEqual({
    caption: '3'
  });
});
