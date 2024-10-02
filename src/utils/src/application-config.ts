/**
 * A mechanism to override default Kepler values/settings so that we
 * without having to make application-specific changes to the kepler repo.
 */
export type KeplerApplicationConfig = {
  /** Default name of export HTML file, can be overridden by user */
  defaultHtmlName?: string;
  defaultImageName?: string;
  defaultJsonName?: string;
  defaultDataName?: string;
  defaultExportJsonSettings?: {
    hasData?: boolean;
  };
};

const DEFAULT_APPLICATION_CONFIG: Required<KeplerApplicationConfig> = {
  defaultHtmlName: 'kepler.gl.html',
  defaultImageName: 'kepler.gl.png',
  defaultJsonName: 'kepler.gl.json',
  defaultDataName: 'kepler.gl',
  defaultExportJsonSettings: {
    hasData: true
  }
};

const applicationConfig: Required<KeplerApplicationConfig> = DEFAULT_APPLICATION_CONFIG;

export const getApplicationConfig = (): Required<KeplerApplicationConfig> => applicationConfig;

export function initApplicationConfig(appConfig: KeplerApplicationConfig = {}) {
  Object.assign(applicationConfig, appConfig);
}
