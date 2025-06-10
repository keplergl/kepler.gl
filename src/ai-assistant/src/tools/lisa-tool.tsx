// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addDataToMap, addLayer} from '@kepler.gl/actions';
import {LisaAdditionalData} from '@openassistant/geoda';
import {saveAsDataset} from './utils';
import {guessDefaultLayer} from './kepler-tools/layer-creation-tool';
import {State} from '../components/ai-assistant-manager';

/**
 * Use LisaToolComponent adding a customized Lisa map layer to kepler.gl
 */
export function LisaToolComponent(props: LisaAdditionalData) {
  const datasets = useSelector((state: State) => state.demo.keplerGl.map.visState.datasets);
  const layers = useSelector((state: State) => state.demo.keplerGl.map.visState.layers);
  const dispatch = useDispatch();

  const {
    originalDatasetName,
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
  } = props;

  // save the result from lisa tool to a new lisa dataset
  useEffect(() => {
    if (
      !clusters ||
      !lagValues ||
      !pValues ||
      !lisaValues ||
      !sigCategories ||
      !nn ||
      !labels ||
      !colors
    ) {
      return;
    }

    const lisaData: Record<string, unknown[]> = {
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
    const newDataset = saveAsDataset(datasets, layers, originalDatasetName, datasetName, lisaData);
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
    const datasetId = Object.keys(datasets).find(dataId => datasets[dataId].label === datasetName);
    if (!datasetId || !colors || !labels) return;

    const newDataset = datasets[datasetId];
    if (newDataset) {
      const layerId = `${datasetName}_lisa`;
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
      const colorMap = colors.map((color, index) => [index, color]);
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
          strokeColorDomain: colorDomain,
          strokeColorField: colorField,
          strokeColorScale: 'customOrdinal',
          visConfig: {
            ...layer.config.visConfig,
            colorRange: {
              ...layer.config.visConfig.colorRange,
              colorDomain,
              colors,
              colorMap,
              colorLegends
            },
            strokeColorRange: {
              category: 'Custom',
              name: 'custom',
              colors,
              colorMap
            },
            strokeOpacity: 1,
            stroked: true,
            strokedWidth: 0.5
          }
        }
      };
      dispatch(addLayer(newLayer, datasetId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasets]);
  return null;
}
