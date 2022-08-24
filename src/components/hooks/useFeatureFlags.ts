import {useContext} from 'react';
import {FeatureFlagsContext} from '../context';

const useFeatureFlags = () => useContext(FeatureFlagsContext);

export default useFeatureFlags;
