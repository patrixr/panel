import m                           from 'mithril'
import { DataSource, PanelConfig } from '../shared/definitions';

export function getBaseUrl() : string {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  const url = new URL(location.href);
  url.hash = "";
  return url.toString();
}

export async function login(formData : Record<string, string>) : Promise<string> {
  const { jwt } = await m.request({
    method: "POST",
    url: getBaseUrl() + "/_api/auth",
    body: formData
  });

  return jwt;
}

export async function loadConfig() : Promise<PanelConfig> {
  return m.request({
    method: "GET",
    url: getBaseUrl() + "/_config"
  });
}

export async function readDatasource<T = any>(ds: DataSource) : Promise<T> {
  const { method, root, url } = ds.endpoint;

  return m.request({
    method,
    url: root ? url : (getBaseUrl() + url)
  });
}
