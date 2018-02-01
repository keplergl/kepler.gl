import {
  DEFAULT_TOOLTIP_FIELDS,
  MAX_DEFAULT_TOOLTIPS,
  ALL_FIELD_TYPES,
  TRIP_POINT_FIELDS
} from '../constants/default-settings';
import {Messages, Crosshairs} from 'components/common/icons/index';

export function getDefaultInteraction() {
  return {
    tooltip: {
      id: 'tooltip',
      enabled: true,
      iconComponent: Messages,
      config: {
        fieldsToShow: {}
      }
    },
    brush: {
      id: 'brush',
      enabled: false,
      iconComponent: Crosshairs,
      config: {
        // size is in km
        size: 0.5
      }
    }
  };
}

export function findFieldsToShow({fields, id}) {
  // first find default tooltip fields for trips
  const fieldsToShow = DEFAULT_TOOLTIP_FIELDS.reduce((prev, curr) => {
    if (fields.find(({name}) => curr === name)) {
      prev.push(curr);
    }
    return prev;
  }, []);

  return {
    [id]: fieldsToShow.length ? fieldsToShow : autoFindTooltipFields(fields)
  };
}

function autoFindTooltipFields(fields) {
  const ptFields = _mergeFieldPairs(TRIP_POINT_FIELDS);
  // filter out the default fields that contains lat and lng and any geometry
  const fieldsToShow = fields.filter(
    ({name, type}) =>
      name
        .replace(/[_,.]+/g, ' ')
        .trim()
        .split(' ')
        .every(seg => !ptFields.includes(seg)) &&
      type !== ALL_FIELD_TYPES.geojson &&
      type !== 'object'
  );

  return fieldsToShow.slice(0, MAX_DEFAULT_TOOLTIPS).map(d => d.name);
}

function _mergeFieldPairs(pairs) {
  return pairs.reduce((prev, pair) => [...prev, ...pair], []);
}
