import * as ProviderActions from 'actions/provider-actions';
import {MapListItem} from 'cloud-providers';

type ActionPayload<P> = {
  type?: string;
  payload: P;
};

export type ProviderState = {
  isProviderLoading: boolean;
  isCloudMapLoading: boolean;
  providerError: any;
  currentProvider: string | null;
  successInfo: any;
  mapSaved: null | string;
  initialState: any;
  visualizations: MapListItem[]
};

export const INITIAL_PROVIDER_STATE: ProviderState;

export function withTask<T>(s: T, any): T;

export function exportFileToCloudUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.ExportFileToCloudPayload>
): ProviderState;

export function exportFileSuccessUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.ExportFileSuccessPayload>
): ProviderState;

export function postSaveLoadSuccessUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.PostSaveLoadSuccessPayload>
): ProviderState;

export function exportFileErrorUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.ExportFileErrorPayload>
): ProviderState;

export function loadCloudMapUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.LoadCloudMapPayload>
): ProviderState;

export function loadCloudMapSuccessUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.LoadCloudMapSuccessPayload>
): ProviderState;

export function loadCloudMapErrorUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.LoadCloudMapErrorPayload>
): ProviderState;

export function resetProviderStatusUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.ResetProviderStatusPayload>
): ProviderState;

export function setCloudProviderUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.SetCloudProviderPayload>
): ProviderState;

export function getSavedMapsUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.GetSavedMapsPayload>
): ProviderState;

export function getSavedMapsSuccessUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.GetSavedMapsSuccessPayload>
): ProviderState;

export function getSavedMapsErrorUpdater(
  state: ProviderState,
  action: ActionPayload<ProviderActions.GetSavedMapsErrorPayload>
): ProviderState;

export function createGlobalNotificationTasks(p: {
  type?: string;
  message: string;
  delayClose?: boolean;
}): any[];
