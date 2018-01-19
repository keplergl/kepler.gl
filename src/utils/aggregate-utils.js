import {min, max, mean, median, sum} from 'd3-array';
import {AGGREGATION_TYPES} from '../constants/default-settings';

export function aggregate(data, technique) {
  switch (technique) {
    case AGGREGATION_TYPES.average:
      return mean(data);
    case AGGREGATION_TYPES.countUnique:
      return Object.keys(
        data.reduce((uniques, val) => {
          uniques[val] = true;
          return uniques;
        }, {})
      ).length;
    case AGGREGATION_TYPES.maximum:
      return max(data);
    case AGGREGATION_TYPES.minimum:
      return min(data);
    case AGGREGATION_TYPES.median:
      return median(data);
    case AGGREGATION_TYPES.sum:
      return sum(data);
    default:
      return data.length;
  }
}
