import { Infer } from "../infer.ts";
import { ResolvePath } from "../path.ts";
import { LexiconUniverse } from "../universe.ts";
import { Simplify, WithDefault } from "../util.ts";

export type UnionDefinition = {
  type: "union";
  refs: string[];
  closed?: boolean;
};

export type InferUnion<U extends LexiconUniverse, Path extends string, Def extends UnionDefinition, Required> =
  WithDefault<
    Simplify<{[Ref in Def["refs"][number]]:
      { "$type": ResolvePath<Path, Ref> }
        & Infer<U, ResolvePath<Path, Ref>>
    }[Def["refs"][number]]>,
  undefined, Required>
