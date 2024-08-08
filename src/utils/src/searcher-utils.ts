// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/* eslint-disable callback-return */
export function simpleSearcher(autofillValues, page, query, cb) {
  const regex = new RegExp(query, 'i');
  let foundQuery = false;
  const matches = (autofillValues || []).filter(function _filter(item) {
    const tag = item.name;
    foundQuery = foundQuery || tag === query;
    return tag && regex.test(tag);
  });

  if (cb) {
    cb(matches);
  }

  return matches;
}
/* eslint-enable callback-return */
