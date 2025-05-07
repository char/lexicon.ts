import { Simplify } from "./_util.ts";
import { _AnyUniverse } from "./lexicon.ts";
import { InferObject, ObjectDefinition } from "./object.ts";

export type RecordDefinition = {
  type: "record";
  key: "tid" | "nsid" | `literal:${string}` | "any";
  record: ObjectDefinition;
};

export type InferRecord<U extends _AnyUniverse, Path extends string, Def extends RecordDefinition> = Simplify<
  { "$type": Path } & InferObject<U, Path, Def["record"]>
>
