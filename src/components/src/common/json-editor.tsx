// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIntl} from 'react-intl';
import {FormattedMessage} from '@kepler.gl/localization';
import styled from 'styled-components';

import {Button} from './styled-components';
import {Checkmark, Close, Copy, Warning} from './icons';
import {formatJsonText, JsonEditorStatus} from './json-editor-utils';

export type JsonEditorProps = {
  jsonText: string;
  onApply?: (value: string) => JsonEditorStatus | null;
  onReset?: () => void;
  onClose?: (event?: React.MouseEvent) => void;
  isReadOnly?: boolean;
  height?: number;
  className?: string;
};

const StyledEditorPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  width: 100%;
`;

const StyledEditorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  .spacer {
    flex-grow: 1;
  }
  .json-editor-icon-button {
    display: flex;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    color: ${props => props.theme.subtextColor};
    &:hover {
      color: ${props => props.theme.textColorHl};
    }
  }
`;

const StyledEditorBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  flex-grow: 1;
  min-height: 180px;
  resize: vertical;
  box-sizing: border-box;
  font-family: ${props => props.theme.fontFamily};
  font-size: 11px;
  line-height: 1.4;
  padding: 8px;
  color: ${props => props.theme.inputColor};
  background-color: ${props => props.theme.inputBgd};
  border: 1px solid ${props => props.theme.inputBgdHover || props.theme.panelBackgroundHover};
  border-radius: 2px;
  overflow-y: auto;
  outline: none;
  &:focus {
    border-color: ${props => props.theme.activeColor};
  }
`;

const StyledEditorStatus = styled.div<{status?: string}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.panelBackground};
  padding: 6px 8px;
  color: ${props =>
    props.status === 'success'
      ? props.theme.notificationColors?.success || '#47B275'
      : props.theme.errorColor};
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  z-index: 1;
`;

function JsonEditor({
  jsonText,
  onApply,
  onReset,
  onClose,
  isReadOnly = false,
  height = 240,
  className
}: JsonEditorProps) {
  const intl = useIntl();
  const [internalText, setInternalText] = useState(jsonText);
  const [status, setStatus] = useState<JsonEditorStatus | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isDirtyRef = useRef(false);

  const touched = internalText !== jsonText;
  const canApply = Boolean(touched && !parseError && !isReadOnly && onApply);

  useEffect(() => {
    if (isDirtyRef.current) {
      return;
    }
    setInternalText(jsonText);
    setParseError(null);
  }, [jsonText]);

  useEffect(() => {
    if (!status) {
      return undefined;
    }
    const timeout = setTimeout(() => setStatus(null), 5000);
    return () => clearTimeout(timeout);
  }, [status]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;
    isDirtyRef.current = true;
    setInternalText(next);
    try {
      JSON.parse(next);
      setParseError(null);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  }, []);

  const handleApply = useCallback(() => {
    if (!canApply || !onApply) {
      return;
    }
    const result = onApply(internalText);
    setStatus(result);
    if (result?.status === 'success') {
      isDirtyRef.current = false;
    }
  }, [canApply, internalText, onApply]);

  const handleReset = useCallback(() => {
    isDirtyRef.current = false;
    setInternalText(jsonText);
    setParseError(null);
    setStatus(null);
    onReset?.();
  }, [jsonText, onReset]);

  const handleFormat = useCallback(() => {
    try {
      setInternalText(formatJsonText(internalText));
      setParseError(null);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  }, [internalText]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(internalText);
    } catch {
      // clipboard can fail in insecure contexts; ignore
    }
  }, [internalText]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        handleApply();
      }
    },
    [handleApply]
  );

  return (
    <StyledEditorPanel className={className} data-testid="json-editor">
      <StyledEditorHeader>
        <div className="spacer" />
        <button
          type="button"
          className="json-editor-icon-button"
          onClick={handleCopy}
          aria-label="Copy JSON"
          title="Copy JSON"
        >
          <Copy height="14px" />
        </button>
        {onClose ? (
          <button
            type="button"
            className="json-editor-icon-button"
            onClick={onClose}
            aria-label="Close"
            title="Close"
            data-testid="json-editor-close"
          >
            <Close height="14px" />
          </button>
        ) : null}
        {touched ? (
          <Button
            secondary
            small
            width="60px"
            onClick={handleReset}
            data-testid="json-editor-reset"
          >
            <FormattedMessage id="jsonEditor.reset" defaultMessage="Reset" />
          </Button>
        ) : null}
        {!isReadOnly ? (
          <>
            <Button
              secondary
              small
              width="60px"
              disabled={Boolean(parseError)}
              onClick={handleFormat}
              data-testid="json-editor-format"
            >
              <FormattedMessage id="jsonEditor.format" defaultMessage="Format" />
            </Button>
            <Button
              small
              width="60px"
              disabled={!canApply}
              onClick={handleApply}
              data-testid="json-editor-apply"
            >
              <FormattedMessage id="jsonEditor.apply" defaultMessage="Apply" />
            </Button>
          </>
        ) : null}
      </StyledEditorHeader>
      <StyledEditorBody>
        <StyledTextArea
          ref={textAreaRef}
          value={internalText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={isReadOnly}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label={intl.formatMessage({
            id: 'jsonEditor.textarea',
            defaultMessage: 'JSON configuration'
          })}
          style={{height}}
        />
        {parseError ? (
          <StyledEditorStatus status="error">
            <Warning height="14px" />
            {parseError}
          </StyledEditorStatus>
        ) : null}
        {status ? (
          <StyledEditorStatus status={status.status}>
            {status.status === 'success' ? <Checkmark height="14px" /> : <Warning height="14px" />}
            {status.message ?? (
              <FormattedMessage
                id={
                  status.status === 'success'
                    ? 'jsonEditor.configApplied'
                    : 'jsonEditor.applyFailed'
                }
                defaultMessage={
                  status.status === 'success' ? 'Config applied' : "Couldn't apply config"
                }
              />
            )}
          </StyledEditorStatus>
        ) : null}
      </StyledEditorBody>
    </StyledEditorPanel>
  );
}

export default JsonEditor;
