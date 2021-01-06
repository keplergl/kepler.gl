import React from 'react';
import {setUserMapboxAccessToken, setExportHTMLMapMode} from '../../actions';
import {IntlShape} from 'react-intl';

export type ExportHtmlMapProps = {
  onChangeExportMapHTMLMode: typeof setExportHTMLMapMode;
  onEditUserMapboxAccessToken: typeof setUserMapboxAccessToken;
  options: {
    userMapboxToken?: string;
    mode?: string;
  };
};

type IntlProps = {
  intl: IntlShape;
};

export const ExportHtmlMap: React.FunctionComponent<ExportHtmlMapProps & IntlProps>;
function ExportHtmlMapFactory(): React.FunctionComponent<ExportHtmlMapProps>;

export default ExportHtmlMapFactory;
