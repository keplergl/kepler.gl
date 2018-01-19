import React from 'react';

// Much generic component to ask for confirmation
const DeleteDataModal = ({
  title,
  subtitle,
  message,
  deleteAction,
  cancelAction
}) => {
  return (
    <div className="dataset-modal">
      <h2>{title}</h2>
      <h4>{subtitle}</h4>
      <p>{message}</p>
      <button
        className="btn btn--link float--right"
        style={{backgroundColor: 'red', color: 'white'}}
        onClick={deleteAction}
      >
        Delete
      </button>
      <button
        className="btn btn--link float--right"
        style={{marginRight: '12px'}}
        onClick={cancelAction}
      >
        Cancel
      </button>
    </div>
  );
};

export const DeleteDatasetModal = ({
  dataset = {},
  layers = [],
  deleteAction,
  cancelAction
}) => {
  const {label} = dataset;
  // retrieve dataset color
  const subtitle = (
    <ul style={{listStyleTypes: 'square'}}>
      <li style={{color: `rgb(${dataset.color.join(',')})`}}>
        <span className="dataset-label" style={{color: 'black'}}>
          {label}
        </span>
      </li>
    </ul>
  );

  // retrieve only layers related to the current dataset
  const currDatasetLayers = layers.filter(
    layer => layer.config.dataId === dataset.id
  );

  return (
    <DeleteDataModal
      cancelAction={cancelAction}
      deleteAction={deleteAction}
      message={`you are going to delete this dataset. It will affect ${
        currDatasetLayers.length
      } layers`}
      subtitle={subtitle}
      title="Delete Dataset"
    />
  );
};
export default DeleteDataModal;
