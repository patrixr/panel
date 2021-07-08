import * as Eta                               from 'eta'
import { AuthEncrypter, PanelBuilder, panel } from "../core"
import Koa                                    from 'koa'
import Router                                 from '@koa/router'
import bodyParser                             from 'koa-bodyparser'
import path                                   from 'path'
import send                                   from 'koa-send'

const serveBase = path.join(__dirname, '../dist/admin');

export default function (builder: PanelBuilder) : Koa.Middleware<any, any> {
  const router = new Router();

  const indexHtml = path.join(serveBase, 'index.ejs');

  const { config, api, authResolver } = panel(builder);

  router.get('/', async ctx => {
    ctx.type = "text/html"
    ctx.status = 200;
    ctx.body = await Eta.renderFileAsync(indexHtml, {
      baseUrl: ctx.path
    })
  });

  router.get('/_config', (ctx) => {
    ctx.type = 'application/json'
    ctx.body = JSON.stringify(config);
    ctx.status = 200;
  })

  router.post('/_api/auth', bodyParser(), (ctx) => {
    if (!config.auth || !authResolver) {
      ctx.status = 200;
      ctx.body = { ok: true, token: "" };
    } else {
      try {
        const fields = config.auth.fields.map(f => {
          return ctx.request.body[typeof f === 'string' ? f : f.name]
        })

        const encrypt = authResolver.encrypt.slice(-1)[0] as AuthEncrypter;
        const token = encrypt(...fields);

        if (!token) throw new Error('Unauthorized')

        ctx.body = { ok: true, jwt: token }
        ctx.status = 200;
      } catch (e : any) {
        ctx.status = 401;
        ctx.body = { ok: false, error: 'Unauthorized', details: e}
      }
    }
  })

  router.all('/_api/:func', async (ctx, next) => {
    const method = ctx.method.toUpperCase();
    const endpoint = `/_api/${ctx.params.func}`
    const body = ctx.request.body || {};
    const args: string[] = body['args'] || [];

    for (const ds of api.datasources) {
      if (ds.endpoint.root) continue;

      if (endpoint === ds.endpoint.url && method == ds.endpoint.method) {

        if (ds.args.length > 0 && args.length !== ds.args.length) {
          ctx.status = 422;
          ctx.type = 'application/json'
          ctx.body = JSON.stringify({
            error: `Invalid arguments, expected [${ds.args.join(', ')}]`
          })
          return;
        }

        ctx.body = JSON.stringify(await ds.resolver(...args));
        ctx.status = 200;
        ctx.type = 'application/json'
        return;
      }
    }

    return next();
  })

  router.get('/:file', async ctx => {
    return send(ctx, ctx.params.file, { root: serveBase })
  })

  return router.routes();
}
