import { Infer } from "../infer.ts";
import { ResolvePath } from "../path.ts";
import { LexiconUniverse } from "../universe.ts";

export type RefDefinition = { type: "ref", ref: string };

export type InferRef<
  U extends LexiconUniverse,
  Path extends string,
  Def extends RefDefinition,
  Required
> =
  Infer<U, ResolvePath<Path, Def["ref"]>, Required>;
