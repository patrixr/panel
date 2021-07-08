import m                from "mithril"
import store            from "../store"
import { loadConfig }   from "../store/actions"

const Preload : m.Component = {
  oninit: async () => {
    store.config = await loadConfig();
    m.route.set(store.loggedIn ? store.homePage : '/auth');
  },

  view: () => <h1>Booting up</h1>
}

export default Preload
