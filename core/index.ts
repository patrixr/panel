import { Endpoint, Field, Method, PanelConfig, PanelPage, PanelWidgetType } from "../shared/definitions"

import { snakeCase }                                                        from "snake-case"
import { uniqueId }                                                         from "./utils"

// ---------------------------------
// ~ TYPES
// ---------------------------------

export type AnyFunc = (...args: any[]) => any

export type Awaitable<T> = T | Promise<T>

export type AuthField = Field

export type AuthToken = string

export type AuthEncrypter = (...fields: AuthField[]) => Awaitable<AuthToken|null>

export type AuthDecrypter = (token: AuthToken) => Awaitable<boolean>

export type DataResolver<T> = (...args: string[]) => Awaitable<T>

export type AuthResolver = {
  encrypt: [...AuthField[], AuthEncrypter],
  decrypt: AuthDecrypter
}

export type WidgetData = string | number | Array<number>

export type PageContext = {
  widget: (name: string, data: DataResolver<WidgetData>) => void
  action: (name: string, args: string[], action: string | AnyFunc) => void
  collection: (name: string, data: DataResolver<any[]>) => void
}

export type PageBuilder = (p: PageContext) => void

export type PanelContext = {
  page: (name: string, p: PageBuilder) => void
  auth: (auth: AuthResolver) => void
}

export type PanelBuilder = (ui: PanelContext) => void

export type GeneratedApi = {
  datasources: {
    args: string[],
    endpoint: Endpoint,
    resolver: DataResolver<any>
  }[]
}

export type PanelDefinition = {
  config: PanelConfig,
  api: GeneratedApi,
  authResolver: AuthResolver | null
}

// ---------------------------------
// ~ CORE
// ---------------------------------

/**
 * Panel Builder
 *
 * @param {PanelBuilder} builder
 * @exports
 */
 export const panel = (builder: PanelBuilder) : PanelDefinition => {

  // --- State

  const config : PanelConfig = {
    pages: [],
    auth: undefined
  }

  const api : GeneratedApi = {
    datasources: []
  }

  let authResolver : AuthResolver | null = null

  // --- Helpers

  const newPage = (name: string) => {
    const page : PanelPage = {
      name: name,
      path: snakeCase(name),
      widgets: [],
      collections: [],
      actions: []
    }
    config.pages.push(page);
    return page;
  }

  const generateApi = (entityName: string, args: string[], method: Method, resolver: DataResolver<any>) : Endpoint => {
    const endpoint : Endpoint = {
      url: `/_api/${uniqueId(entityName)}`,
      method: method,
      root: false
    };

    api.datasources.push({ endpoint, args, resolver });
    return endpoint;
  }

  // --- Builder Context

  const ctx : PanelContext = {
    page: (pageName: string, pageBuilder: PageBuilder) => {
      let page = newPage(pageName);

      let pageCtx : PageContext = {
        widget: (name: string, data: DataResolver<WidgetData>) => {
          page.widgets.push({
            name: name,
            datasource: {
              endpoint: generateApi(name, [], 'GET', data)
            }
          })
        },
        action: (name: string, args: string[], action: string | AnyFunc) => {
          page.actions.push({
            name: name,
            action: typeof action !== 'string' ? generateApi(name, args, 'POST', action) : {
              url: action,
              method: 'POST',
              root: true
            },
            args: args
          })
        },
        collection: (name: string, data: DataResolver<any[]>) => {
          page.collections.push({
            name: name,
            datasource: {
              endpoint: generateApi(name, [], 'GET', data)
            }
          })
        }
      }

      pageBuilder(pageCtx);
    },

    auth: (resolver: AuthResolver) => {
      authResolver = resolver
      config.auth = {
        fields: authResolver.encrypt.slice(0, -1) as Field[]
      }
    }
  }

  // --- Trigger build

  builder(ctx);

  return {
    config,
    api,
    authResolver: authResolver
  }
}
