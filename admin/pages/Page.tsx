import classnames    from "classnames";
import m             from "mithril"
import { style }     from "typestyle";
import { PanelPage } from "../../shared/definitions";
import NavBar        from "../components/NavBar";
import Widget        from "../components/Widget";
import Console       from "../components/Console";
import store         from "../store"

// ---------------------------------
// ~ TYPES
// ---------------------------------

export type PageState = {
  config: PanelPage
}

// ---------------------------------
// ~ STYLE
// ---------------------------------

const pageStyle = style({
  $nest: {
    '.widget-list': {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    }
  }
})

// ---------------------------------
// ~ STYLE
// ---------------------------------

const getPageConf = () => {
  const path = m.route.get().replace(/^\//, '');
  return store.config.pages.find(p => {
    return p.path === path;
  })
}

// ---------------------------------
// ~ PAGE
// ---------------------------------

const Page : m.Component<{}, PageState> = {

  oninit: (vnode) => {
    vnode.state.config = getPageConf();
  },

  onbeforeupdate: (vnode) => {
    vnode.state.config = getPageConf();
  },

  view: (vnode) => {
    const { widgets } = vnode.state.config;

    return <div className={pageStyle}>
      <NavBar pages={store.config.pages}></NavBar>
      <Console></Console>
      <div className="container">
        <div className='widget-list'>
          {
            widgets.map(w => (
              <Widget key={w.name} widget={w}></Widget>
            ))
          }
        </div>
      </div>
    </div>
  }
}

export default Page
