import it, { beforeEach }           from 'ava'
import { panel }                    from '../../core'
import { uniqueId }                 from '../../core/utils'

beforeEach(() => uniqueId.reset())

it('adds an api endpoint for the widget', (t) => {
  const { api } = panel((ui) => {
    ui.page('home', (p) => {
      p.widget('someWidget', () => 1)
    });
  })

  t.is(api.datasources.length, 1);

  const [ds] = api.datasources;

  t.truthy(ds.endpoint)
  t.truthy(ds.resolver)
  t.is(ds.resolver(), 1)
  t.deepEqual(ds.endpoint, {
    url: '/_api/some_widget_1',
    method: 'GET',
    root: false
  })
})
