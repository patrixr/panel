import Router     from '@koa/router'
import send       from 'koa-send'
import path       from 'path'
import koa        from 'koa'

const serveBase = path.join(__dirname, 'webapp')
const buildFolder = path.join(serveBase, '.build')

/**
 *
 * @export
 */
export default function() {
  const router = new Router();

  router.get('/', async ctx => {
    return send(ctx, '/index.html', {
      root: serveBase
    })
  });

  router.get('/(.*)', async ctx => {
    const endpoint = ctx.path.replace(/^\/admin\/\.build/, '');
    return send(ctx, endpoint, { root: buildFolder })
  })

  return router.routes();
}
