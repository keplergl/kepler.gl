import {taskCreator} from 'react-palm/tasks';
import request from 'd3-request';
import {getQueryURL} from '../utils/mapzen-utils';

/*
 * request vector building tile from Mapzen
 */
export const LOAD_BUILDING_TILE_TASK = taskCreator(
  ({x, y, z, features}, success, error) =>
    new Promise((resolve, reject) => {
      if (features) {
        resolve(features);
      } else {
        request.json(getQueryURL(x, y, z), (err, result) => {
          if (err) {
            error(err);
          } else if (!result.features) {
            resolve(null);
          } else {

            const cleaned = result.features.filter(f =>
              (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') && f.properties.height
            );

            resolve(cleaned);
          }
        });
      }
    }).then(loaded => success(loaded)),

  'LOAD_BUILDING_TILE_TASK'
);

export const LOAD_FILE_TASK = taskCreator(
  ({fileBlob, info, handler, processor}, success, error) =>
    handler(fileBlob, processor).then(result => {
      if (!result) {
        throw new Error('fail to load data')
      } else {
        success({data: result, info});
      }
    })
      .catch(err => error(err)),

  'LOAD_FILE_TASK'
);
