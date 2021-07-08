import it        from 'ava'
import { panel } from '../../core'

const noop = () => {};

it('adds pages to the config', (t) => {
  const { config } = panel((ui) => {
    ui.page('home', noop);
    ui.page('about', noop);
    ui.page('help', noop);
  })

  t.is(config.pages.length, 3, 'Page has been added')
})

it('adds widgets to the page', (t) => {
  const { config } = panel((ui) => {
    ui.page('home', (p) => {
      p.widget('Counter', () => 1)
    });
  })
  t.is(config.pages[0].widgets.length, 1, 'Widget has been added')
})
