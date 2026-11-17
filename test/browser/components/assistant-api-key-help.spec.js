// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import {theme} from '@kepler.gl/styles';
import AssistantApiKeyHelp from '../../../examples/demo-app/src/components/assistant-api-key-help';

function setup() {
  render(
    <ThemeProvider theme={theme}>
      <AssistantApiKeyHelp />
    </ThemeProvider>
  );
  return screen.getByRole('button', {name: 'Get an API key'});
}

test('opens and closes the setup guide without requiring configured credentials', () => {
  const toggle = setup();
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('region', {name: 'API key setup'})).not.toBeInTheDocument();

  fireEvent.click(toggle);
  const guide = screen.getByRole('region', {name: 'API key setup'});
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(toggle).toHaveAttribute('aria-controls', guide.id);

  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('region', {name: 'API key setup'})).not.toBeInTheDocument();
});

test('routes every built-in provider to its official API-key page in a separate tab', () => {
  fireEvent.click(setup());
  const links = [
    ['OpenAI', 'https://platform.openai.com/api-keys'],
    ['Anthropic', 'https://platform.claude.com/settings/keys'],
    ['Google Gemini', 'https://aistudio.google.com/apikey'],
    ['DeepSeek', 'https://platform.deepseek.com/api_keys'],
    ['xAI', 'https://console.x.ai/team/default/api-keys'],
    ['Ollama', 'https://ollama.com/settings/keys']
  ];
  for (const [provider, url] of links) {
    const section = screen.getByRole('region', {name: provider});
    const link = within(section).getByRole('link', {name: new RegExp(`${provider} API key`)});
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});

test('distinguishes local Ollama credentials from cloud credentials and covers custom providers', () => {
  fireEvent.click(setup());
  const ollama = screen.getByRole('region', {name: 'Ollama'});
  expect(within(ollama).getByText('http://localhost:11434/v1')).toBeInTheDocument();
  expect(within(ollama).getByText('ollama', {selector: 'code'})).toBeInTheDocument();
  expect(within(ollama).getByText('https://ollama.com/v1')).toBeInTheDocument();
  expect(screen.getByRole('region', {name: 'Custom providers'})).toBeInTheDocument();
});
