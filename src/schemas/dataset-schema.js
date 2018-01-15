import pick from 'lodash.pick';
import {console as globalConsole} from 'global/window';

import {VERSIONS} from './versions';
import Schema from './schema';
import {getSampleForTypeAnalyze} from 'utils/data-utils';
import {getFieldsFromData} from 'processor/data-processor';
import {ALL_FIELD_TYPES} from 'constants/default-settings';

// version v0
const fieldPropertiesV0 = {
  name: null,
  type: null
};

const fieldPropertiesV1 = {
  name: null,
  type: null,
  format: null
};

class FieldSchema extends Schema {
  key = 'fields';
  save(fields) {
    return {
      [this.key]: fields.map(f =>
        this.savePropertiesOrApplySchema(f)[this.key])
    };
  }
  load(fields) {
    return {[this.key]: fields};
  }
}

const propertiesV0 = {
  id: null,
  label: null,
  color: null,
  allData: null,
  fields: new FieldSchema({
    version: VERSIONS.v0,
    properties: fieldPropertiesV0
  })
};

const propertiesV1 = {
  ...propertiesV0,
  fields: new FieldSchema({
    version: VERSIONS.v1,
    properties: fieldPropertiesV1
  })
};

class DatasetSchema extends Schema {
  key = 'dataset';

  save(dataset) {
    return this.savePropertiesOrApplySchema(dataset)[this.key];
  }
  load(dataset) {
    const {fields, allData} = dataset;
    let updatedFields = fields;

    // recalculate field type
    // because we have updated type-analyzer
    // we need to add format to each field
    const needCalculateMeta = !fields[0].format;

    if (needCalculateMeta) {
      const fieldOrder = fields.map(f => f.name);

      const sampleData = getSampleForTypeAnalyze({fields, allData});
      const meta = getFieldsFromData(sampleData, fieldOrder);

      updatedFields = fields.map((f, i) => ({
        ...f,
        // note here we add format to timestamp field
        format: f.type === ALL_FIELD_TYPES.timestamp ? meta[i].format : ''
      }));

      updatedFields.forEach((f, i) => {
        if (meta[i].type !== f.type) {
          // if newly detected field type is different from saved type
          // we log it but won't update it, cause we don't want to break people's map
          globalConsole.warn(`detect ${f.name} type is now ${meta[i].type} instead of ${f.type}`);
        }
      });
    }

    // get format of all fields
    return {
      data: {fields: updatedFields, rows: dataset.allData},
      info: pick(dataset, ['id', 'label', 'color'])
    };
  }
}

const datasetSchema = {
  [VERSIONS.v0]: new DatasetSchema({
    version: VERSIONS.v0,
    properties: propertiesV0
  }),
  [VERSIONS.v1]: new DatasetSchema({
    version: VERSIONS.v1,
    properties: propertiesV1
  })
};

export default datasetSchema;
