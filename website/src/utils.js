// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {CLOUDFRONT, KEPLER_GL_BUCKET, WEBSITE_ASSET_FOLDER, KEPLER_FSQ_BUCKET} from './constants';

export function cdnUrl(path) {
  return `${CLOUDFRONT}/${KEPLER_GL_BUCKET}/${WEBSITE_ASSET_FOLDER}/${path}`;
}
export function fsqCdnUrl(path) {
  return `${KEPLER_FSQ_BUCKET}/${path}`;
}

export function fsqStudioUrl(path) {
  return fsqCdnUrl(`studio/${path}`);
}
