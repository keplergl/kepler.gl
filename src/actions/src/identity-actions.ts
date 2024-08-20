// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {createAction} from '@reduxjs/toolkit';
import {default as ActionTypes} from './action-types';
import {UiState} from '@kepler.gl/types';

export type RegisterEntryUpdaterAction = {
  payload: {
    id: string;
    mint?: boolean;
    mapboxApiAccessToken?: string;
    mapboxApiUrl?: string;
    mapStylesReplaceDefault?: boolean;
    initialUiState?: Partial<UiState>;
  };
};
/**
 *
 * Add a new kepler.gl instance in `keplerGlReducer`. This action is called under-the-hood when a `KeplerGl` component is **mounted** to the dom.
 * Note that if you dispatch actions such as adding data to a kepler.gl instance before the React component is mounted, the action will not be
 * performed. Instance reducer can only handle actions when it is instantiated.
 * @memberof rootActions
 * @param payload
 * @param payload.id - ***required** The id of the instance
 * @param payload.mint - Whether to use a fresh empty state, when `mint: true` it will *always* load a fresh state when the component is re-mounted.
 * When `mint: false` it will register with existing instance state under the same `id`, when the component is unmounted then mounted again. Default: `true`
 * @param payload.mapboxApiAccessToken - mapboxApiAccessToken to be saved in `map-style` reducer.
 * @param payload.mapboxApiUrl - mapboxApiUrl to be saved in `map-style` reducer.
 * @param payload.mapStylesReplaceDefault - mapStylesReplaceDefault to be saved in `map-style` reducer.
 * @param payload.initialUiState - initial ui state
 * @public
 */
export const registerEntry: (entry: RegisterEntryUpdaterAction['payload']) => {
  type: typeof ActionTypes.REGISTER_ENTRY;
  payload: RegisterEntryUpdaterAction['payload'];
} = createAction(ActionTypes.REGISTER_ENTRY, (payload: RegisterEntryUpdaterAction['payload']) => ({
  payload
}));

/**
 *
 * Delete an instance from `keplerGlReducer`. This action is called under-the-hood when a `KeplerGl` component is **un-mounted** to the dom.
 * If `mint` is set to be `true` in the component prop, the instance state will be deleted from the root reducer. Otherwise, the root reducer will keep
 * the instance state and later transfer it to a newly mounted component with the same `id`
 * @memberof rootActions
 * @param {string} id - the id of the instance to be deleted
 * @public
 */
export const deleteEntry: (id: string) => {
  type: typeof ActionTypes.DELETE_ENTRY;
  payload: string;
} = createAction(ActionTypes.DELETE_ENTRY, (id: string) => ({payload: id}));

/**
 *
 * Rename an instance in the root reducer, keep its entire state
 *
 * @memberof rootActions
 * @param {string} oldId - ***required** old id
 * @param {string} newId - ***required** new id
 * @public
 */
export const renameEntry: (
  oldId: string,
  newId: string
) => {
  type: typeof ActionTypes.RENAME_ENTRY;
  payload: {
    oldId: string;
    newId: string;
  };
} = createAction(ActionTypes.RENAME_ENTRY, (oldId: string, newId: string) => ({
  payload: {
    oldId,
    newId
  }
}));

/**
 * This declaration is needed to group actions in docs
 */
/**
 * Root actions managers adding and removing instances in root reducer.
 * Under-the-hood, when a `KeplerGl` component is mounted or unmounted,
 * it will automatically calls these actions to add itself to the root reducer.
 * However, sometimes the data is ready before the component is registered in the reducer,
 * in this case, you can manually call these actions or the corresponding updater to add it to the reducer.
 *
 * @public
 */
/* eslint-disable  @typescript-eslint/no-unused-vars */
// @ts-ignore
const rootActions = null;
/* eslint-enable  @typescript-eslint/no-unused-vars */
