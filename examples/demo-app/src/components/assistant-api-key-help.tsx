// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {useId, useState} from 'react';
import styled from 'styled-components';
import {Button} from '@kepler.gl/components';

// Keep these links on the providers' official sites. Verified November 2026.
const PROVIDERS = [
  {
    name: 'OpenAI',
    keyUrl: 'https://platform.openai.com/api-keys',
    docsUrl: 'https://developers.openai.com/api/docs/quickstart',
    steps: [
      'Sign in to the OpenAI Platform and open API keys.',
      'Create a new secret key for your project and copy it when it is shown.'
    ]
  },
  {
    name: 'Anthropic',
    keyUrl: 'https://platform.claude.com/settings/keys',
    docsUrl: 'https://platform.claude.com/docs/en/get-api-key',
    steps: [
      'Sign in to Claude Console and open API keys.',
      'Create a key, give it a name, select a workspace, and copy the key when it is shown.'
    ]
  },
  {
    name: 'Google Gemini',
    keyUrl: 'https://aistudio.google.com/apikey',
    docsUrl: 'https://aistudio.google.com/docs/api-key',
    steps: [
      'Sign in to Google AI Studio and accept the terms if prompted.',
      'Open API Keys and create or copy a key for a Google Cloud project. Import a project if needed. Use this key for the google provider.'
    ]
  },
  {
    name: 'DeepSeek',
    keyUrl: 'https://platform.deepseek.com/api_keys',
    docsUrl: 'https://api-docs.deepseek.com/',
    steps: [
      'Sign in to the DeepSeek platform and open API keys.',
      'Create a new API key and copy it. Add funds if your account has insufficient balance.'
    ]
  },
  {
    name: 'xAI',
    keyUrl: 'https://console.x.ai/team/default/api-keys',
    docsUrl: 'https://docs.x.ai/developers/quickstart',
    steps: [
      'Sign in to the xAI Console and add API credits to your team.',
      'Open API Keys, create a key for your team, and copy it.'
    ]
  }
];

const Help = styled.div`
  flex: 0 1 auto;
  min-height: 0;
  padding: 8px 12px;
  background: ${props => props.theme.sidePanelBg};
  color: ${props => props.theme.textColor};
  font-family: ${props => props.theme.fontFamily};
  font-size: 12px;

  button {
    font-size: 12px;
  }

  .api-key-help__content {
    max-height: 40vh;
    overflow-y: auto;
    line-height: 1.6;
  }

  h3 {
    color: ${props => props.theme.textColorHl};
    font-size: 13px;
    margin: 16px 0 4px;
  }

  ol {
    list-style: decimal;
    padding-left: 20px;
    margin: 8px 0;
  }

  p {
    margin: 8px 0;
  }

  && a {
    color: ${props => props.theme.activeColor};
    text-decoration: underline;
  }
`;

function HelpLink({href, children}: {href: string; children: React.ReactNode}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function AssistantApiKeyHelp() {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <Help>
      <Button
        type="button"
        link
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(value => !value)}
      >
        Get an API key
      </Button>
      {open && (
        <div
          id={contentId}
          className="api-key-help__content"
          role="region"
          aria-label="API key setup"
          tabIndex={0}
        >
          <p>
            After creating a key, open AI Settings, find its provider under Providers, and paste it
            into the API key field. You can also select a model and enter the key in the
            assistant&apos;s key input.
          </p>
          <p>API usage may require billing or credits with your provider.</p>
          {PROVIDERS.map(provider => (
            <section key={provider.name} aria-label={provider.name}>
              <h3>{provider.name}</h3>
              <HelpLink href={provider.keyUrl}>{provider.name} API keys</HelpLink>
              <ol>
                {provider.steps.map(step => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <HelpLink href={provider.docsUrl}>{provider.name} setup documentation</HelpLink>
            </section>
          ))}
          <section aria-label="Ollama">
            <h3>Ollama</h3>
            <p>
              For local models, install and start Ollama, then download a model. Keep Base URL set
              to <code>http://localhost:11434/v1</code> and enter <code>ollama</code> in the API key
              field. This is a placeholder required by the assistant; local Ollama does not require
              a secret key. Select a model installed on your computer.
            </p>
            <p>
              If browser requests are blocked, allow this app&apos;s origin with{' '}
              <code>OLLAMA_ORIGINS</code>, as described in the{' '}
              <HelpLink href="https://docs.ollama.com/faq#how-can-i-allow-additional-web-origins-to-access-ollama">
                Ollama browser access instructions
              </HelpLink>
              .
            </p>
            <p>
              For direct cloud access, sign in and create an{' '}
              <HelpLink href="https://ollama.com/settings/keys">Ollama API key</HelpLink>. In the
              provider&apos;s settings, change Base URL to <code>https://ollama.com/v1</code>, paste
              that key, and select a cloud model.
            </p>
            <HelpLink href="https://docs.ollama.com/api/openai-compatibility">
              Ollama setup documentation
            </HelpLink>
          </section>
          <section aria-label="Custom providers">
            <h3>Custom providers</h3>
            <p>
              Get an API key and an OpenAI-compatible Base URL from your provider or server
              administrator. Enter them under AI Settings → Providers → Add, then add a model
              supported by that provider.
            </p>
          </section>
        </div>
      )}
    </Help>
  );
}
