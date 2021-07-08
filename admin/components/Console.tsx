import m                    from "mithril"
import { PanelPage }        from "../../shared/definitions";
import { jsx }              from "../utils/render";
import { style }            from "typestyle";
import classnames           from 'classnames'
import store                from '../store'
import { Terminal }         from 'xterm'

export type ConsoleProps = {

}

const consoleStyle = style({
  zIndex: 9999,
  position: 'fixed',
  bottom: 0,
  height: '30%',
  width: '100%',
  border: '1px solid blue'
})

// ---------------------------------
// ~ CONSOLE
// ---------------------------------

const Console = () : m.Component<ConsoleProps> => ({
  view: (node) => {

    const bootTerminal = (node: m.VnodeDOM) => {
      // const el = node.dom.querySelector('.console-container');
      // console.log(el)
      const term = store.terminal;
      store.terminal.open(node.dom as HTMLElement);
      store.terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
      store.terminal.
    }

    return (
      <div
        oncreate={bootTerminal}
        className={classnames("console-container", consoleStyle)}
      >
      </div>
    )
  }
})

export default jsx(Console)
