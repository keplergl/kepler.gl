import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {loadFiles} from '@kepler.gl/actions';
import {parseUri} from '@kepler.gl/common-utils';
import {loadRemoteRawData, loadRemoteResourceError} from '../actions';

export function useLoadRemoteMap() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const loadRemoteMap = useCallback(
    async (dataUrl: string) => {
      setIsLoading(true);

      try {
        // breakdown url into url+query params
        const result = await loadRemoteRawData(dataUrl);
        if (result) {
          const [file, url] = result;
          const {file: filename} = parseUri(url);
          dispatch(loadFiles([new File([file], filename)]));
        }
      } catch (error: any) {
        const {target = {}} = error;
        const {status, responseText} = target;
        dispatch(loadRemoteResourceError({status, message: responseText}, dataUrl));
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  return {loadRemoteMap, isLoading};
}
