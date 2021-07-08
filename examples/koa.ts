import Koa      from 'koa'
import Router   from '@koa/router'
import panel    from '../engines/koa'

const app = new Koa();

const noop = () => {};

const router = new Router();

app.use((ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', "*");
  ctx.set('Access-Control-Allow-Headers', "*");
  return next();
})

router.use('/admin', panel(ui => {
  ui.page('home', p => {
    p.action('Action 1', [], noop);
    p.action('Action 2', [], '/my/own/endpoint');

    p.widget('Widget 1', () => 49);
    p.widget('Widget 2', () => [1, 2, 3, 50,30, -10, 999]);
    p.widget('Widget 3', () => "Online");
    p.widget('Hello', () => 78);

    p.collection('All Customers', () => {
      return [];
    });
  });

  ui.page('custom', p => {
    p.action('Action 1', [], noop);
    p.action('Action 2', [], noop);

    p.widget('Custom Widget 1', () => 49);
  });

  ui.page('page 3', p => {
    p.action('Action 1', [], noop);
    p.action('Action 2', [], noop);

    p.widget('Custom Widget 1', () => 49);
  });

  ui.auth({
    encrypt: [
      'username',
      'password',
      (un, pw) => {
        if (un === 'username' && pw === 'password') {
          return 'token';
        }
        return null;
      }
    ],

    decrypt: (token: string) => {
      return token === "token";
    }
  });
}))

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3333, () => {
  console.info('Koa running on http://localhost:3333');
});
