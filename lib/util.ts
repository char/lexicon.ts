export type Simplify<T> = T extends object
  ? { [K in keyof T as [T[K]] extends [never] ? never : K]: T[K]; } & {}
  : T;

export type SimplifyDeep<T> =
    T extends (string | number | boolean) ? T
  : T extends (any[]) ? (SimplifyDeep<T[number]>)[]
  : T extends (readonly any[]) ? readonly (SimplifyDeep<T[number]>)[]
  : T extends object ? { [K in keyof T as [T[K]] extends [never] ? never : K]: SimplifyDeep<T[K]>; } & {}
  : T;
