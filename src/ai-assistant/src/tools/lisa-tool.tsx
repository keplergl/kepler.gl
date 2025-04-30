import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addDataToMap, addLayer} from '@kepler.gl/actions';
import {saveAsDataset} from './utils';
import {guessDefaultLayer} from './kepler-tools/layer-creation-tool';
import {State} from '../components/ai-assistant-manager';

export function LisaToolComponent({
  datasetName,
  significanceThreshold,
  clusters,
  lagValues,
  pValues,
  lisaValues,
  sigCategories,
  nn,
  labels,
  colors
}) {
  // Add validation check for input dataset
  if (datasetName.startsWith('lisa_')) {
    throw new Error('Cannot use a previous LISA dataset as input for a new LISA analysis. Please use the original dataset instead.');
  }

  const datasets = useSelector((state: State) => state.demo.keplerGl.map.visState.datasets);
  const layers = useSelector((state: State) => state.demo.keplerGl.map.visState.layers);
  const dispatch = useDispatch();
  const [newDatasetName, setNewDatasetName] = useState<string | null>(null);

  useEffect(() => {
    // Generate dataset name
    const tmpDatasetName = `lisa_${new Date().toISOString()}`;
    setNewDatasetName(tmpDatasetName);

    // save the Lisa result to current dataset
    const lisaData: Record<string, number[]> = {
      clusters,
      lagValues,
      pValues,
      lisaValues,
      sigCategories,
      nn,
      fillColor: clusters.map((cluster, index) =>
        pValues[index] < significanceThreshold ? colors[cluster] : colors[0]
      ),
      label: clusters.map((cluster, index) =>
        pValues[index] < significanceThreshold ? labels[cluster] : labels[0]
      )
    };
    // create a new geojson layer using clusters with ordinal color scale and customColorScale and colors
    const newDataset = saveAsDataset(datasets, layers, datasetName, tmpDatasetName, lisaData);
    if (newDataset) {
      // add the new dataset to the map
      dispatch(
        addDataToMap({datasets: [newDataset], options: {autoCreateLayers: false, centerMap: false}})
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!newDatasetName) return;

    // create a layer for the new dataset in the datasets
    const datasetId = Object.keys(datasets).find(
      dataId => datasets[dataId].label === newDatasetName
    );
    if (!datasetId) return;

    const newDataset = datasets[datasetId];
    if (newDataset) {
      // add a new layer for the new dataset
      const layer = guessDefaultLayer(newDataset, 'geojson');
      if (!layer) return;
      const colorField = {
        name: 'clusters',
        type: 'integer'
      };
      const colorDomain = Array.from({length: colors.length}, (_, i) => i);
      const colorLegends = {};
      for (let i = 0; i < colors.length; i++) {
        colorLegends[colors[i]] = labels[i];
      }
      const newLayer = {
        id: layer.id,
        type: layer.type,
        config: {
          ...layer.config,
          dataId: datasetId,
          columns: Object.keys(layer.config.columns).reduce((acc, key) => {
            acc[key] = layer.config.columns[key].value;
            return acc;
          }, {}),
          colorScale: 'customOrdinal',
          colorField,
          strokeColorField: null,
          visConfig: {
            ...layer.config.visConfig,
            colorRange: {
              ...layer.config.visConfig.colorRange,
              colorDomain,
              colors: colors,
              colorMap: colors.map((color, index) => [index, color]),
              colorLegends
            },
            stroked: false
          }
        }
      };
      dispatch(addLayer(newLayer, datasetId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasets, newDatasetName]);
  return null;
}
