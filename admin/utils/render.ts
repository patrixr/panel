import m from 'mithril'

export function formBind(scope: any, field: string) {
  return {
    oninput: (e : any) => { scope[field] = e.target.value },
    value: scope[field]
  }
}

export type JSXMithrilComponent<P = {}, S = {}> = m.Component<P, S> & JSX.Element

export type FunctionComponent<P = {}, S = {}> = (arg: m.Vnode<P, S>) => m.Component<P, S>

export type FC<P = {}, S = {}> = FunctionComponent<P, S>

export const jsx = function<P, S>(cmp : m.Component<P, S> | FC<P, S>) : () => JSXMithrilComponent {
  return cmp as any;
}
