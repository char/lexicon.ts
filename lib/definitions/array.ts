import { InferProperty } from "../infer.ts";
import { defaultType, inputType, outputType, Property } from "../property.ts";

export interface ArrayDefinition {
  readonly type: "array";
  readonly items: unknown;
  readonly minLength?: number;
  readonly maxLength?: number;
}

export interface ArrayProperty<Def extends ArrayDefinition> extends Property {
  readonly kind: "array";

  readonly inner: InferProperty<Def["items"]>;
  readonly asArrayOrDerefNeeded: [this["inner"]] extends [never] ? this : this["inner"][];

  readonly [inputType]: this["asArrayOrDerefNeeded"];
  readonly [outputType]: this["asArrayOrDerefNeeded"];
  readonly [defaultType]: never;
}
