export type AnyFunc = (...args: any[]) => any

export function task<R = any>(fn: AnyFunc) {
 const state = {
   loading: true,
   result: null as R|null,
   error: null as any|null,
   trigger: () => {
    try {
      state.loading = true;
      state.error = null;



    } catch (e) {
      state.error = e;
    } finally {
      state.loading = false;
    }
   }
 }

 return state;
}
