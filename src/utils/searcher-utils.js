/* eslint-disable callback-return */
export function simpleSearcher(autofillValues, page, query, cb) {
  var regex = new RegExp(query, 'i');
  var foundQuery = false;
  var matches = (autofillValues || []).filter(function _filter(item) {
    var tag = item.name;
    foundQuery = foundQuery || tag === query;
    return tag && regex.test(tag);
  });

  if (cb) {
    cb(matches);
  }

  return matches;
}
/* eslint-enable callback-return */
