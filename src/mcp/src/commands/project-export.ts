// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {DatasetType} from '@kepler.gl/constants';
import {exportToJsonString, getMapJSON} from '@kepler.gl/utils';
import type {VisState} from './types';

export type ProjectExportOptions = {
  dataMode: 'embedded' | 'references';
  includeCredentials: boolean;
};

export type ProjectExportWarning = {code: string; message: string; datasetId?: string};

const REMOTE_DATASET_TYPES = new Set<string>([
  DatasetType.VECTOR_TILE,
  DatasetType.RASTER_TILE,
  DatasetType.WMS_TILE,
  DatasetType.TILE_3D,
  DatasetType.BITMAP,
  DatasetType.ZARR
]);

const REMOTE_METADATA_FIELDS = new Set([
  'source',
  'sourceFormat',
  'refreshIntervalMs',
  'refreshStatus',
  'refreshError',
  'refreshProgress',
  'lastFetchedAt',
  'etag',
  'lastModified',
  'size'
]);

// Match established credential fields and common signed-URL parameters. This
// deliberately does not inspect rows, field values, or arbitrary secret names.
const CREDENTIAL_FIELDS = new Set([
  'tile3daccesstoken',
  'accesstoken',
  'authtoken',
  'refreshtoken',
  'token',
  'apikey',
  'authorization',
  'password',
  'clientsecret',
  'secret',
  'credentials'
]);
const URL_CREDENTIAL_FIELDS = new Set([
  ...CREDENTIAL_FIELDS,
  'key',
  'signature',
  'sig',
  'credential',
  'awsaccesskeyid',
  'xamzcredential',
  'xamzsignature',
  'xamzsecuritytoken',
  'xgoogcredential',
  'xgoogsignature'
]);
const normalizeCredentialName = (name: string) => name.replace(/[-_]/g, '').toLowerCase();

function omitCredentials(value: unknown, removed: () => void, fieldName = ''): unknown {
  const isUrlField = /(?:url|urls|uri|uris)$/i.test(fieldName) || fieldName === 'source';
  if (
    typeof value === 'string' &&
    (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(value) ||
      /^(?:\/|\.\.?\/)/.test(value) ||
      (isUrlField && !/^[a-z][a-z\d+.-]*:/i.test(value)))
  ) {
    const protocolRelative = value.startsWith('//');
    const relative = !protocolRelative && !/^[a-z][a-z\d+.-]*:/i.test(value);
    let url: URL;
    try {
      url = new URL(value, 'https://kepler.invalid/');
    } catch {
      return value;
    }
    let changed = false;
    if (url.username || url.password) {
      url.username = '';
      url.password = '';
      changed = true;
    }
    for (const name of Array.from(url.searchParams.keys())) {
      if (URL_CREDENTIAL_FIELDS.has(normalizeCredentialName(name))) {
        url.searchParams.delete(name);
        changed = true;
      }
    }
    if (!changed) return value;
    removed();
    if (relative) {
      // Keep relative directories and template paths intact; only the query
      // changes. Resolving against a dummy origin is solely for URL parsing.
      const hashIndex = value.indexOf('#');
      const beforeHash = hashIndex < 0 ? value : value.slice(0, hashIndex);
      const queryIndex = beforeHash.indexOf('?');
      const path = queryIndex < 0 ? beforeHash : beforeHash.slice(0, queryIndex);
      return `${path}${url.search}${hashIndex < 0 ? '' : value.slice(hashIndex)}`;
    }
    return protocolRelative ? url.href.slice('https:'.length) : url.href;
  }
  if (Array.isArray(value)) return value.map(item => omitCredentials(item, removed, fieldName));
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).flatMap(([name, child]) => {
      if (CREDENTIAL_FIELDS.has(normalizeCredentialName(name))) {
        removed();
        return [];
      }
      return [[name, omitCredentials(child, removed, name)]];
    })
  );
}

/** Serialize using the app's schema without changing its live tables or config. */
export function serializeProject(
  state: {visState: VisState},
  options: ProjectExportOptions
): {text: string; warnings: ProjectExportWarning[]} {
  const warnings: ProjectExportWarning[] = [];
  const datasets = Object.fromEntries(
    Object.entries(state.visState.datasets).map(([id, dataset]) => {
      if (options.dataMode !== 'embedded') return [id, dataset];
      if (REMOTE_DATASET_TYPES.has(dataset.type || '')) {
        warnings.push({
          code: 'remote-data-reference',
          datasetId: id,
          message: `Dataset "${id}" uses ${dataset.type} data and remains a remote reference; it requires its source when reopened.`
        });
        return [id, dataset];
      }
      if (dataset.type !== DatasetType.EXTERNALLY_HOSTED) return [id, dataset];
      if (!dataset.dataContainer) {
        throw new Error(
          `Dataset "${id}" has no loaded data to embed. Wait for it to finish loading.`
        );
      }
      // The schema deliberately saves externally hosted tables as references.
      // Present a local copy to use its normal row/Arrow serialization instead.
      return [
        id,
        {
          ...dataset,
          type: DatasetType.LOCAL,
          metadata: Object.fromEntries(
            Object.entries(dataset.metadata || {}).filter(
              ([name]) => !REMOTE_METADATA_FIELDS.has(name)
            )
          )
        }
      ];
    })
  );
  let map = getMapJSON(
    {...state, visState: {...state.visState, datasets}},
    {hasData: true, includeLayerApiKeys: options.includeCredentials}
  );
  if (!options.includeCredentials) {
    let removed = Object.values(state.visState.datasets).some(
      dataset => dataset.metadata && 'tile3dAccessToken' in dataset.metadata
    );
    const markRemoved = () => {
      removed = true;
    };
    map = {
      ...map,
      config: omitCredentials(map.config, markRemoved),
      datasets: map.datasets.map(dataset => ({
        ...dataset,
        data: {
          ...dataset.data,
          ...(dataset.data.metadata
            ? {metadata: omitCredentials(dataset.data.metadata, markRemoved)}
            : {})
        }
      }))
    };
    if (removed) {
      warnings.push({
        code: 'credentials-omitted',
        message:
          'Known credential fields and URL credentials were omitted. Protected sources may need credentials when reopened. Dataset rows and unrecognized custom fields are not scanned for secrets.'
      });
    }
  }
  return {text: exportToJsonString(map), warnings};
}
