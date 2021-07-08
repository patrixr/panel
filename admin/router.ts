import m             from 'mithril'
import Page          from './pages/Page'
import Auth          from './pages/Auth'
import Preload       from './pages/Preload'
import store         from './store'
import NotFound      from './pages/NotFound'
import { Awaitable } from '../shared/definitions'

const SKIP = ((<any>m.route).SKIP) as object; // SKIP isn't typed

type Policy = (args: any) => Awaitable<boolean|'skip'>
type Factory = () => m.Component

const policies = {
  preloaded: () => {
    if (!store.config) {
      m.route.set("/");
      return false;
    }
    return true;
  },
  authenticated: () => {
    if (store.config.auth && !store.jwt) {
      m.route.set("/auth");
      return false;
    }
    return true;
  },
  pageExists: (args : any) => {
    return store.config.pages.find((p) => {
      return p.path === args.page;
    }) ? true : 'skip'
  }
}

const safe = (component: m.Component|Factory, policies: Policy[]) : m.RouteResolver => ({
  onmatch: async (args) => {
    for (const policy of policies) {
      const res = await policy(args);
      if (res !== true) {
        return res === 'skip' ? SKIP : res;
      }
    }
    return typeof component === 'function' ? component() : component
  }
});

export default {
  "/": Preload,
  "/auth": safe(Auth, [policies.preloaded]),
  "/:page": safe(Page, [policies.preloaded, policies.authenticated, policies.pageExists]),
  "/:404...": NotFound,
}
