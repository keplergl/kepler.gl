// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

/**
 * Allows to break down a url into multiple params
 * from http://blog.stevenlevithan.com/archives/parseuri
 */
export function parseUri(str: string): {[key: string]: any} {
  const o = parseUri.options;
  const m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
  const uri = {};
  let i = 14;

  while (i--) uri[o.key[i]] = m?.[i] || '';

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, ($0, $1, $2) => {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
}

parseUri.options = {
  strictMode: false,
  key: [
    'source',
    'protocol',
    'authority',
    'userInfo',
    'user',
    'password',
    'host',
    'port',
    'relative',
    'path',
    'directory',
    'file',
    'query',
    'anchor'
  ],
  q: {
    name: 'queryKey',
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict:
      // eslint-disable-next-line no-useless-escape
      /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:
      // eslint-disable-next-line no-useless-escape
      /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

/**
 * Validates an url
 * @param str
 */
export function validateUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether a given URL points to a PMTiles file.
 * @param url The URL to check.
 * @returns True if the URL includes '.pmtiles', otherwise false.
 */
export const isPMTilesUrl = (url?: string | null) => url?.includes('.pmtiles');
