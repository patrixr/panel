import it           from 'ava'
import { panel }    from '../../core'
import { uniqueId } from '../../core/utils';

it('sets an endpoint as the widget datasource', (t) => {
  const { config } = panel((ui) => {
    ui.page('home', (p) => {
      p.widget('Counter', () => 1)
    });
  })

  t.deepEqual(config.pages[0].widgets[0].datasource, {
    endpoint: {
      root: false,
      url: '/_api/counter_1',
      method: 'GET'
    }
  })
})

it('creates a different endpoint for a widget with the same name', (t) => {
  const { config } = panel((ui) => {
    uniqueId.reset()

    ui.page('home', (p) => {
      p.widget('duplicated_widget', () => 1)
      p.widget('duplicated_widget', () => 1)
    });
  })

  t.deepEqual(config.pages[0].widgets[0].datasource, {
    endpoint: {
      root: false,
      url: '/_api/duplicated_widget_1',
      method: 'GET'
    }
  })

  t.deepEqual(config.pages[0].widgets[1].datasource, {
    endpoint: {
      root: false,
      url: '/_api/duplicated_widget_2',
      method: 'GET'
    }
  })
})
