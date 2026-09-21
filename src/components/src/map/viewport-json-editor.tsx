// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback} from 'react';
import classnames from 'classnames';
import {applyMapState} from '@kepler.gl/actions';
import {MapControls, MapState} from '@kepler.gl/types';
import {mapStateLens} from '@kepler.gl/reducers';

import {CodeAlt} from '../common/icons';
import {MapControlButton} from '../common/styled-components';
import {withState} from '../injector';
import JsonEditor from '../common/json-editor';
import {
  applyStatus,
  isJsonEditorEnabled,
  errorStatus,
  jsonToMapState,
  JsonEditorStatus,
  mapStateToJson,
  useDebounce
} from '../common/json-editor-utils';
import MapControlPanelFactory from './map-control-panel';
import MapControlTooltipFactory from './map-control-tooltip';

export type ViewportJsonEditorControlProps = {
  mapControls: MapControls;
  onToggleMapControl: (control: string) => void;
  mapState?: MapState;
  applyMapState?: typeof applyMapState;
  className?: string;
};

ViewportJsonEditorControlFactory.deps = [MapControlTooltipFactory, MapControlPanelFactory];

function ViewportJsonEditorControlFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>,
  MapControlPanel: ReturnType<typeof MapControlPanelFactory>
) {
  const ViewportJsonEditor: React.FC<{
    mapState?: MapState;
    applyMapState?: typeof applyMapState;
    onClose?: (event?: React.MouseEvent) => void;
  }> = ({mapState, applyMapState: applyMapStateAction, onClose}) => {
    const jsonText = mapState ? mapStateToJson(mapState) : '{}';
    const debouncedJsonText = useDebounce(jsonText, 300);

    const handleApply = useCallback(
      (text: string): JsonEditorStatus => {
        try {
          if (!applyMapStateAction) {
            return applyStatus(false);
          }
          applyMapStateAction(jsonToMapState(text));
          return applyStatus(true);
        } catch (error) {
          return errorStatus(error);
        }
      },
      [applyMapStateAction]
    );

    return (
      <JsonEditor
        jsonText={debouncedJsonText}
        onApply={handleApply}
        onClose={onClose}
        height={280}
      />
    );
  };

  const ConnectedViewportJsonEditor = withState([mapStateLens], () => ({}), {applyMapState})(
    ViewportJsonEditor
  );

  const ViewportJsonEditorControl: React.FC<ViewportJsonEditorControlProps> = ({
    mapControls,
    onToggleMapControl,
    className
  }) => {
    const onClick = useCallback(
      event => {
        event.preventDefault();
        onToggleMapControl('viewportJson');
      },
      [onToggleMapControl]
    );

    const showControl = isJsonEditorEnabled('viewport') && mapControls?.viewportJson?.show;
    if (!showControl) {
      return null;
    }

    const isActive = Boolean(mapControls.viewportJson?.active);

    return (
      <div
        className={classnames('viewport-json-editor-controls', className)}
        style={{position: 'relative'}}
      >
        {isActive ? (
          <MapControlPanel
            header="tooltip.editViewportJson"
            onClick={onClick}
            pinnable={false}
            disableClose={false}
          >
            <ConnectedViewportJsonEditor onClose={onClick} />
          </MapControlPanel>
        ) : null}
        <MapControlTooltip id="show-viewport-json-editor" message="tooltip.editViewportJson">
          <MapControlButton
            className={classnames('map-control-button', 'viewport-json', {isActive})}
            onClick={onClick}
            active={isActive}
          >
            <CodeAlt height="16px" />
          </MapControlButton>
        </MapControlTooltip>
      </div>
    );
  };

  ViewportJsonEditorControl.displayName = 'ViewportJsonEditorControl';
  return ViewportJsonEditorControl;
}

export default ViewportJsonEditorControlFactory;
