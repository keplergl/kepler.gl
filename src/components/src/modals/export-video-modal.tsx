import React, {useMemo} from 'react';
import {WithIntlProps} from 'react-intl';

import {setExportVideoSetting} from '@kepler.gl/actions';
import {ExportVideo, MapState} from '@kepler.gl/types';
import {VisState} from '@kepler.gl/schemas';
import {MapStyle} from '@kepler.gl/reducers';

// Hook up mutual hubble imports
import {ExportVideoPanelContainer, injectKeplerUI} from '@hubble.gl/react';
import {StyledModalContent, Button, Input} from '../common/styled-components';
import * as Icons from '../common/icons';
import ItemSelector from '../common/item-selector/item-selector';
import Slider from '../common/slider/slider';
import LoadingSpinner from '../common/loading-spinner';
import ModalTabsFactory from './modal-tabs';

const KEPLER_UI = {
  Button,
  Icons,
  Input,
  ItemSelector,
  Slider,
  ModalTabsFactory,
  LoadingSpinner
};

export type ExportVideoModalProps = WithIntlProps<{
  visState: VisState;
  mapState: MapState;
  mapStyle: MapStyle;
  exportVideo: ExportVideo;
  onUpdateVideoSetting: typeof setExportVideoSetting;
  glContext?: any;
}>;

const ExportVideoModalFactory = () => {
  const ExportVideoModal: React.FC<ExportVideoModalProps> = ({
    exportVideo,
    onUpdateVideoSetting,
    visState,
    mapState,
    mapStyle,
    glContext
  }) => {
    const hubbleVisState = useMemo(() => {
      const layerOrder: number[] = [];
      visState.layerOrder.forEach(layerOrderId => {
        const id = visState.layers.findIndex(l => l.id === layerOrderId);
        layerOrder.push(id);
      });
      return {...visState, layerOrder};
    }, [visState]);

    return (
      <StyledModalContent className="export-video-modal">
        <ExportVideoPanelContainer
          initialState={exportVideo}
          mapData={{visState: hubbleVisState, mapState, mapStyle}}
          onSettingsChange={onUpdateVideoSetting}
          header={false}
          glContext={glContext}
        />
      </StyledModalContent>
    );
  };

  return injectKeplerUI(ExportVideoModal, KEPLER_UI);
};

export default ExportVideoModalFactory;
