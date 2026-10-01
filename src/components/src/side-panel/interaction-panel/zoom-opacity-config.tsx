// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {ComponentType, useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import {useIntl} from 'react-intl';

import {VisStateActions} from '@kepler.gl/actions';
import {generateHashId} from '@kepler.gl/common-utils';
import {FormattedMessage} from '@kepler.gl/localization';
import {Layer} from '@kepler.gl/layers';
import {DEFAULT_ZOOM_OPACITY_STOPS, setZoomOpacityStop} from '@kepler.gl/reducers';
import {InteractionConfig, ZoomOpacityController, ZoomOpacityStops} from '@kepler.gl/types';

import ZoomOpacitySlider from './zoom-opacity-slider';

import ItemSelector from '../../common/item-selector/item-selector';
import {Delete, Settings, ZoomIn} from '../../common/icons';
import PanelHeaderActionFactory, {PanelHeaderActionIcon} from '../panel-header-action';
import Switch from '../../common/switch';
import {
  Button,
  PanelContent,
  PanelHeaderContent,
  PanelHeaderTitle,
  PanelLabel,
  SidePanelSection,
  StyledPanelHeader
} from '../../common/styled-components';

const StyledZoomOpacityPanel = styled.div`
  padding-bottom: 6px;
  contain: layout paint;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-right: -10px;
  padding-right: ${props => (props.theme.panelHeaderHeight - props.theme.switchHeight) / 2}px;

  .kg-checkbox {
    margin-left: 0;
    margin-right: -${props => props.theme.switchLabelMargin}px;
  }
`;

const Hint = styled.div`
  color: ${props => props.theme.subtextColor};
  font-size: 11px;
  line-height: 1.4;
  margin-bottom: 12px;
`;

const ControllerCard = styled.div`
  border-top: 1px solid ${props => props.theme.panelBorderColor};
  margin-top: 8px;
  padding-top: 10px;

  &:last-child {
    margin-bottom: 12px;
  }
`;

const LayersRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  .side-panel-panel__label {
    margin-bottom: 0;
  }
`;

const RemoveButton = styled(Button)`
  padding: 0;
`;

const EMPTY_CONTROLLERS: ZoomOpacityController[] = [];

const DEFAULT_ZOOM_OPACITY_CONFIG: InteractionConfig['zoomOpacity'] = {
  id: 'zoomOpacity',
  label: 'interactions.fadeOnZoom',
  enabled: false,
  config: {controllers: EMPTY_CONTROLLERS}
};

type ZoomOpacityConfigProps = {
  layers: readonly Layer[];
  zoom?: number;
  zoomOpacityConfig?: InteractionConfig['zoomOpacity'];
  visStateActions: typeof VisStateActions;
  actionIcons?: {
    settings?: PanelHeaderActionIcon;
  };
};

const defaultActionIcons = {
  settings: Settings
};

ZoomOpacityConfigFactory.deps = [PanelHeaderActionFactory];

function ZoomOpacityConfigFactory(
  PanelHeaderAction: ReturnType<typeof PanelHeaderActionFactory>
): ComponentType<ZoomOpacityConfigProps> {
  const ZoomOpacityConfig: React.FC<ZoomOpacityConfigProps> = ({
    layers,
    zoom,
    zoomOpacityConfig,
    visStateActions,
    actionIcons: customActionIcons
  }) => {
    const actionIcons = {...defaultActionIcons, ...customActionIcons};
    const intl = useIntl();
    const [isConfigActive, setIsConfigActive] = useState(false);
    const zoomInteraction = zoomOpacityConfig ?? DEFAULT_ZOOM_OPACITY_CONFIG;
    const enabled = zoomInteraction.enabled !== false;
    const controllers = zoomInteraction.config?.controllers ?? EMPTY_CONTROLLERS;

    const togglePanelActive = useCallback(() => {
      setIsConfigActive(prev => !prev);
    }, []);

    const commit = useCallback(
      (next: Partial<InteractionConfig['zoomOpacity']>) => {
        visStateActions.interactionConfigChange({
          ...zoomInteraction,
          ...next,
          config: next.config || zoomInteraction.config
        });
      },
      [visStateActions, zoomInteraction]
    );

    const onToggleEnabled = useCallback(() => {
      commit({enabled: !enabled});
    }, [commit, enabled]);

    const updateControllers = useCallback(
      (nextControllers: ZoomOpacityController[]) => {
        commit({
          config: {
            ...zoomInteraction.config,
            controllers: nextControllers
          }
        });
      },
      [commit, zoomInteraction.config]
    );

    const onAddController = useCallback(() => {
      updateControllers([
        ...controllers,
        {
          id: generateHashId(6),
          layerIds: [],
          stops: {...DEFAULT_ZOOM_OPACITY_STOPS}
        }
      ]);
    }, [controllers, updateControllers]);

    const onDeleteController = useCallback(
      (controllerId: string) => {
        updateControllers(controllers.filter(controller => controller.id !== controllerId));
      },
      [controllers, updateControllers]
    );

    const onLayersChange = useCallback(
      (controllerId: string, selected: readonly Layer[] | null) => {
        const layerIds = (selected || []).map(layer => layer.id);
        updateControllers(
          controllers.map(controller =>
            controller.id === controllerId ? {...controller, layerIds} : controller
          )
        );
      },
      [controllers, updateControllers]
    );

    const onStopChange = useCallback(
      (controllerId: string, key: keyof ZoomOpacityStops, value: number) => {
        if (!Number.isFinite(value)) {
          return;
        }
        updateControllers(
          controllers.map(controller =>
            controller.id === controllerId
              ? {...controller, stops: setZoomOpacityStop(controller.stops, key, value)}
              : controller
          )
        );
      },
      [controllers, updateControllers]
    );

    const assignedElsewhere = useMemo(() => {
      const byController = new Map<string, Set<string>>();
      controllers.forEach(controller => {
        const ids = new Set<string>();
        controllers.forEach(other => {
          if (other.id !== controller.id) {
            other.layerIds.forEach(id => ids.add(id));
          }
        });
        byController.set(controller.id, ids);
      });
      return byController;
    }, [controllers]);

    return (
      <StyledZoomOpacityPanel className="interaction-panel interaction-zoom-opacity">
        <StyledPanelHeader
          className={classnames('interaction-zoom-opacity__header', {'is-open': isConfigActive})}
          onClick={togglePanelActive}
        >
          <PanelHeaderContent className="interaction-zoom-opacity__header__content">
            <div className="interaction-zoom-opacity__header__icon icon">
              <ZoomIn height="16px" />
            </div>
            <div className="interaction-zoom-opacity__header__title">
              <PanelHeaderTitle>
                <FormattedMessage id="interactions.fadeOnZoom" />
              </PanelHeaderTitle>
            </div>
          </PanelHeaderContent>
          <HeaderActions
            className="interaction-zoom-opacity__header__actions"
            onClick={event => event.stopPropagation()}
          >
            <PanelHeaderAction
              className={classnames('interaction-zoom-opacity__enable-config', {
                'is-open': isConfigActive
              })}
              id="zoom-opacity-config"
              tooltip="tooltip.interactionSettings"
              active={isConfigActive}
              flush
              onClick={togglePanelActive}
              IconComponent={actionIcons.settings}
            />
            <Switch
              checked={enabled}
              id="zoom-opacity-toggle"
              onChange={onToggleEnabled}
              secondary
            />
          </HeaderActions>
        </StyledPanelHeader>
        {isConfigActive ? (
          <PanelContent className="interaction-zoom-opacity__content">
            <Hint>
              <FormattedMessage id="interactions.fadeOnZoomHint" />
            </Hint>
            <Button
              type="button"
              secondary
              small
              className="interaction-zoom-opacity__add"
              onClick={onAddController}
            >
              <FormattedMessage id="interactions.fadeOnZoomAdd" />
            </Button>
            {controllers.map(controller => {
              const taken = assignedElsewhere.get(controller.id) || new Set<string>();
              const options = layers.filter(layer => !taken.has(layer.id));
              const selected = layers.filter(layer => controller.layerIds.includes(layer.id));
              return (
                <ControllerCard
                  key={controller.id}
                  className="interaction-zoom-opacity__controller"
                  data-testid={`zoom-opacity-controller-${controller.id}`}
                >
                  <SidePanelSection>
                    <LayersRow>
                      <PanelLabel>
                        <FormattedMessage id="interactions.fadeOnZoomLayers" />
                      </PanelLabel>
                      <RemoveButton
                        type="button"
                        link
                        small
                        className="interaction-zoom-opacity__delete"
                        title={intl.formatMessage({id: 'interactions.fadeOnZoomDelete'})}
                        onClick={() => onDeleteController(controller.id)}
                      >
                        <Delete height="12px" />
                      </RemoveButton>
                    </LayersRow>
                    <ItemSelector
                      options={options}
                      selectedItems={selected}
                      onChange={items =>
                        onLayersChange(controller.id, (items as Layer[] | null) || [])
                      }
                      searchable={true}
                      multiSelect={true}
                      getOptionValue={(layer: Layer) => layer.id}
                      displayOption={(layer: Layer) => layer.config?.label || layer.id}
                      placeholder="placeholder.selectLayer"
                      inputTheme="secondary"
                    />
                  </SidePanelSection>
                  <ZoomOpacitySlider
                    idPrefix={`zoom-opacity-${controller.id}`}
                    stops={controller.stops}
                    zoom={zoom}
                    onChange={(key, value) => onStopChange(controller.id, key, value)}
                  />
                </ControllerCard>
              );
            })}
          </PanelContent>
        ) : null}
      </StyledZoomOpacityPanel>
    );
  };

  return ZoomOpacityConfig;
}

export default ZoomOpacityConfigFactory;
