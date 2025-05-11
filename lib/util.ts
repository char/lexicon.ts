export type Simplify<T> = T extends object
  ? { [K in keyof T as [T[K]] extends [never] ? never : K]: T[K]; } & {}
  : T;

export type IsDefinedAndKnown<T> =
    unknown extends T ? false
  : undefined extends T ? false
  : true;

export type WithDefault<T, Default, Required> =
  Required extends true
    ? T
    : IsDefinedAndKnown<Default> extends true ? T | Default : T | undefined;

export type PartialOnUndefined<T extends object> =
  { [K in keyof T as undefined extends T[K] ? never : K]: T[K] } &
  { [K in keyof T as undefined extends T[K] ? K : never]?: T[K] & {} };

type _WritableArray<A> =
    A extends readonly [] ? []
  : A extends readonly [infer H, ...infer T] ? [Unconstify<H>, ...Unconstify<T>]
  : A extends readonly [...infer H, infer T] ? [...Unconstify<H>, Unconstify<T>]
  : A extends ReadonlyArray<infer I> ? Array<I> : A;
type _WritableObject<T> =
  T extends object ? { -readonly [K in keyof T]: Unconstify<T[K]> } & {} : T;
export type Unconstify<T> = _WritableObject<_WritableArray<T>>;
