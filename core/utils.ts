import { snakeCase } from "snake-case";

export const counter = (n = 0) => ({
  next: () => ++n,
  set: (v : number) => { n = v }
})

export const uniqueId = (() => {
  let uid = counter();

  const gen = (prefix = "") : string => {
    return prefix ? `${snakeCase(prefix)}_${uid.next()}` : String(uid.next());
  }

  gen.reset = () => uid.set(0)

  return gen;
})();


