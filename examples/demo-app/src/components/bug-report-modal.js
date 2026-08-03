// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useState, useCallback, useEffect, useRef} from 'react';
import styled, {keyframes} from 'styled-components';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const RATE_LIMIT_KEY = 'kepler_bug_report_last_submit';
const RATE_LIMIT_MS = 10 * 60 * 1000; // 10 minutes
const MAX_TITLE_LEN = 200;
const MAX_FIELD_LEN = 2000;
const SUBMIT_ENDPOINT = '/.netlify/functions/submit-bug-report';

// ---------------------------------------------------------------------------
// Browser / env info helpers
// ---------------------------------------------------------------------------
function getKeplerVersion() {
  try {
    // Pulled from the injected build constant when available
    return (
      (typeof __KEPLER_VERSION__ !== 'undefined' && __KEPLER_VERSION__) || // eslint-disable-line no-undef
      window.__kepler_version__ ||
      'unknown'
    );
  } catch {
    return 'unknown';
  }
}

function getBrowserInfo() {
  const ua = navigator.userAgent;

  // Simplified browser detection
  let browser = 'Unknown';
  if (/Edg\//.test(ua)) browser = `Edge ${(ua.match(/Edg\/([\d.]+)/) || [])[1] || ''}`;
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua))
    browser = `Chrome ${(ua.match(/Chrome\/([\d.]+)/) || [])[1] || ''}`;
  else if (/Firefox\//.test(ua))
    browser = `Firefox ${(ua.match(/Firefox\/([\d.]+)/) || [])[1] || ''}`;
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua))
    browser = `Safari ${(ua.match(/Version\/([\d.]+)/) || [])[1] || ''}`;

  // OS detection
  let os = 'Unknown';
  if (/Windows NT/.test(ua)) {
    const ver = (ua.match(/Windows NT ([\d.]+)/) || [])[1];
    os = `Windows${ver ? ` ${ver}` : ''}`;
  } else if (/Mac OS X/.test(ua)) {
    const ver = ((ua.match(/Mac OS X ([\d_]+)/) || [])[1] || '').replace(/_/g, '.');
    os = `macOS${ver ? ` ${ver}` : ''}`;
  } else if (/Linux/.test(ua)) {
    os = 'Linux';
  } else if (/Android/.test(ua)) {
    os = `Android ${(ua.match(/Android ([\d.]+)/) || [])[1] || ''}`;
  } else if (/iPhone|iPad/.test(ua)) {
    os = `iOS ${((ua.match(/OS ([\d_]+)/) || [])[1] || '').replace(/_/g, '.')}`;
  }

  return {
    browser: browser.trim(),
    os: os.trim(),
    resolution: `${window.screen.width}x${window.screen.height}`,
    keplerVersion: getKeplerVersion(),
    url: window.location.href
  };
}

// ---------------------------------------------------------------------------
// Rate-limit helpers
// ---------------------------------------------------------------------------
function getRemainingCooldown() {
  const raw = localStorage.getItem(RATE_LIMIT_KEY);
  if (!raw) return 0;
  const elapsed = Date.now() - parseInt(raw, 10);
  return Math.max(0, RATE_LIMIT_MS - elapsed);
}

function formatSeconds(ms) {
  const s = Math.ceil(ms / 1000);
  if (s >= 60) return `${Math.ceil(s / 60)} min`;
  return `${s} sec`;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const Dialog = styled.div`
  background: #242730;
  border: 1px solid #3a3f4a;
  border-radius: 6px;
  padding: 28px 32px 24px;
  width: 520px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  animation: ${fadeIn} 0.18s ease;
  color: #e0e0e0;
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 13px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #9fa5b0;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 3px;
  &:hover {
    color: #fff;
    background: #3a3f4a;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9fa5b0;
  margin-bottom: 6px;
`;

const Required = styled.span`
  color: #e8664a;
  margin-left: 2px;
`;

const Input = styled.input`
  width: 100%;
  background: #1a1c24;
  border: 1px solid ${props => (props.$error ? '#e8664a' : '#3a3f4a')};
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 13px;
  padding: 8px 10px;
  outline: none;
  box-sizing: border-box;
  &:focus {
    border-color: ${props => (props.$error ? '#e8664a' : '#5b7fde')};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background: #1a1c24;
  border: 1px solid #3a3f4a;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 13px;
  padding: 8px 10px;
  outline: none;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
  font-family: inherit;
  &:focus {
    border-color: #5b7fde;
  }
`;

const FieldGroup = styled.div`
  margin-bottom: 16px;
`;

const CharCount = styled.span`
  float: right;
  font-size: 11px;
  color: ${props => (props.$warn ? '#e8664a' : '#5a6070')};
`;

const ErrorMsg = styled.div`
  color: #e8664a;
  font-size: 11px;
  margin-top: 4px;
`;

const BrowserInfoBox = styled.div`
  background: #1a1c24;
  border: 1px solid #2e3240;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  gap: 10px;
`;

const GithubLink = styled.a`
  font-size: 11px;
  color: #5b7fde;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitBtn = styled.button`
  background: ${props => (props.disabled ? '#2e3240' : '#5b7fde')};
  border: none;
  border-radius: 4px;
  color: ${props => (props.disabled ? '#5a6070' : '#fff')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 13px;
  font-weight: 600;
  padding: 9px 20px;
  transition: background 0.15s;
  &:hover:not(:disabled) {
    background: #4a6ed0;
  }
`;

const SuccessBox = styled.div`
  text-align: center;
  padding: 24px 0 8px;
  animation: ${fadeIn} 0.2s ease;
`;

const SuccessIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const SuccessTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
`;

const SuccessBody = styled.div`
  font-size: 13px;
  color: #9fa5b0;
  line-height: 1.6;
`;

const CooldownNotice = styled.div`
  background: #2e2a1a;
  border: 1px solid #5a4a1a;
  border-radius: 4px;
  color: #c9a84c;
  font-size: 12px;
  padding: 8px 12px;
  margin-bottom: 16px;
`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const BugReportModal = ({isOpen, onClose}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [titleError, setTitleError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [browserInfo] = useState(() => getBrowserInfo());
  const titleRef = useRef(null);
  const timerRef = useRef(null);

  // Check cooldown and start countdown if needed
  useEffect(() => {
    if (!isOpen) return;
    const remaining = getRemainingCooldown();
    setCooldownMs(remaining);
    if (remaining > 0) {
      timerRef.current = setInterval(() => {
        const r = getRemainingCooldown();
        setCooldownMs(r);
        if (r === 0) clearInterval(timerRef.current);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen]);

  // Focus title on open
  useEffect(() => {
    if (isOpen && !submitted) {
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [isOpen, submitted]);

  const reset = useCallback(() => {
    setTitle('');
    setDescription('');
    setSteps('');
    setExpected('');
    setTitleError('');
    setSubmitError('');
    setSubmitted(false);
    setIsSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const handleOverlayClick = useCallback(
    e => {
      if (e.target === e.currentTarget) handleClose();
    },
    [handleClose]
  );

  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Escape') handleClose();
    },
    [handleClose]
  );

  const handleSubmit = useCallback(async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Please enter a title');
      titleRef.current?.focus();
      return;
    }

    const remaining = getRemainingCooldown();
    if (remaining > 0) {
      setCooldownMs(remaining);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch(SUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          title: trimmedTitle,
          description: description.trim(),
          steps: steps.trim(),
          expected: expected.trim(),
          browserInfo
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) {
          setSubmitError(data.error || 'Too many requests. Please wait before submitting again.');
        } else {
          setSubmitError(data.error || `Submission failed (${res.status}). Please try again.`);
        }
        return;
      }

      localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      setSubmitted(true);
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, steps, expected, browserInfo]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleOverlayClick} onKeyDown={handleKeyDown} tabIndex={-1}>
      <Dialog role="dialog" aria-modal="true" aria-labelledby="bug-report-title">
        <Header>
          <Title id="bug-report-title">Report a Bug</Title>
          <CloseBtn onClick={handleClose} aria-label="Close">
            ×
          </CloseBtn>
        </Header>

        {submitted ? (
          <SuccessBox>
            <SuccessIcon>✓</SuccessIcon>
            <SuccessTitle>Thank you!</SuccessTitle>
            <SuccessBody>
              Your report has been sent to the team. We really appreciate you taking the time to
              help us improve kepler.gl.
            </SuccessBody>
            <div style={{marginTop: 24}}>
              <SubmitBtn onClick={handleClose}>Close</SubmitBtn>
            </div>
          </SuccessBox>
        ) : (
          <>
            {cooldownMs > 0 && (
              <CooldownNotice>
                You already submitted a report recently. You can submit again in{' '}
                {formatSeconds(cooldownMs)}.
              </CooldownNotice>
            )}

            <BrowserInfoBox>
              <strong style={{color: '#9fa5b0'}}>Auto-collected info:</strong>{' '}
              {browserInfo.browser} · {browserInfo.os} · {browserInfo.resolution} · kepler.gl{' '}
              {browserInfo.keplerVersion}
            </BrowserInfoBox>

            <FieldGroup>
              <Label htmlFor="bug-title">
                Title <Required>*</Required>
                <CharCount $warn={title.length > MAX_TITLE_LEN * 0.9}>
                  {title.length}/{MAX_TITLE_LEN}
                </CharCount>
              </Label>
              <Input
                id="bug-title"
                ref={titleRef}
                value={title}
                onChange={e => {
                  setTitle(e.target.value.slice(0, MAX_TITLE_LEN));
                  if (titleError) setTitleError('');
                }}
                placeholder="Short summary of the bug"
                $error={!!titleError}
                autoComplete="off"
              />
              {titleError && <ErrorMsg>{titleError}</ErrorMsg>}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="bug-description">
                What happened?
                <CharCount $warn={description.length > MAX_FIELD_LEN * 0.9}>
                  {description.length}/{MAX_FIELD_LEN}
                </CharCount>
              </Label>
              <Textarea
                id="bug-description"
                value={description}
                onChange={e => setDescription(e.target.value.slice(0, MAX_FIELD_LEN))}
                placeholder="Describe the bug in detail"
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="bug-steps">
                Steps to reproduce
                <CharCount $warn={steps.length > MAX_FIELD_LEN * 0.9}>
                  {steps.length}/{MAX_FIELD_LEN}
                </CharCount>
              </Label>
              <Textarea
                id="bug-steps"
                value={steps}
                onChange={e => setSteps(e.target.value.slice(0, MAX_FIELD_LEN))}
                placeholder={'1. Open the map\n2. Click ...\n3. See error'}
                style={{minHeight: 90}}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="bug-expected">
                Expected behavior
                <CharCount $warn={expected.length > MAX_FIELD_LEN * 0.9}>
                  {expected.length}/{MAX_FIELD_LEN}
                </CharCount>
              </Label>
              <Textarea
                id="bug-expected"
                value={expected}
                onChange={e => setExpected(e.target.value.slice(0, MAX_FIELD_LEN))}
                placeholder="What should have happened instead?"
              />
            </FieldGroup>

            {submitError && <ErrorMsg style={{marginBottom: 12}}>{submitError}</ErrorMsg>}

            <Footer>
              <GithubLink
                href="https://github.com/keplergl/kepler.gl/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBug%5D"
                target="_blank"
                rel="noreferrer"
              >
                Open on GitHub instead ↗
              </GithubLink>
              <SubmitBtn
                onClick={handleSubmit}
                disabled={isSubmitting || cooldownMs > 0 || !title.trim()}
              >
                {isSubmitting ? 'Sending…' : 'Send Report'}
              </SubmitBtn>
            </Footer>
          </>
        )}
      </Dialog>
    </Overlay>
  );
};

export default BugReportModal;
