import {ActionTypes} from 'kepler.gl/actions';
import {LOCATION_CHANGE} from 'react-router-redux';

const getPayload = ({payload}) => payload;

const withStoreInformation = getTracking => (payload, store) => {
  const trackingFromPayload = getTracking(payload, store);
  try {
    const {
      demo: {
        keplerGl: {
          map: {
            visState: {datasets = {}, filters = [], layers = []}
          }
        }
      }
    } = store.getState();
    const trackingFromStore = {
      datasetsCount: Object.keys(datasets).length,
      layersCount: layers.length,
      filtersCount: filters.length
    };
    return {
      ...trackingFromStore,
      ...trackingFromPayload
    };
  } catch (err) {
    /* eslint-disable */
    console.warn(err);
    /* eslint-enable */
    return trackingFromPayload;
  }
};

const trackingInformation = {
  [ActionTypes.LOAD_FILES]: ({files}) =>
    files.map(({size, type}) => ({size, type})),
  [ActionTypes.LAYER_HOVER]: ({
    payload: {
      info: {lngLat}
    }
  }) => lngLat,
  [ActionTypes.LAYER_CONFIG_CHANGE]: ({
    payload: {
      oldLayer: {type},
      newConfig
    }
  }) => ({
    type,
    newConfig
  }),
  [ActionTypes.MAP_STYLE_CHANGE]: getPayload,
  [ActionTypes.TOGGLE_MODAL]: getPayload,
  [ActionTypes.TOGGLE_SIDE_PANEL]: getPayload,
  [ActionTypes.UPDATE_MAP]: withStoreInformation(getPayload),
  [ActionTypes.SET_FILTER]: withStoreInformation(getPayload),
  [ActionTypes.INTERACTION_CONFIG_CHANGE]: ({config}) => config,
  [LOCATION_CHANGE]: x => x
};

const analyticsMiddleware = store => next => action => {
  // eslint-disable-next-line no-undef
  if (window && window.ga) {
    // eslint-disable-next-line no-undef
    window.ga(
      'demo_app',
      action.type,
      trackingInformation[action.type]
        ? JSON.stringify(
            trackingInformation[action.type](action.payload, store)
          )
        : undefined
    );
  }
  return next(action);
};

export default analyticsMiddleware;
