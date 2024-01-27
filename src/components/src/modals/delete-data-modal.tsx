// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import styled from 'styled-components';
import DatasetLabel from '../common/dataset-label';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer} from '@kepler.gl/layers';
import {KeplerTable} from '@kepler.gl/table';

const StyledMsg = styled.div`
  margin-top: 24px;
`;

export interface DeleteDatasetModalProps {
  dataset: KeplerTable;
  layers: Layer[];
}

export const DeleteDatasetModal: React.FC<DeleteDatasetModalProps> = ({dataset, layers = []}) => {
  // retrieve only layers related to the current dataset
  const currDatasetLayers = layers.filter(layer => layer.config.dataId === (dataset && dataset.id));

  return (
    <div className="delete-dataset-modal">
      <DatasetLabel dataset={dataset} />
      <StyledMsg className="delete-dataset-msg">
        <FormattedMessage
          id={'modal.deleteData.warning'}
          values={{length: currDatasetLayers.length}}
        />
      </StyledMsg>
    </div>
  );
};

const DeleteDatasetModalFactory = () => DeleteDatasetModal;
export default DeleteDatasetModalFactory;
