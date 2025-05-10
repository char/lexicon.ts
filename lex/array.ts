import { Simplify } from "./_util.ts";
import { AnyDefinition, _AnyUniverse } from "./definition.ts";
import { InferDefinition } from "./infer.ts";

export type ArrayDefinition = {
  type: "array";
  items: AnyDefinition;
  minLength?: number;
  maxLength?: number;
}

export type InferArray<U extends _AnyUniverse, Path extends string, Def extends ArrayDefinition> =
  Simplify<InferDefinition<U, Path, Def["items"]>[]>
