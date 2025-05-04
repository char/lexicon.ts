export type PathFor<LexId extends string, DefName extends string> =
  DefName extends "main" ? LexId : `${LexId}#${DefName}`;
export type SplitPath<Path extends string> =
  Path extends `${infer LexId}#${infer Fragment}` ? [LexId, Fragment] : [Path, "main"];
export type ResolvePath<From extends string, To extends string> =
  To extends `#${string}` ? `${SplitPath<From>[0]}${To}` : To;
