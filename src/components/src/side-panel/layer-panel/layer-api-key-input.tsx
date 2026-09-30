// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';

import {Input} from '../../common/styled-components';

/** Shown in place of a stored key so the value cannot be copied from the input. */
export const API_KEY_MASK = '*****';

const ApiKeyHint = styled.div`
  color: ${props => props.theme.subtextColor};
  font-size: 11px;
  line-height: 1.4;
  margin-top: 6px;
`;

const ApiKeyError = styled.div`
  background-color: ${props => props.theme.notificationColors.error || '#000'};
  color: #fff;
  font-size: 11px;
  line-height: 1.4;
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
`;

type LayerApiKeyInputProps = {
  accessToken?: string;
  loadError?: 'token' | 'generic' | null;
  onCommit: (nextToken: string) => void;
};

/**
 * Replaces a layer access token without ever putting the current token in the DOM.
 * An existing token is shown as {@link API_KEY_MASK}. Typing a new value and leaving
 * the field commits it.
 */
const LayerApiKeyInput: React.FC<LayerApiKeyInputProps> = ({accessToken, loadError, onCommit}) => {
  const intl = useIntl();
  const [draft, setDraft] = useState<string | null>(null);
  const isEditing = draft !== null;
  const hasKey = Boolean(accessToken);
  const value = isEditing ? draft : hasKey ? API_KEY_MASK : '';

  const commit = useCallback(() => {
    const next = (draft ?? '').trim();
    setDraft(null);
    if (!next || next === API_KEY_MASK || next === accessToken) {
      return;
    }
    onCommit(next);
  }, [accessToken, draft, onCommit]);

  const blockClipboard = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      if (!isEditing) {
        event.preventDefault();
      }
    },
    [isEditing]
  );

  return (
    <div>
      <Input
        type="text"
        value={value}
        placeholder={intl.formatMessage({id: 'layer.apiKeyPlaceholder'})}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        data-1p-ignore="true"
        data-lpignore="true"
        aria-label={intl.formatMessage({id: 'layer.apiKey'})}
        onFocus={() => setDraft('')}
        onChange={event => setDraft(event.target.value)}
        onBlur={commit}
        onCopy={blockClipboard}
        onCut={blockClipboard}
        onMouseDown={event => event.stopPropagation()}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.currentTarget.blur();
          }
        }}
      />
      <ApiKeyHint>
        <FormattedMessage id="layer.apiKeyHint" />
      </ApiKeyHint>
      {loadError ? (
        <ApiKeyError>
          <FormattedMessage
            id={loadError === 'token' ? 'layer.tile3dTokenErrorField' : 'layer.tile3dLoadError'}
          />
        </ApiKeyError>
      ) : null}
    </div>
  );
};

export default LayerApiKeyInput;
