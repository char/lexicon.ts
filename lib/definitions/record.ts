import { ObjectProperty } from "@char/lexicon.ts";
import { defaultType, inputType, outputType, Property } from "../property.ts";
import { ObjectDefinition } from "./object.ts";

export interface RecordDefinition {
  readonly type: "record";
  readonly key: "tid" | "nsid" | `literal:${string}` | "any" | (string & {});
  readonly record: ObjectDefinition;
};

export interface RecordProperty<Def extends RecordDefinition> extends Property {
  readonly kind: "record";

  readonly [inputType]: this;
  readonly [outputType]: this;
  readonly [defaultType]: never;
}

export interface RecordPropertyWithPath<Def extends RecordDefinition, Path extends string> {
  obj: ObjectProperty<Def["record"]>;
  ty: { $type: Path };

  readonly [inputType]: this["ty"] & this["obj"][typeof inputType];
  readonly [outputType]: this["ty"] & this["obj"][typeof outputType];
  readonly [defaultType]: this["ty"] & this["obj"][typeof defaultType];
}
