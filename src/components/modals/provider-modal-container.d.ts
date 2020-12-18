import React from 'react';
import {SetCloudProviderPayload} from '../../actions';
import {Provider} from '../../cloud-providers';

export type ProviderModalContainerProps = {
  cloudProviders?: Provider[];
  currentProvider?: string;
  onSetCloudProvider: (provider: SetCloudProviderPayload) => void;
};

export const ProviderModalContainer: React.FunctionComponent<ProviderModalContainerProps>;
export default ProviderModalContainer;
