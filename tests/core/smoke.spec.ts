import it           from 'ava';
import { panel }    from '../../core';
import { uniqueId } from '../../core/utils';

const noop = () => {};

it('generates a config file', t => {
  uniqueId.reset();

  const { config } = panel(ui => {
    ui.page('home', p => {
      p.action('Action 1', noop);
      p.action('Action 2', '/my/own/endpoint');

      p.widget('Widget 1', () => [1, 2, 3]);
      p.widget('Widget 2', () => [1, 2, 3]);
      p.widget('Widget 3', () => [1, 2, 3]);

      p.collection('Reords', () => {
        return [];
      });
    });

    ui.page('custom', p => {
      p.action('Action 1', noop);
      p.action('Action 2', noop);
    });

    ui.auth({
      encrypt: [
        'username',
        'password',
        () => {
          return 'token';
        }
      ],

      decrypt: (token: string) => true
    });
  });

  t.deepEqual(config, {
    pages: [
      {
        name: 'home',
        widgets: [
          {
            name: 'Widget 1',
            datasource: {
              endpoint: { url: '/_api/widget_1_2', method: 'GET', root: false }
            }
          },
          {
            name: 'Widget 2',
            datasource: {
              endpoint: { url: '/_api/widget_2_3', method: 'GET', root: false }
            }
          },
          {
            name: 'Widget 3',
            datasource: {
              endpoint: { url: '/_api/widget_3_4', method: 'GET', root: false }
            }
          }
        ],
        collections: [
          {
            name: 'Reords',
            datasource: {
              endpoint: { url: '/_api/reords_5', method: 'GET', root: false }
            }
          }
        ],
        actions: [
          {
            name: 'Action 1',
            action: { url: '/_api/action_1_1', method: 'POST', root: false }
          },
          {
            name: 'Action 2',
            action: { url: '/my/own/endpoint', method: 'POST', root: true }
          }
        ]
      },
      {
        name: 'custom',
        widgets: [],
        collections: [],
        actions: [
          {
            name: 'Action 1',
            action: { url: '/_api/action_1_6', method: 'POST', root: false }
          },
          {
            name: 'Action 2',
            action: { url: '/_api/action_2_7', method: 'POST', root: false }
          }
        ]
      }
    ],
    auth: { fields: ['username', 'password'] }
  });
});
