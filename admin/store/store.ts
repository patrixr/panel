import { observable }         from 'mobx'
import { PanelConfig }        from "../../shared/definitions";
import { Terminal }           from 'xterm'

type Maybe<T> = T | null

export type PanelStore = {
  jwt: Maybe<string>,
  loggedIn: boolean,
  homePage: string,
  config: Maybe<PanelConfig>
  terminal: Terminal
}

export const store : PanelStore = observable({
  get jwt() {
    return localStorage.getItem('panel_jwt') || null;
  },
  set jwt(token: string) {
    if (!token) {
      localStorage.removeItem('panel_jwt');
    } else {
      localStorage.setItem('panel_jwt', token);
    }
  },
  get loggedIn() {
    return !!store.jwt;
  },
  get homePage() {
    return '/' + (store.config?.pages[0]?.path || '');
  },

  terminal: new Terminal(),

  config: null
})

export default store;
