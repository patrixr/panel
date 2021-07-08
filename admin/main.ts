import m           from 'mithril'
import Router      from './router'
import { autorun } from 'mobx'

m.route(document.body, "/", Router);
autorun(m.redraw)
