import { Simplify } from "./_util.ts";
import { _AnyUniverse } from "./definition.ts";
import { Infer } from "./infer.ts";
import { ResolvePath } from "./path.ts";

export type UnionDefinition = {
  type: "union";
  refs: string[];
  closed?: boolean;
};

export type InferUnion<U extends _AnyUniverse, Path extends string, Def extends UnionDefinition> = Simplify<
  { [Ref in Def["refs"][number]]: { "$type": ResolvePath<Path, Ref> } & Infer<U, ResolvePath<Path, Ref>> }[Def["refs"][number]]
>
