import React from 'react';
import InteractionPanel from './interaction-panel/interaction-panel';

const InteractionManager = ({interactionConfig, datasets, onConfigChange}) => (
  <div className="interaction-manager">
    {Object.keys(interactionConfig).map(key => (
      <InteractionPanel
        datasets={datasets}
        config={interactionConfig[key]}
        key={key}
        onConfigChange={onConfigChange}
      />
    ))}
  </div>
);

export default InteractionManager;
