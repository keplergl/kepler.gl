import { ALL_FIELD_TYPES } from "constants";
import { unique, notNullorUndefined } from "utils/data-utils";

export function mergeDomain(oldDomain, newDomain, fieldType) {
  switch (fieldType) {
    case ALL_FIELD_TYPES.real:
    case ALL_FIELD_TYPES.integer:
    case ALL_FIELD_TYPES.timestamp:
      return mergeNumericFieldDomain(oldDomain, newDomain);
    case ALL_FIELD_TYPES.boolean:
      return [true, false];
    case ALL_FIELD_TYPES.string:
    case ALL_FIELD_TYPES.date:
    default:
      return mergeOrdinalFieldDomain(oldDomain, newDomain);
  }
}

function mergeNumericFieldDomain(oldDomain, newDomain) {
  // Only return new object if domain needs to be changed, so we don't 
  // unnecessarily rerender layers. 
  const [oldMin, oldMax] = oldDomain;
  const [newMin, newMax] = newDomain;
  if (newMin >= oldMin && newMax <= oldMax) {
    return oldDomain;
  }
  return [Math.min(oldMin, newMin), Math.max(oldMax, newMax)];
}

function mergeOrdinalFieldDomain(oldDomain, newDomain) {
  const mergedDomain = unique(oldDomain.concat(newDomain)).filter(notNullorUndefined);
  if (mergedDomain.length === oldDomain.length) {
    return oldDomain;
  }
  return mergedDomain.sort();
}