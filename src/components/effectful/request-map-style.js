import {useEffect} from 'react';
import {json as requestJson} from 'd3-request';
import {generateHashId} from 'utils/utils';

// Utils
import {isValidStyleUrl, getStyleDownloadUrl} from 'utils/map-style-utils/mapbox-gl-style-editor';

// This is exported to aid testing.
export const TASKS = {
  loadMapStyleTask,
  requestMapStyles
};

export default function RequestMapStyle({
  defaultMapStyles,
  mapStyles,
  loadMapStyles,
  mapboxApiAccessToken,
  mapboxApiUrl
}) {
  useEffect(
    () => {
      const defaultStyles = Object.values(defaultMapStyles);
      // add id to custom map styles if not given
      const customStyles = (mapStyles || []).map(ms => ({
        ...ms,
        id: ms.id || generateHashId()
      }));

      const allStyles = [...customStyles, ...defaultStyles].reduce(
        (accu, style) => {
          const hasStyleObject = style.style && typeof style.style === 'object';
          accu[hasStyleObject ? 'toLoad' : 'toRequest'][style.id] = style;

          return accu;
        },
        {toLoad: {}, toRequest: {}}
      );
      loadMapStyles(allStyles.toLoad);
      // TODO: Make the side effect here and then call loadMapStyles
      TASKS.requestMapStyles(allStyles.toRequest, {
        mapboxApiAccessToken,
        mapboxApiUrl,
        loadMapStyles
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // This is intentional. This effect is only called once, on mount.
    ]
  );
  return null;
}

function requestMapStyles(mapStyles, {mapboxApiAccessToken, mapboxApiUrl, loadMapStyles}) {
  return Promise.all(
    Object.values(mapStyles)
      .map(({id, url, accessToken}) => ({
        id,
        url: isValidStyleUrl(url)
          ? getStyleDownloadUrl(url, accessToken || mapboxApiAccessToken, mapboxApiUrl)
          : url
      }))
      .map(TASKS.loadMapStyleTask)
  ).then(
    // success
    results =>
      loadMapStyles(
        results.reduce(
          (accu, {id, style}) => ({
            ...accu,
            [id]: {
              ...mapStyles[id],
              style
            }
          }),
          {}
        )
      ),
    // error
    // loadMapStyleErr
    () => {}
  );
}

function loadMapStyleTask({url, id}) {
  return new Promise((success, error) =>
    requestJson(url, (err, result) => {
      if (err) {
        error(err);
      } else {
        if (!result) {
          error(new Error('Map style response is empty'));
        }
        success({id, style: result});
      }
    })
  );
}
