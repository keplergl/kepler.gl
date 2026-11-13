// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {ThemeProvider} from 'styled-components';
import type {CloudUser, Provider} from '@kepler.gl/cloud-providers';
import {theme} from '@kepler.gl/styles';
import CloudTile from './cloud-tile';
import {useCloudListProvider} from '../hooks/use-cloud-list-provider';

jest.mock('../hooks/use-cloud-list-provider', () => ({useCloudListProvider: jest.fn()}));

const user: CloudUser = {name: 'Test user', email: 'user@example.com'};
const setProvider = jest.fn();
const mockContext = jest.mocked(useCloudListProvider);

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
}

function makeProvider(name = 'Test cloud') {
  const methods = {
    name,
    displayName: name,
    getUser: jest.fn<Promise<CloudUser | null>, []>().mockResolvedValue(user),
    login: jest.fn<Promise<CloudUser | null>, []>().mockResolvedValue(user),
    logout: jest.fn<Promise<void>, []>().mockResolvedValue(undefined)
  };
  return {provider: methods as unknown as Provider, ...methods};
}

function tile(provider: Provider) {
  return (
    <ThemeProvider theme={theme}>
      <CloudTile provider={provider} />
    </ThemeProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockContext.mockReturnValue({provider: null, cloudProviders: [], setProvider});
});

test('mount loads the session without selecting a provider and ignores clicks while loading', async () => {
  const cloud = makeProvider();
  const pending = deferred<CloudUser | null>();
  cloud.getUser.mockReturnValue(pending.promise);
  render(tile(cloud.provider));
  fireEvent.click(screen.getByText(cloud.name));
  expect(cloud.getUser).toHaveBeenCalledTimes(1);
  expect(cloud.login).not.toHaveBeenCalled();
  expect(setProvider).not.toHaveBeenCalled();
  await act(async () => pending.resolve(user));
  expect(screen.getByText(user.name)).toBeInTheDocument();
  expect(screen.getByRole('button', {name: 'Logout'})).toBeInTheDocument();
  expect(setProvider).not.toHaveBeenCalled();
});

test.each(['resolve', 'reject'] as const)(
  'ignores a stale mount %s after changing provider',
  async outcome => {
    const oldCloud = makeProvider('Old cloud');
    const nextCloud = makeProvider('New cloud');
    const oldSession = deferred<CloudUser | null>();
    const nextSession = deferred<CloudUser | null>();
    oldCloud.getUser.mockReturnValue(oldSession.promise);
    nextCloud.getUser.mockReturnValue(nextSession.promise);
    const view = render(tile(oldCloud.provider));
    view.rerender(tile(nextCloud.provider));
    await act(async () => {
      if (outcome === 'resolve') oldSession.resolve(user);
      else oldSession.reject(new Error('Stale session error'));
    });
    expect(screen.getByText('Loading ...')).toBeInTheDocument();
    expect(screen.queryByText(user.name)).not.toBeInTheDocument();
    expect(screen.queryByText('Stale session error')).not.toBeInTheDocument();
    await act(async () => nextSession.resolve({...user, name: 'New user'}));
    expect(screen.getByText('New user')).toBeInTheDocument();
    expect(setProvider).not.toHaveBeenCalled();
  }
);

test('rechecks a cached session before selecting, without opening login', async () => {
  const cloud = makeProvider();
  cloud.getUser
    .mockResolvedValueOnce(user)
    .mockResolvedValueOnce({...user, name: 'Refreshed user'});
  render(tile(cloud.provider));
  await screen.findByText(user.name);
  fireEvent.click(screen.getByText(cloud.name));
  await screen.findByText('Refreshed user');
  expect(cloud.getUser).toHaveBeenCalledTimes(2);
  expect(cloud.login).not.toHaveBeenCalled();
  expect(setProvider).toHaveBeenCalledTimes(1);
  expect(setProvider).toHaveBeenCalledWith(cloud.provider);
});

test('an expired cached session logs in on selection and selects only once', async () => {
  const cloud = makeProvider();
  cloud.getUser.mockResolvedValueOnce(user).mockResolvedValueOnce(null);
  render(tile(cloud.provider));
  await screen.findByText(user.name);
  fireEvent.click(screen.getByText(cloud.name));
  await waitFor(() => expect(setProvider).toHaveBeenCalledWith(cloud.provider));
  expect(cloud.login).toHaveBeenCalledTimes(1);
  expect(setProvider).toHaveBeenCalledTimes(1);
  expect(screen.getByText(user.name)).toBeInTheDocument();
});

test('a transient recheck failure keeps the cached session and avoids another login popup', async () => {
  const cloud = makeProvider();
  cloud.getUser.mockResolvedValueOnce(user).mockRejectedValueOnce(new Error('Network unavailable'));
  render(tile(cloud.provider));
  await screen.findByText(user.name);
  fireEvent.click(screen.getByText(cloud.name));
  await waitFor(() => expect(setProvider).toHaveBeenCalledWith(cloud.provider));
  expect(screen.getByText(user.name)).toBeInTheDocument();
  expect(cloud.login).not.toHaveBeenCalled();
});

test('the Login button authenticates and selects the provider', async () => {
  const cloud = makeProvider();
  cloud.getUser.mockResolvedValue(null);
  render(tile(cloud.provider));
  await waitFor(() => expect(screen.queryByText('Loading ...')).not.toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', {name: 'Login'}));
  await screen.findByText(user.name);
  expect(cloud.login).toHaveBeenCalledTimes(1);
  expect(setProvider).toHaveBeenCalledWith(cloud.provider);
});

test('failed selection login displays the error and clears selection without an unhandled rejection', async () => {
  const cloud = makeProvider();
  cloud.getUser.mockResolvedValue(null);
  cloud.login.mockRejectedValue(new Error('Login denied'));
  render(tile(cloud.provider));
  await waitFor(() => expect(screen.queryByText('Loading ...')).not.toBeInTheDocument());
  fireEvent.click(screen.getByText(cloud.name));
  await screen.findByText('Login denied');
  expect(setProvider).toHaveBeenCalledTimes(1);
  expect(setProvider).toHaveBeenCalledWith(null);
  expect(screen.queryByText('Loading ...')).not.toBeInTheDocument();
});

test('a mount session error is surfaced and a subsequent login clears it', async () => {
  const cloud = makeProvider();
  cloud.getUser.mockRejectedValue(new Error('Session unavailable'));
  render(tile(cloud.provider));
  await screen.findByText('Session unavailable');
  fireEvent.click(screen.getByText(cloud.name));
  await screen.findByText(user.name);
  expect(screen.queryByText('Session unavailable')).not.toBeInTheDocument();
  expect(setProvider).toHaveBeenCalledWith(cloud.provider);
});

test('logout clears the local session and selection after the provider finishes', async () => {
  const cloud = makeProvider();
  const pending = deferred<void>();
  cloud.logout.mockReturnValue(pending.promise);
  render(tile(cloud.provider));
  await screen.findByText(user.name);
  fireEvent.click(screen.getByRole('button', {name: 'Logout'}));
  expect(cloud.logout).toHaveBeenCalledTimes(1);
  expect(setProvider).not.toHaveBeenCalled();
  await act(async () => pending.resolve(undefined));
  expect(screen.queryByText(user.name)).not.toBeInTheDocument();
  expect(screen.getByRole('button', {name: 'Login'})).toBeInTheDocument();
  expect(setProvider).toHaveBeenCalledWith(null);
});

test('a failed logout shows its error and can be retried successfully', async () => {
  const cloud = makeProvider();
  cloud.logout.mockRejectedValueOnce(new Error('Logout unavailable'));
  render(tile(cloud.provider));
  await screen.findByText(user.name);
  fireEvent.click(screen.getByRole('button', {name: 'Logout'}));
  await screen.findByText('Logout unavailable');
  expect(screen.queryByText('Loading ...')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Logout'}));
  await waitFor(() => expect(screen.queryByText('Logout unavailable')).not.toBeInTheDocument());
  expect(cloud.logout).toHaveBeenCalledTimes(2);
  expect(screen.getByRole('button', {name: 'Login'})).toBeInTheDocument();
});
