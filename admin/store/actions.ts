import store           from './store'
import * as api        from '../api'
import { PanelConfig } from '../../shared/definitions';

export async function login(formData : Record<string, string>) {
  store.jwt = await api.login(formData);
}

export function logout() {
  store.jwt = null;
}

export async function loadConfig() : Promise<PanelConfig> {
  store.config ||= await api.loadConfig();
  return store.config;
}
