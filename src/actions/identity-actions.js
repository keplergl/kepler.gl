import {createAction} from 'redux-actions';
import {ACTION_PREFIX} from 'constants/default-settings';

// Actions to add and remove entries
export const REGISTER_ENTRY = `${ACTION_PREFIX}REGISTER_ENTRY`;
export const DELETE_ENTRY = `${ACTION_PREFIX}DELETE_ENTRY`;
export const RENAME_ENTRY = `${ACTION_PREFIX}RENAME_ENTRY`;

export const [registerEntry, deleteEntry, renameEntry] = [
  REGISTER_ENTRY,
  DELETE_ENTRY,
  RENAME_ENTRY
].map(a => createAction(a));
