/* eslint-disable guard-for-in */

/**
 *
 * @param {Object} updateTriggers {getPosition: {column}, getData: {filteredIndex}}
 * @param {Object} oldUpdateTriggers
 * @returns {Boolean|Object} `false` if nothing changed, or `triggerChanged` as an object
 */
export function diffUpdateTriggers(updateTriggers, oldUpdateTriggers = {}) {
  const triggerChanged = {};
  let reason = false;

  for (const triggerName in updateTriggers) {
    const newTriggers = updateTriggers[triggerName] || {};
    const oldTriggers = oldUpdateTriggers[triggerName] || {};
    const diffReason = compareUpdateTrigger(newTriggers, oldTriggers, triggerName);

    if (diffReason) {
      triggerChanged[triggerName] = true;
      reason = triggerChanged;
    }
  }

  return reason;
}

function compareUpdateTrigger(newTriggers, oldTriggers, triggerName) {
  for (const key in oldTriggers) {
    if (!(key in newTriggers)) {
      return `${triggerName}.${key} deleted`;
    }

    // shallow compare
    if (oldTriggers[key] !== newTriggers[key]) {
      return `${triggerName}.${key} changed shallowly`;
    }
  }

  for (const key in newTriggers) {
    if (!(key in oldTriggers)) {
      return `${triggerName}.${key} added`;
    }
  }

  return null;
}
