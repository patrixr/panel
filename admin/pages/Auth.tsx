import { formBind } from "../utils/render";
import * as api     from '../store/actions'
import store        from "../store"
import m            from "mithril"

const Auth = () : m.Component => {
  const { auth } = store.config;

  const fields = (auth?.fields || []).map(f => {
    return {
      name: typeof f === 'string' ?  f : f.name,
      type: typeof f === 'string' ?  'text' : f.type
    }
  })

  // State

  let loading = false;
  let error : any = null;

  const formData = fields.reduce((data, f) => ({ ...data, [f.name]: "" }), {})

  // Actions

  const submit = async () => {
    try {
      loading = true;
      error = null;

      await api.login(formData);
      m.route.set(store.homePage);
    } catch {
      store.jwt = "";
      error = 'Authentication failed'
    } finally {
      loading = false;
    }
  }

  // Render

  return {
    view: () => {
      return (
        <div class="container">
          <div class="row">
            <div class="column column-25"></div>
            <div class="column column-50">
              <h1>Login</h1>
              {
                fields.reduce((elements, { name, type }) => {
                  return [
                    ...elements,
                    <label for={name}>{name}</label>,
                    <input type={type} id={name} {...formBind(formData, name)} />
                  ]
                }, [])
              }
              <input class="button-primary" type="submit" value="Submit" onclick={submit}></input>
              {
                loading && <div>Loading</div>
              }
              {
                error && <div>Authentication failed</div>
              }
            </div>
            <div class="column column-25"></div>
          </div>
        </div>
      )
    }
  }
}

export default Auth
