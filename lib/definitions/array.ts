import { InferProperty } from "../infer.ts";
import { inputType, outputType, Property } from "../property.ts";

export interface ArrayDefinition {
  readonly type: "array";
  readonly items: unknown;
  readonly minLength?: number;
  readonly maxLength?: number;
}

export interface ArrayProperty<Def extends ArrayDefinition> extends Property<any> {
  readonly inner: InferProperty<Def["items"]>;
  
  readonly [inputType]: this["inner"][];
  readonly [outputType]: this["inner"][];
}
