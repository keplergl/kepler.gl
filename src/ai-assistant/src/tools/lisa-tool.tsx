// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addDataToMap, addLayer} from '@kepler.gl/actions';
import {saveAsDataset} from './utils';
import {guessDefaultLayer} from './kepler-tools/layer-creation-tool';
import {State} from '../components/ai-assistant-manager';

/**
 * Use LisaToolComponent adding Lisa result to kepler.gl
 */
export function LisaToolComponent({
  datasetName,
  lisaDatasetName,
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
  const datasets = useSelector((state: State) => state.demo.keplerGl.map.visState.datasets);
  const layers = useSelector((state: State) => state.demo.keplerGl.map.visState.layers);
  const dispatch = useDispatch();

  // save the result from lisa tool to a new lisa dataset
  useEffect(() => {
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
    const newDataset = saveAsDataset(datasets, layers, datasetName, lisaDatasetName, lisaData);
    if (newDataset) {
      // add the new dataset to the map
      dispatch(
        addDataToMap({datasets: [newDataset], options: {autoCreateLayers: false, centerMap: false}})
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // create a LISA layer for the new lisa dataset
  useEffect(() => {
    const datasetId = Object.keys(datasets).find(
      dataId => datasets[dataId].label === lisaDatasetName
    );
    if (!datasetId) return;

    const newDataset = datasets[datasetId];
    if (newDataset) {
      const layerId = `${lisaDatasetName}_lisa`;
      // check if the layer already exists?
      if (layers.find(l => l.id === layerId)) {
        return;
      }
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
        id: layerId,
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
  }, [datasets]);
  return null;
}
