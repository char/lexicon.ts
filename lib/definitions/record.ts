import { LexiconUniverse } from "../universe.ts";
import { Simplify } from "../util.ts";
import { InferObject, ObjectDefinition } from "./object.ts";

export type RecordDefinition = {
  type: "record";
  key: "tid" | "nsid" | `literal:${string}` | "any";
  record: ObjectDefinition;
};

export type InferRecord<U extends LexiconUniverse, Path extends string, Def extends RecordDefinition> = Simplify<
  { "$type": Path } & InferObject<U, Path, Def["record"], true>
>
