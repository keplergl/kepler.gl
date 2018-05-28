export const transformRequest = (url, resourceType) => {
  const isMapboxRequest = url.slice(8, 22) === 'api.mapbox.com' ||
    url.slice(10, 26) === 'tiles.mapbox.com';

  return {
    url: isMapboxRequest ? url.replace('?', '?pluginName=Keplergl&') : url
  };
};
