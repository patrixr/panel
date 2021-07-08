export type Awaitable<T> = T | Promise<T>

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTION"

export type Endpoint = {
  url: string,
  method: Method,
  root: boolean
}

export type DataSource = {
  endpoint: Endpoint
}

export type Field = string | {
  name: string,
  type: string
}

export interface PanelEntity {
  name: string
}

export enum PanelWidgetType {
  CHART = 'chart',
  COUNTER = 'counter',
  STATUS = 'status',
  UNKNOWN = 'unknown'
}

export interface PanelWidget extends PanelEntity {
  datasource: DataSource
}

export interface PanelPage extends PanelEntity {
  path: string,
  widgets: PanelWidget[]
  collections: PanelCollection[]
  actions: PanelAction[]
}

export interface PanelAuth {
  fields: Field[]
}

export interface PanelCollection extends PanelEntity {
  datasource: DataSource
}

export interface PanelAction extends PanelEntity {
  action: Endpoint
  args?: string[]
}

export interface PanelConfig {
  pages: PanelPage[],
  auth?: PanelAuth
}
