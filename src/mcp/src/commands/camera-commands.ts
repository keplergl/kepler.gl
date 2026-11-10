// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {z} from 'zod';
import {
  controlCameraTour,
  setCameraBookmarks,
  setCameraTour,
  setMapControlVisibility,
  updateMap
} from '@kepler.gl/actions';
import {
  evaluateCameraTour,
  getCameraSnapshot,
  getCameraTourDuration,
  normalizeCameraTour
} from '@kepler.gl/utils';
import type {CameraBookmark, CameraTour} from '@kepler.gl/types';
import type {KeplerContext, RoomCommand} from './types';

const cameraSchema = z.object({
  longitude: z.number(),
  latitude: z.number().min(-90).max(90),
  zoom: z.number(),
  bearing: z.number(),
  pitch: z.number().min(0).max(90)
});
const identifier = z.string().trim().min(1);
const duration = z.number().min(0).max(Number.MAX_SAFE_INTEGER);
const bookmarksSchema = z.object({
  action: z.enum(['list', 'save', 'remove', 'go-to', 'show-control']),
  id: identifier.optional().describe('Required for save, remove, and go-to.'),
  name: z.string().optional().describe('Required for save.'),
  camera: cameraSchema.optional().describe('For save: omit to capture the current camera.'),
  showControl: z
    .boolean()
    .optional()
    .describe('For save or show-control: show/hide the bookmark control.')
});

function assertNavigable(ctx: KeplerContext) {
  const state = ctx.getMapState?.();
  if (!state) throw new Error('The host must supply getMapState to navigate the camera.');
  if (state.isSplit || state.globe?.enabled) {
    throw new Error('Camera navigation requires a single Mercator map.');
  }
}

export function getCameraBookmarksCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.camera-bookmarks';
  return {
    id,
    name: 'Manage camera bookmarks',
    group: 'Map',
    description:
      'List, save, remove, navigate to camera bookmarks, or show-control without resaving. Save upserts by id, preserving other ' +
      'bookmarks and their order. Omit camera to capture the current view; pass showControl true ' +
      'to display the map bookmark control. Go-to moves immediately in a single Mercator map.',
    metadata: {readOnly: false, riskLevel: 'low'},
    inputSchema: bookmarksSchema,
    execute: (_execution, input) => {
      try {
        const args = bookmarksSchema.parse(input);
        if (!['list', 'show-control'].includes(args.action) && !args.id)
          throw new Error('id is required for this bookmark action.');
        const bookmarks: CameraBookmark[] = ctx.getVisState().cameraBookmarks ?? [];
        let next = bookmarks;
        if (args.action === 'show-control') {
          if (args.showControl === undefined) throw new Error('showControl is required.');
          ctx.dispatch(setMapControlVisibility('cameraBookmarks', args.showControl));
        } else if (args.action === 'save') {
          if (args.name === undefined) throw new Error('name is required to save a bookmark.');
          const camera = args.camera ?? getCameraSnapshot(ctx.getMapState?.());
          if (!camera)
            throw new Error('Provide camera or a host getMapState accessor to capture the view.');
          const bookmark = {id: args.id!, name: args.name, camera};
          next = bookmarks.some(b => b.id === args.id)
            ? bookmarks.map(b => (b.id === args.id ? bookmark : b))
            : [...bookmarks, bookmark];
          ctx.dispatch(setCameraBookmarks(next));
          if (args.showControl !== undefined) {
            ctx.dispatch(setMapControlVisibility('cameraBookmarks', args.showControl));
          }
        } else if (args.action !== 'list') {
          const bookmark = bookmarks.find(b => b.id === args.id);
          if (!bookmark) throw new Error(`Bookmark "${args.id}" not found.`);
          if (args.action === 'remove') {
            next = bookmarks.filter(b => b.id !== args.id);
            ctx.dispatch(setCameraBookmarks(next));
          } else {
            assertNavigable(ctx);
            ctx.dispatch(controlCameraTour({action: 'pause'}));
            ctx.dispatch(updateMap({...bookmark.camera, transitionDuration: 0}));
          }
        }
        return {success: true, commandId: id, data: {bookmarks: next}};
      } catch (error) {
        return {
          success: false,
          commandId: id,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };
}

const tourSchema = z.object({
  action: z.enum(['get', 'set', 'seek', 'play', 'pause']),
  elapsedMs: duration.optional().describe('Required for seek.'),
  stops: z
    .array(
      z.object({
        id: identifier,
        name: z.string(),
        camera: cameraSchema,
        holdDurationMs: duration,
        travelDurationMs: duration
      })
    )
    .optional()
    .describe(
      'Required for set: ordered stops; [] clears the tour. Snapshots are independent of bookmarks.'
    )
});

export function getCameraTourCommand(ctx: KeplerContext): RoomCommand {
  const id = 'map.camera-tour';
  return {
    id,
    name: 'Configure camera tour',
    group: 'Map',
    description:
      'Get or replace the saved location-animation tour, seek to elapsedMs, play or pause. ' +
      'Each stop holds before travelling to the next; the last travel duration is unused. ' +
      'Play resumes the shared player even with the side panel closed; manual camera navigation pauses it. ' +
      'Seek pauses and moves immediately. Playback requires a single Mercator map.',
    metadata: {readOnly: false, riskLevel: 'low'},
    inputSchema: tourSchema,
    execute: (_execution, input) => {
      try {
        const args = tourSchema.parse(input);
        let tour: CameraTour | null = ctx.getVisState().cameraTour ?? null;
        if (args.action === 'set') {
          if (!args.stops) throw new Error('stops is required to set a tour; use [] to clear it.');
          tour = normalizeCameraTour({stops: args.stops});
          if (args.stops.length && (!tour || tour.stops.length !== args.stops.length)) {
            throw new Error(
              'Tour stop ids must be unique and total duration must not exceed Number.MAX_SAFE_INTEGER.'
            );
          }
          ctx.dispatch(setCameraTour(tour));
        } else if (args.action === 'play') {
          assertNavigable(ctx);
          if (getCameraTourDuration(tour) <= 0)
            throw new Error('Create a tour with positive duration before playing.');
          ctx.dispatch(setMapControlVisibility('cameraTour', true));
          ctx.dispatch(controlCameraTour({action: 'play'}));
        } else if (args.action === 'pause') {
          ctx.dispatch(controlCameraTour({action: 'pause'}));
        } else if (args.action === 'seek') {
          if (args.elapsedMs === undefined)
            throw new Error('elapsedMs is required to seek a tour.');
          assertNavigable(ctx);
          const camera = evaluateCameraTour(tour, args.elapsedMs);
          if (!camera) throw new Error('Create a camera tour before seeking.');
          ctx.dispatch(setMapControlVisibility('cameraTour', true));
          ctx.dispatch(controlCameraTour({action: 'seek', elapsedMs: args.elapsedMs}));
          ctx.dispatch(updateMap({...camera, transitionDuration: 0}));
        }
        return {
          success: true,
          commandId: id,
          data: {tour, durationMs: getCameraTourDuration(tour)}
        };
      } catch (error) {
        return {
          success: false,
          commandId: id,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    }
  };
}
