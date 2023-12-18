import React from 'react';
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

const KEPLER_UI = {
  Button,
  Icons,
  Input,
  ItemSelector,
  Slider
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
    return (
      <StyledModalContent className="export-video-modal">
        <ExportVideoPanelContainer
          initialState={exportVideo}
          mapData={{visState, mapState, mapStyle}}
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
