import { _AnyUniverse } from "./definition.ts";
import { Infer } from "./infer.ts";
import { ResolvePath } from "./path.ts";

export type RefDefinition = { type: "ref", ref: string };

export type InferRef<U extends _AnyUniverse, Path extends string, Def extends RefDefinition> =
  Infer<U, ResolvePath<Path, Def["ref"]>>
