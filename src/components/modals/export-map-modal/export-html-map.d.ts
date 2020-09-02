import React from 'react';
import {setUserMapboxAccessToken, setExportHTMLMapMode} from '../../actions';
import {WithIntlProps} from 'react-intl';

export type ExportHtmlMapProps = WithIntlProps<{
  onChangeExportMapHTMLMode: typeof setExportHTMLMapMode;
  onEditUserMapboxAccessToken: typeof setUserMapboxAccessToken;
  options: {
    userMapboxToken?: string;
    mode?: string;
  };
  intl: any;
}>;

export const ExportHtmlMap: React.FunctionComponent<ExportHtmlMapProps>;
function ExportHtmlMapFactory(): React.FunctionComponent<ExportHtmlMapProps>;

export default ExportHtmlMapFactory;
