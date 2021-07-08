import m from 'mithril'

export const Layout : m.Component = {
  view: function(vnode) {
      return <div>
        <h1>LAYOUT</h1>
        {vnode.children}
      </div>
  }
}

export default Layout;
