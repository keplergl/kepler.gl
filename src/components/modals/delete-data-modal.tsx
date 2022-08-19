// Copyright (c) 2022 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from 'react';
import styled from 'styled-components';
import DatasetLabel from 'components/common/dataset-label';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer, KeplerTable} from '@kepler.gl/layers';

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
