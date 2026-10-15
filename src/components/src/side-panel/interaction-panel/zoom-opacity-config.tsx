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
import {
  DEFAULT_ZOOM_OPACITY_STOPS,
  getZoomOpacityAnnotationTargetId,
  setZoomOpacityStop
} from '@kepler.gl/reducers';
import {
  Annotation,
  InteractionConfig,
  ZoomOpacityController,
  ZoomOpacityStops
} from '@kepler.gl/types';

import ZoomOpacitySlider from './zoom-opacity-slider';

import ItemSelector from '../../common/item-selector/item-selector';
import {ChickletButton, ChickletTag} from '../../common/item-selector/chickleted-input';
import {ListItemProps} from '../../common/item-selector/dropdown-list';
import {AnnotationText, Delete, Settings, ZoomIn} from '../../common/icons';
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

type ZoomOpacityTarget = Layer | {id: string; label: string; annotationId: string};

const TargetLabel = styled.span`
  align-items: center;
  display: flex;
  min-width: 0;
  width: 100%;
`;

const AnnotationIcon = styled(AnnotationText)`
  flex: 0 0 auto;
  margin-right: 6px;
`;

const TargetName = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TargetListItemAnchor = styled.span`
  align-items: center;
  display: flex;
  min-width: 0;
  white-space: nowrap;
`;

const TargetChickletTag = styled(ChickletTag)`
  display: flex;
  min-width: 0;
  white-space: nowrap;

  &:hover {
    overflow: hidden;
  }
`;

const getTargetLabel = (target: ZoomOpacityTarget): string =>
  'label' in target ? target.label : target.config?.label || target.id;

const ZoomOpacityTargetLabel = ({target}: {target: ZoomOpacityTarget}) => (
  <TargetLabel title={getTargetLabel(target)}>
    {'annotationId' in target ? (
      <AnnotationIcon
        className="zoom-opacity-target__annotation-icon"
        height="14px"
        aria-hidden="true"
      />
    ) : null}
    <TargetName className="zoom-opacity-target__name">{getTargetLabel(target)}</TargetName>
  </TargetLabel>
);

const ZoomOpacityTargetListItem = ({value, disabled}: ListItemProps<ZoomOpacityTarget>) => (
  <TargetListItemAnchor className={classnames('list__item__anchor', {disabled})}>
    <ZoomOpacityTargetLabel target={value} />
  </TargetListItemAnchor>
);

type ZoomOpacityTargetChickletProps = {
  item: ZoomOpacityTarget;
  remove?: React.MouseEventHandler<SVGSVGElement>;
  inputTheme?: string;
  disabled?: boolean;
};

const ZoomOpacityTargetChicklet = ({
  item,
  remove,
  inputTheme,
  disabled
}: ZoomOpacityTargetChickletProps) => (
  <ChickletButton $inputTheme={inputTheme}>
    <TargetChickletTag>
      <ZoomOpacityTargetLabel target={item} />
    </TargetChickletTag>
    <Delete height="16px" onClick={disabled ? undefined : remove} />
  </ChickletButton>
);

const DEFAULT_ZOOM_OPACITY_CONFIG: InteractionConfig['zoomOpacity'] = {
  id: 'zoomOpacity',
  label: 'interactions.fadeOnZoom',
  enabled: false,
  config: {controllers: EMPTY_CONTROLLERS}
};

type ZoomOpacityConfigProps = {
  layers: readonly Layer[];
  annotations: readonly Annotation[];
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
    annotations,
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

    const onTargetsChange = useCallback(
      (controllerId: string, selected: readonly ZoomOpacityTarget[] | null) => {
        const layerIds = (selected || []).map(target => target.id);
        updateControllers(
          controllers.map(controller =>
            controller.id === controllerId ? {...controller, layerIds} : controller
          )
        );
      },
      [controllers, updateControllers]
    );

    const annotationTargets = useMemo<ZoomOpacityTarget[]>(
      () =>
        annotations.map((annotation, index) => {
          const label = annotation.label?.trim() || `${index + 1}`;
          return {
            id: getZoomOpacityAnnotationTargetId(annotation.id),
            annotationId: annotation.id,
            label
          };
        }),
      [annotations]
    );
    const targets = useMemo<ZoomOpacityTarget[]>(
      () => [...layers, ...annotationTargets],
      [annotationTargets, layers]
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
              const options = targets.filter(target => !taken.has(target.id));
              const selected = targets.filter(target => controller.layerIds.includes(target.id));
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
                        onTargetsChange(controller.id, (items as ZoomOpacityTarget[] | null) || [])
                      }
                      searchable={true}
                      multiSelect={true}
                      getOptionValue={(target: ZoomOpacityTarget) => target.id}
                      displayOption={getTargetLabel}
                      DropDownLineItemRenderComponent={ZoomOpacityTargetListItem}
                      CustomChickletComponent={ZoomOpacityTargetChicklet}
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
