import React from 'react';
import {setExportImageSetting, cleanupExportImage} from '../../actions';
import {ExportImage} from '../../reducers';
import {WithIntlProps} from 'react-intl';

export type ExportImageModalProps = WithIntlProps<{
  exportImage: ExportImage;
  mapW: number;
  mapH: number;
  onUpdateImageSetting: typeof setExportImageSetting;
  cleanupExportImage: typeof cleanupExportImage;
}>;

export const ExportImageModal: React.FunctionComponent<ExportImageModalProps>;
function ExportImageModalFactory(): React.FunctionComponent<ExportImageModalProps>;

export default ExportImageModalFactory;
