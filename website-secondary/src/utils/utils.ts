import {
  CLOUDFRONT,
  KEPLER_FSQ_BUCKET,
  KEPLER_FSQ_DESKTOP_BUCKET,
  KEPLER_GL_BUCKET,
  WEBSITE_ASSET_FOLDER
} from '../constants/constants';

export function cdnUrl(path: string) {
  return `${CLOUDFRONT}/${KEPLER_GL_BUCKET}/${WEBSITE_ASSET_FOLDER}/${path}`;
}
export function fsqCdnUrl(path: string) {
  return `${KEPLER_FSQ_BUCKET}/${path}`;
}

export function fsqStudioUrl(path: string) {
  return fsqCdnUrl(`studio/${path}`);
}

export function fsqCdnDesktopUrl(path: string) {
  return `${KEPLER_FSQ_DESKTOP_BUCKET}/${path}`;
}
