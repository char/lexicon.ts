import { Simplify } from "./_util.ts";
import { InferDefinition } from "./infer.ts";
import { _AnyDef, _AnyU } from "./lexicon.ts";

export type ArrayDefinition = {
  type: "array";
  items: _AnyDef;
  minLength?: number;
  maxLength?: number;
}

export type InferArray<U extends _AnyU, Path extends string, Def extends ArrayDefinition> =
  Simplify<InferDefinition<U, Path, Def["items"]>[]>
