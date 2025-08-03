import {useCallback, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {toggleModal} from '@kepler.gl/actions';
import {loadRemoteData, loadRemoteConfig} from '../actions';
import {loadRemoteResourceSuccess} from '../actions';
import {MAP_CONFIG_URL} from '../constants/default-settings';

export interface SampleMap {
  id: string;
  label: string;
  size: number;
  imageUrl?: string;
  description: string;
  visible?: boolean;
  configUrl?: string;
  dataUrl?: string;
  remoteDatasetConfigUrl?: string;
  keplergl?: string;
}

interface UseLoadSampleMapResult {
  sampleMaps: SampleMap[];
  isMapLoading: boolean;
  error: Error | null;
  loadSampleMap: (options: SampleMap) => Promise<void>;
  loadSampleConfigurations: (sampleMapId?: string | null) => Promise<void>;
}

export const useLoadSampleMap = (): UseLoadSampleMapResult => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sampleMaps, setSampleMaps] = useState<SampleMap[]>([]);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadRemoteSampleMap = useCallback(
    async (options: SampleMap) => {
      const [config, data, remoteDatasetConfig] = await Promise.all([
        loadRemoteConfig(options.configUrl),
        loadRemoteData(options.dataUrl),
        loadRemoteConfig(options.remoteDatasetConfigUrl)
      ]);
      dispatch(loadRemoteResourceSuccess(data, config, options, remoteDatasetConfig));
      dispatch(toggleModal(null));
    },
    [dispatch]
  );

  const loadSampleMap = useCallback(
    async (options: SampleMap) => {
      if (options.id) {
        navigate(`/demo/${options.id}${location.search}`);
      } else {
        loadRemoteSampleMap(options);
      }

      setIsMapLoading(true);
    },
    [navigate, location.search, setIsMapLoading, loadRemoteSampleMap]
  );

  const loadSampleConfigurations = useCallback(
    async (sampleMapId: string | null = null) => {
      try {
        const response = await fetch(MAP_CONFIG_URL);
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const samples = await response.json();
        setSampleMaps(samples);
        // Load the specified map
        if (sampleMapId) {
          const map = samples.find(s => s.id === sampleMapId);
          if (map) {
            loadRemoteSampleMap(map);
          }
        }
      } catch (error) {
        setError(error instanceof Error ? error : new Error('An unknown error occurred'));
      }
    },
    [loadRemoteSampleMap, setSampleMaps, setError]
  );

  return {
    sampleMaps,
    isMapLoading,
    error,
    loadSampleMap,
    loadSampleConfigurations
  };
};
