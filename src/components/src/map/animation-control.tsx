// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useContext, useEffect, useId, useState} from 'react';
import {createPortal} from 'react-dom';
import styled, {useTheme} from 'styled-components';
import type {
  Annotation,
  CameraTour,
  Effect,
  InteractionConfig,
  MapControls,
  MapLegendControlSettings,
  MapState
} from '@kepler.gl/types';
import type {Layer} from '@kepler.gl/layers';
import {UIStateActions, VisStateActions} from '@kepler.gl/actions';
import {getApplicationConfig} from '@kepler.gl/utils';
import {MapControlButton} from '../common/styled-components';
import {Clock} from '../common/icons';
import {RootContext} from '../context';
import AnimationEditorFactory from '../animation/animation-editor';
import {EffectAnimationPreviewContext} from '../effects/effect-animation-preview';
import MapControlPanelFactory from './map-control-panel';
import MapControlTooltipFactory from './map-control-tooltip';
import {DraggableLegend} from './map-legend-panel';

const Panel = styled.section<{$width: number}>`
  width: ${props => props.$width}px;
  max-width: calc(100vw - 32px);
  .map-control-panel {
    width: 100%;
  }
  .map-control__panel-header {
    height: 28px;
    padding: 4px 8px;
  }
  .map-control__panel-drag-title {
    height: 28px;
    margin: -4px 0 -4px -8px;
    padding: 4px 8px;
  }
  .map-control__panel-content {
    display: flex;
    flex-direction: column;
    min-height: 160px;
    overflow: hidden;
  }
`;

export type AnimationControlProps = {
  effects?: Effect[];
  cameraTour?: CameraTour | null;
  interactionConfig?: InteractionConfig;
  layers?: readonly Layer[];
  annotations?: readonly Annotation[];
  mapControls?: MapControls;
  mapState?: MapState;
  activeSidePanel?: string | null;
  visStateActions?: typeof VisStateActions;
  onEditCamera?: (stopId?: string) => void;
  onToggleMapControl?: (control: string) => void;
  primary?: boolean;
  isSplit?: boolean;
  readOnly?: boolean;
  isExport?: boolean;
  className?: string;
};

MapAnimationControlFactory.deps = [
  MapControlTooltipFactory,
  MapControlPanelFactory,
  AnimationEditorFactory
];

export default function MapAnimationControlFactory(
  MapControlTooltip: ReturnType<typeof MapControlTooltipFactory>,
  MapControlPanel: ReturnType<typeof MapControlPanelFactory>,
  AnimationEditor: ReturnType<typeof AnimationEditorFactory>
) {
  const AnimationControl = ({
    effects = [],
    cameraTour,
    interactionConfig,
    layers = [],
    annotations = [],
    mapControls,
    mapState,
    activeSidePanel,
    visStateActions,
    onEditCamera,
    onToggleMapControl,
    primary = true,
    isSplit = false,
    readOnly = false,
    isExport = false,
    className
  }: AnimationControlProps) => {
    const root = useContext(RootContext);
    const theme = useTheme();
    const playback = useContext(EffectAnimationPreviewContext);
    const [open, setOpen] = useState(false);
    const [settings, setSettings] = useState<MapLegendControlSettings>();
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
    const id = useId();

    useEffect(() => {
      setPortalContainer(root?.current ?? document.body);
    }, [root]);

    const setPanelSettings = useCallback<typeof UIStateActions.setMapControlSettings>(
      (controlId, next) => {
        setSettings(previous => ({...previous!, ...next}));
        // DraggableLegend accepts the existing action-handler contract; these settings stay local.
        return UIStateActions.setMapControlSettings(controlId, next);
      },
      []
    );

    const toggle = () => {
      if (!open && !settings) {
        const container = root?.current;
        const height = container?.clientHeight || mapState?.height || window.innerHeight;
        const timelineHeight =
          container?.querySelector<HTMLElement>('.bottom-widget--container')?.offsetHeight || 0;
        const bottom = Math.min(height / 2, Math.max(30, timelineHeight + 16));
        setSettings({
          position: {x: 16, y: bottom, anchorX: 'right', anchorY: 'bottom'},
          contentHeight: Math.min(240, Math.max(160, height - bottom - 44))
        });
      }
      setOpen(previous => !previous);
    };

    if (
      !getApplicationConfig().enableAnimationEditor ||
      !playback ||
      !mapState ||
      !visStateActions ||
      readOnly ||
      isExport ||
      (isSplit && !primary)
    ) {
      return null;
    }

    const width = Math.max(
      1,
      Math.min(
        900,
        (root?.current?.clientWidth || mapState.width || window.innerWidth) -
          (activeSidePanel ? theme.sidePanel?.width || 0 : 0) -
          32
      )
    );
    const panel = open ? (
      <DraggableLegend
        controlId="animation"
        label="Animation"
        isSidePanelShown={Boolean(activeSidePanel)}
        mapControls={{animation: {show: true, active: true, settings}}}
        setMapControlSettings={setPanelSettings}
        mapState={mapState}
      >
        <Panel id={id} $width={width} aria-label="Animation panel">
          <MapControlPanel
            header="Animation"
            className="animation-control-panel"
            onClick={event => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <AnimationEditor
              effects={effects}
              tour={cameraTour}
              cameraEnabled={Boolean(mapControls?.cameraTour?.show)}
              layers={layers}
              mapState={mapState}
              interactionConfig={interactionConfig}
              annotations={annotations}
              playback={playback}
              updateEffectConfig={(_event, effectId, next) =>
                visStateActions.updateEffect(effectId, next)
              }
              onLayerConfigChange={visStateActions.layerConfigChange}
              onAnnotationChange={visStateActions.updateAnnotation}
              onCameraTourChange={visStateActions.setCameraTour}
              onEditCamera={onEditCamera}
              onEditEffect={
                onToggleMapControl
                  ? effectId => {
                      if (!mapControls?.effect?.active) onToggleMapControl('effect');
                      visStateActions.updateEffect(effectId, {
                        isConfigActive: true,
                        isJsonEditorActive: false
                      });
                    }
                  : undefined
              }
              onEditAnnotation={
                onToggleMapControl
                  ? annotationId => {
                      if (!mapControls?.annotation?.active) onToggleMapControl('annotation');
                      visStateActions.setSelectedAnnotation(annotationId, false);
                    }
                  : undefined
              }
            />
          </MapControlPanel>
        </Panel>
      </DraggableLegend>
    ) : null;

    return (
      <div className={`animation-controls ${className || ''}`}>
        <MapControlTooltip id={`show-animation-${id}`} message="Animation">
          <MapControlButton
            type="button"
            className="map-control-button animation"
            aria-label="Animation"
            aria-expanded={open}
            aria-controls={id}
            active={open}
            onClick={toggle}
          >
            <Clock height="16px" />
          </MapControlButton>
        </MapControlTooltip>
        {panel && createPortal(panel, portalContainer ?? root?.current ?? document.body)}
      </div>
    );
  };

  AnimationControl.displayName = 'AnimationControl';
  return AnimationControl;
}
