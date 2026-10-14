// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, within} from '@testing-library/react';

import {EXPORT_HTML_MAP_DOC, EXPORT_HTML_MAP_MODES, EXPORT_MAP_FORMATS} from '@kepler.gl/constants';
import {messages} from '@kepler.gl/localization';
import {INITIAL_UI_STATE} from '@kepler.gl/reducers';
import {initApplicationConfig} from '@kepler.gl/utils';
import {IntlProvider} from 'react-intl';
import {renderWithTheme} from 'test/helpers/component-jest-utils';

import ExportHtmlMapFactory from './export-html-map';
import ExportJsonMapFactory from './export-json-map';
import ExportMapModalFactory from './export-map-modal';

const ExportMapModal = ExportMapModalFactory(ExportHtmlMapFactory(), ExportJsonMapFactory());

const defaultProps = {
  appName: 'Acme Maps',
  appWebsite: 'https://maps.acme.test',
  config: {},
  mapInfo: {
    title: 'City map',
    description: 'A city map'
  },
  options: INITIAL_UI_STATE.exportMap,
  onEditUserMapboxAccessToken: jest.fn(),
  onChangeExportMapHTMLMode: jest.fn(),
  onChangeExportMapBranding: jest.fn(),
  onChangeExportIncludeLayerApiKeys: jest.fn(),
  onChangeExportMapFormat: jest.fn(),
  onChangeExportMapFileName: jest.fn(),
  onMapInfoDraft: jest.fn()
};

function renderModal(props = {}) {
  return renderWithTheme(
    <IntlProvider locale="en" messages={messages.en}>
      <ExportMapModal {...defaultProps} {...props} />
    </IntlProvider>
  );
}

function expectCenteredRowLabel(control: HTMLElement) {
  const section = control.closest('.selection')?.parentElement;
  const description = section?.querySelector('.description') as HTMLElement;

  expect(getComputedStyle(description).alignSelf).toBe('center');
  expect(getComputedStyle(description).paddingTop).toBe('0px');
}

function getPortableExportMapRule() {
  return Array.from(document.styleSheets)
    .flatMap(styleSheet => Array.from(styleSheet.cssRules))
    .find(
      rule =>
        rule.cssText.includes('@media (max-width: 768px)') &&
        rule.cssText.includes('.export-map-modal__json-options .viewer')
    )?.cssText;
}

describe('ExportMapModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    initApplicationConfig({enableCustomExportBranding: false});
  });

  afterEach(() => {
    initApplicationConfig({enableCustomExportBranding: false});
  });

  test('keeps map details collapsed and puts the file extension note in a tooltip', () => {
    const {container, getByLabelText, getByRole, queryByLabelText, queryByRole} = renderModal();

    const detailsButton = getByRole('button', {name: 'Map details'});
    expect(detailsButton).toHaveAttribute('aria-expanded', 'false');
    expect(detailsButton).toHaveAttribute('aria-controls', 'export-map-details-content');
    expect(queryByLabelText('Name')).toBeNull();
    expect(queryByLabelText('Description')).toBeNull();
    expect(queryByRole('button', {name: 'Branding'})).toBeNull();

    const fileNameInput = getByLabelText('File name');
    expect(fileNameInput).toBeInTheDocument();
    expectCenteredRowLabel(fileNameInput);
    const fileNameHelp = getByRole('button', {
      name: 'The file type is added automatically.'
    });
    expect(fileNameHelp).toHaveAttribute('aria-describedby', 'export-map-file-name-extension-help');
    expect(document.getElementById('export-map-file-name-extension-help')).toHaveTextContent(
      'The file type is added automatically.'
    );
    expect(fileNameHelp.closest('.description')?.querySelector('.subtitle')).toBeNull();

    const formatHelp = getByRole('button', {name: 'About HTML and JSON formats'});
    expect(formatHelp).toHaveAttribute('aria-describedby', 'export-map-format-help');
    expect(formatHelp.parentElement).toHaveTextContent('Map format');
    expect(document.getElementById('export-map-format-help')).toHaveTextContent(
      'HTML: A standalone interactive map you can open in a browser.'
    );
    expect(document.getElementById('export-map-format-help')).toHaveTextContent(
      'JSON: Map data and configuration you can reopen in kepler.gl.'
    );
    const portableRule = getPortableExportMapRule();
    expect(portableRule).toContain("input[type='text']");
    expect(portableRule).toContain('select');
    expect(portableRule).toContain("[role='status']");
    expect(portableRule).toContain('.export-map-modal__json-options .viewer');
    expect(portableRule).toContain('.export-map-modal__collapsible-section');
    expect(portableRule).toContain('max-width: none');

    fireEvent.click(detailsButton);
    expect(detailsButton).toHaveAttribute('aria-expanded', 'true');
    expect(getByLabelText('Name')).toHaveValue('City map');
    expect(getByLabelText('Description')).toHaveValue('A city map');
    expect(getByRole('region', {name: 'Map details'})).toBeInTheDocument();
    expect(queryByLabelText('Application name')).toBeNull();
    expect(queryByLabelText('Website')).toBeNull();

    fireEvent.change(getByLabelText('Name'), {target: {value: 'Updated map'}});
    expect(defaultProps.onMapInfoDraft).toHaveBeenCalledWith({
      title: 'Updated map',
      description: 'A city map'
    });
    expect(container.querySelector('#export-map-details-content')).toBeInTheDocument();
  });

  test('uses a compact mode dropdown and exposes inherited branding when enabled', () => {
    initApplicationConfig({enableCustomExportBranding: true});
    const options = {
      ...INITIAL_UI_STATE.exportMap,
      appName: ''
    };
    const {container, getByLabelText, getByRole, queryByLabelText, queryByRole, queryByText} =
      renderModal({options});

    const formatGroup = getByRole('group', {name: 'Map format'});
    const htmlFormat = within(formatGroup).getByRole('button', {name: 'html'});
    const jsonFormat = within(formatGroup).getByRole('button', {name: 'json'});
    expect(htmlFormat).toHaveAttribute('aria-pressed', 'true');
    expect(jsonFormat).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(jsonFormat);
    expect(defaultProps.onChangeExportMapFormat).toHaveBeenCalledWith(EXPORT_MAP_FORMATS.JSON);

    const includeApiKeys = getByRole('checkbox', {name: 'Include layer API keys'});
    expect(includeApiKeys).not.toBeChecked();
    expectCenteredRowLabel(includeApiKeys);
    fireEvent.click(includeApiKeys);
    expect(defaultProps.onChangeExportIncludeLayerApiKeys).toHaveBeenCalledWith(true);
    const apiKeysHelp = getByRole('button', {name: 'About layer API keys'});
    expect(apiKeysHelp).toHaveAttribute(
      'aria-describedby',
      'export-include-layer-api-keys-html-help'
    );
    expect(document.getElementById('export-include-layer-api-keys-html-help')).toHaveTextContent(
      'When unchecked, access tokens stored on layers are removed from the exported file.'
    );
    expect(apiKeysHelp.closest('.description')?.querySelector('.subtitle')).toBeNull();
    const includeApiKeysLabel = includeApiKeys
      .closest('.kg-checkbox')
      ?.querySelector('label') as HTMLElement;
    expect(getComputedStyle(includeApiKeysLabel).marginBottom).toBe('0px');
    const apiKeysSection = apiKeysHelp.closest('.description')?.parentElement as HTMLElement;
    const formatPanels = apiKeysSection
      .closest('.export-map-modal')
      ?.querySelector('[aria-hidden="false"]')?.parentElement as HTMLElement;
    expect(getComputedStyle(formatPanels).marginTop).toBe('0px');
    expect(getComputedStyle(formatPanels).paddingTop).toBe('0px');
    expect(getComputedStyle(apiKeysSection).marginTop).toBe('0px');
    expect(getComputedStyle(apiKeysSection).marginBottom).toBe('16px');
    expect(getComputedStyle(apiKeysSection.nextElementSibling as Element).marginTop).toBe('16px');

    const tokenInput = getByLabelText('Mapbox access token');
    const tokenNotice = getByRole('status');
    expect(tokenInput).toHaveAttribute('aria-describedby', 'export-map-token-guidance');
    expect(getComputedStyle(tokenNotice).maxWidth).toBe(getComputedStyle(tokenInput).maxWidth);
    expect(getComputedStyle(tokenNotice).width).toBe(getComputedStyle(tokenInput).width);
    expect(tokenNotice).toHaveTextContent(
      'If this map uses Mapbox and you do not provide your own token, it may stop displaying when the shared token changes.'
    );
    expect(getByRole('link', {name: 'Learn how to update the token.'})).toHaveAttribute(
      'href',
      EXPORT_HTML_MAP_DOC
    );
    fireEvent.change(tokenInput, {target: {value: 'pk.test'}});
    expect(defaultProps.onEditUserMapboxAccessToken).toHaveBeenCalledWith('pk.test');

    const modeSelect = getByLabelText('Map mode') as HTMLSelectElement;
    expect(modeSelect.tagName).toBe('SELECT');
    expect(modeSelect.value).toBe(EXPORT_HTML_MAP_MODES.READ);
    expect(Array.from(modeSelect.options).map(option => option.text)).toEqual([
      'View only',
      'View and edit'
    ]);
    const modeHelp = getByRole('button', {name: 'About map modes'});
    expect(modeHelp).toHaveAttribute('aria-describedby', 'export-map-html-mode-help');
    expect(document.getElementById('export-map-html-mode-help')).toHaveTextContent(
      'View only: Hides editing controls; viewers can still explore the map.'
    );
    expect(document.getElementById('export-map-html-mode-help')).toHaveTextContent(
      'View and edit: Shows editing controls so viewers can change the map.'
    );
    expect(queryByRole('link', {name: 'Learn more'})).toBeNull();
    expect(container.querySelector('img')).toBeNull();

    fireEvent.change(modeSelect, {target: {value: EXPORT_HTML_MAP_MODES.EDIT}});
    expect(defaultProps.onChangeExportMapHTMLMode).toHaveBeenCalledWith(EXPORT_HTML_MAP_MODES.EDIT);

    const detailsButton = getByRole('button', {name: 'Map details'});
    const mapModeSection = modeSelect.closest('.selection')?.parentElement as HTMLElement;
    const detailsSection = detailsButton.parentElement as HTMLElement;
    expect(
      modeSelect.compareDocumentPosition(detailsButton) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(getComputedStyle(mapModeSection).marginBottom).toBe('0px');
    expect(getComputedStyle(detailsSection).marginTop).toBe('4px');
    expect(getComputedStyle(detailsSection).maxWidth).toBe('584px');
    expect(queryByText('Name, description and branding')).toBeNull();
    expect(queryByRole('button', {name: 'Branding'})).toBeNull();
    expect(detailsButton).toHaveAttribute('aria-expanded', 'false');
    expect(queryByLabelText('Application name')).toBeNull();
    expect(queryByLabelText('Website')).toBeNull();

    fireEvent.click(detailsButton);
    expect(detailsButton).toHaveAttribute('aria-expanded', 'true');
    expect(getByLabelText('Application name')).toHaveValue('Acme Maps');
    expect(getByLabelText('Website')).toHaveValue('https://maps.acme.test');
    ['Name', 'Description', 'Application name', 'Website'].forEach(label =>
      expectCenteredRowLabel(getByLabelText(label))
    );

    fireEvent.change(getByLabelText('Application name'), {target: {value: 'Atlas'}});
    expect(defaultProps.onChangeExportMapBranding).toHaveBeenCalledWith({appName: 'Atlas'});

    fireEvent.change(getByLabelText('Website'), {target: {value: 'https://atlas.test'}});
    expect(defaultProps.onChangeExportMapBranding).toHaveBeenCalledWith({
      appWebsite: 'https://atlas.test'
    });
  });

  test('shows the security notice when a custom Mapbox token is embedded', () => {
    const options = {
      ...INITIAL_UI_STATE.exportMap,
      HTML: {...INITIAL_UI_STATE.exportMap.HTML, userMapboxToken: 'pk.test'}
    };
    const {getByRole, queryByText} = renderModal({options});

    expect(getByRole('status')).toHaveTextContent(
      'Your Mapbox token will be visible to anyone with the exported HTML.'
    );
    expect(
      queryByText(
        'If this map uses Mapbox and you do not provide your own token, it may stop displaying when the shared token changes.'
      )
    ).toBeNull();
  });

  test('keeps the JSON panel compact and exposes shared export branding', () => {
    initApplicationConfig({enableCustomExportBranding: true});
    const options = {
      ...INITIAL_UI_STATE.exportMap,
      format: EXPORT_MAP_FORMATS.JSON,
      appName: 'Atlas JSON',
      appWebsite: 'https://json.atlas.test'
    };
    const {container, getByLabelText, getByRole, getByText, queryByText} = renderModal({options});
    const inactivePanel = container.querySelector('[inert]') as HTMLElement;

    expect(inactivePanel).not.toBeNull();
    expect(getComputedStyle(inactivePanel).display).toBe('none');
    expect(
      queryByText(
        'Export current map data and config into a single Json file. You can later open the same map by uploading this file to kepler.gl.'
      )
    ).toBeNull();
    expect(getByText('Map Config')).toBeInTheDocument();
    expect(getByRole('button', {name: 'About layer API keys'})).toHaveAttribute(
      'aria-describedby',
      'export-include-layer-api-keys-json-help'
    );
    const configWarning = container.querySelector('#export-map-json-config-warning') as HTMLElement;
    const configViewer = container.querySelector(
      '.export-map-modal__json-options .viewer'
    ) as HTMLElement;
    expect(configWarning).toHaveAttribute('role', 'status');
    expect(configWarning).toHaveTextContent('Map config is coupled with loaded datasets.');
    expect(configWarning.querySelector('svg')).not.toBeNull();
    expect(getComputedStyle(configWarning).borderLeftWidth).toBe('2px');
    expect(getComputedStyle(configWarning).fontSize).toBe('11px');
    expect(getComputedStyle(configViewer).maxWidth).toBe('380px');
    expect(getComputedStyle(configWarning).maxWidth).toBe(getComputedStyle(configViewer).maxWidth);
    expect(getComputedStyle(configWarning).width).toBe(getComputedStyle(configViewer).width);

    fireEvent.click(getByRole('button', {name: 'Map details'}));
    expect(getByLabelText('Application name')).toHaveValue('Atlas JSON');
    expect(getByLabelText('Website')).toHaveValue('https://json.atlas.test');

    fireEvent.change(getByLabelText('Application name'), {target: {value: 'Updated Atlas'}});
    expect(defaultProps.onChangeExportMapBranding).toHaveBeenCalledWith({
      appName: 'Updated Atlas'
    });

    fireEvent.change(getByLabelText('Website'), {target: {value: 'https://updated.atlas.test'}});
    expect(defaultProps.onChangeExportMapBranding).toHaveBeenCalledWith({
      appWebsite: 'https://updated.atlas.test'
    });
  });
});
