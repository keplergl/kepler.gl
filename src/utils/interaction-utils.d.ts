import {InteractionConfig, Field} from '../reducers/vis-state-updaters'

export function getDefaultInteraction(): InteractionConfig;
export function findFieldsToShow(p: {fields: Field[], id: string}): {
  [key: string]: string[]
}
