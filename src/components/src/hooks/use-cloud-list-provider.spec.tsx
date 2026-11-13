// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import React, {PropsWithChildren} from 'react';
import {act, renderHook} from '@testing-library/react';
import {Provider} from '@kepler.gl/cloud-providers';
import {CloudListProvider, useCloudListProvider} from './use-cloud-list-provider';

function setup(providers: Provider[]) {
  const wrapper = ({children}: PropsWithChildren) => (
    <CloudListProvider providers={providers}>{children}</CloudListProvider>
  );
  return renderHook(() => useCloudListProvider(), {wrapper});
}

describe('CloudListProvider selection', () => {
  test('exposes available providers without automatically selecting one', () => {
    const providers = [new Provider({name: 'first'}), new Provider({name: 'second'})];
    const {result} = setup(providers);

    expect(result.current.cloudProviders).toEqual(providers);
    expect(result.current.provider).toBeNull();

    act(() => result.current.setProvider(providers[1]));

    expect(result.current.provider).toBe(providers[1]);
    expect(result.current.cloudProviders).toEqual(providers);
  });

  test('selecting the active provider again clears it and allows reselection', () => {
    const provider = new Provider({name: 'first'});
    const {result} = setup([provider]);

    act(() => result.current.setProvider(provider));
    expect(result.current.provider).toBe(provider);
    act(() => result.current.setProvider(provider));
    expect(result.current.provider).toBeNull();
    act(() => result.current.setProvider(provider));
    expect(result.current.provider).toBe(provider);
  });

  test('switching providers updates the active provider and subsequent toggle target', () => {
    const first = new Provider({name: 'first'});
    const second = new Provider({name: 'second'});
    const {result} = setup([first, second]);

    act(() => result.current.setProvider(first));
    act(() => result.current.setProvider(second));
    expect(result.current.provider).toBe(second);
    act(() => result.current.setProvider(first));
    expect(result.current.provider).toBe(first);
    act(() => result.current.setProvider(first));
    expect(result.current.provider).toBeNull();
  });

  test('explicit clearing is idempotent and does not prevent later selection', () => {
    const provider = new Provider({name: 'first'});
    const {result} = setup([provider]);

    act(() => result.current.setProvider(provider));
    act(() => result.current.setProvider(null));
    expect(result.current.provider).toBeNull();
    act(() => result.current.setProvider(null));
    expect(result.current.provider).toBeNull();
    act(() => result.current.setProvider(provider));
    expect(result.current.provider).toBe(provider);
  });

  test('separate provider scopes do not share selection, even with the same provider objects', () => {
    const provider = new Provider({name: 'first'});
    const first = setup([provider]);
    const second = setup([provider]);

    act(() => first.result.current.setProvider(provider));
    expect(first.result.current.provider).toBe(provider);
    expect(second.result.current.provider).toBeNull();
    act(() => second.result.current.setProvider(provider));
    act(() => first.result.current.setProvider(null));
    expect(first.result.current.provider).toBeNull();
    expect(second.result.current.provider).toBe(provider);

    second.unmount();
    const remounted = setup([provider]);
    expect(remounted.result.current.provider).toBeNull();
  });
});
