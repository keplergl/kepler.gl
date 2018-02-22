import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {css} from 'styled-components';
import {findDOMNode} from 'react-dom';

import ModalDialog from './common/modal';

// modal
import DeleteDatasetModalFactory from './modals/delete-data-modal';
import IconInfoModalFactory from './modals/icon-info-modal';
import DataTableModalFactory from './modals/data-table-modal';
import LoadDataModalFactory from './modals/load-data-modal';

import {
  DATA_TABLE_ID,
  DELETE_DATA_ID,
  ADD_DATA_ID
} from 'constants/default-settings';

const propTypes = {
  rootNode: PropTypes.object,
  containerW: PropTypes.number,
  containerH: PropTypes.number,
  uiState: PropTypes.object.isRequired,
  visState: PropTypes.object.isRequired,
  visStateActions: PropTypes.object.isRequired,
  uiStateActions: PropTypes.object.isRequired
};

const DataTableModalStyle = css`
  height: 85%;
  width: 90%;
  top: 80px;
  padding: 32px 0 0 0;
`;

const DeleteDatasetModalStyled = css`
  width: 40%;
  padding: 40px 40px 32px 40px;
`;

const LoadDataModalStyle = css`
  top: 60px;
`;

ModalContainerFactory.deps = [
  DeleteDatasetModalFactory,
  IconInfoModalFactory,
  DataTableModalFactory,
  LoadDataModalFactory
];

export default function ModalContainerFactory(
  DeleteDatasetModal,
  IconInfoModal,
  DataTableModal,
  LoadDataModal
) {
  class ModalWrapper extends Component {
    _closeModal = () => {
      this.props.uiStateActions.toggleModal(null);
    };

    _deleteDataset = key => {
      this.props.visStateActions.removeDataset(key);
      this._closeModal();
    };

    _onFileUpload = blob => {
      this.props.visStateActions.loadFiles(blob);
    };

    render() {
      const {
        containerW,
        containerH,
        uiState,
        visState,
        rootNode,
        visStateActions
      } = this.props;
      const {currentModal, datasetKeyToRemove} = uiState;
      const {datasets, layers, editingDataset} = visState;

      let template = null;
      let modalProps = {};

      switch (currentModal) {
        case 'iconInfo':
          template = <IconInfoModal />;
          modalProps.title = 'How to draw icons';
          break;

        case DATA_TABLE_ID:
          template = (
            <DataTableModal
              width={containerW * 0.9}
              height={containerH * 0.85}
              datasets={datasets}
              dataId={editingDataset}
              showDatasetTable={visStateActions.showDatasetTable}
            />
          );
          modalProps.cssStyle = DataTableModalStyle;
          break;
        case DELETE_DATA_ID:
          // validate options
          if (datasetKeyToRemove && datasets && datasets[datasetKeyToRemove]) {
            template = (
              <DeleteDatasetModal
                dataset={datasets[datasetKeyToRemove]}
                layers={layers}
              />
            );

            modalProps = {
              title: 'Delete Dataset',
              cssStyle: DeleteDatasetModalStyled,
              footer: true,
              onConfirm: () => this._deleteDataset(datasetKeyToRemove),
              onCancel: this._closeModal,
              confirmButton: {
                negative: true,
                large: true,
                children: 'Delete'
              }
            };
          }
          break; // in case we add a new case after this one
        case ADD_DATA_ID:
          template = (
            <LoadDataModal
              onClose={this._closeModal}
              onFileUpload={this._onFileUpload}
            />
          );
          modalProps = {
            title: 'Add Data To Map',
            cssStyle: LoadDataModalStyle,
            footer: false,
            onConfirm: this._closeModal
          };
          break;
        default:
          break;
      }

      return this.props.rootNode ? (
        <ModalDialog
          {...modalProps}
          parentSelector={() => findDOMNode(rootNode)}
          isOpen={Boolean(currentModal)}
          close={this._closeModal}
        >
          {template}
        </ModalDialog>
      ) : null;
    }
  }

  ModalWrapper.propTypes = propTypes;

  return ModalWrapper;
}
