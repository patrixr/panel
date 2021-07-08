import m                    from "mithril"
import { PanelPage }        from "../../shared/definitions";
import { jsx }              from "../utils/render";
import { style }            from "typestyle";
import classnames           from 'classnames'
import { actions }          from '../store'

export type NavBarProps = {
  pages: PanelPage[]
}

const styles = {
  link: style({
    marginRight: '2em',
    marginLeft: '2em',
  }),
  navbar: style({
    padding: '0em',
    borderBottom: '1px solid gray',
    lineHeight: '5rem'
  }),
  title: style({
    marginRight: '2em',
    marginLeft: '2em'
  }),
  links: style({
    justifyContent: 'center'
  })
}

// ---------------------------------
// ~ NAVBAR
// ---------------------------------

const NavBar = () : m.Component<NavBarProps> => ({
  view: (node) => {
    const { pages } = node.attrs;

    const { Link } = m.route;

    const logout = async () => {
      await actions.logout();
      m.route.set('/auth')
    }

    return (
      <div>
        <div class={classnames('row', styles.navbar)}>
          <div class="column column-25">
            <div class={styles.title}>Panel</div>
          </div>
          <div class="column column-50">
            <div class={classnames('row', styles.links)}>
            {
              pages.map(p => (
                <div class={styles.link}>
                  { m(Link, {href: "/" + p.path}, p.name) }
                </div>
              ))
            }
            </div>
          </div>
          <div class="column column-25">
            <button class="button button-clear" onclick={logout}>Logout</button>
          </div>
        </div>
      </div>
    )
  }
})

export default jsx(NavBar)
