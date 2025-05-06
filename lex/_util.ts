export type Simplify<T> = {[K in keyof T]: T[K]} & {};

type _WritableArray<A> =
    A extends readonly [] ? []
  : A extends readonly [infer H, ...infer T] ? [Unconstify<H>, ...Unconstify<T>]
  : A extends readonly [...infer H, infer T] ? [...Unconstify<H>, Unconstify<T>]
  : A extends ReadonlyArray<infer I> ? Array<I> : A;
type _WritableObject<T> =
  T extends object ? { -readonly [K in keyof T]: Unconstify<T[K]> } & {} : T;
export type Unconstify<T> = _WritableObject<_WritableArray<T>>;
