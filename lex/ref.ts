import { Infer } from "./infer.ts";
import { _AnyU } from "./lexicon.ts";
import { ResolvePath } from "./path.ts";

export type RefDefinition = { type: "ref", ref: string };

export type InferRef<U extends _AnyU, Path extends string, Def extends RefDefinition> =
  Infer<U, ResolvePath<Path, Def["ref"]>>
