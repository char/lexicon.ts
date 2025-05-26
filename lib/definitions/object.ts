import { InferProperty } from "../infer.ts";
import { defaultType, inputType, outputType, Property } from "../property.ts";
import { Simplify } from "../util.ts";

export interface ObjectDefinition {
  readonly type: "object";
  readonly required?: readonly string[];
  readonly nullable?: readonly string[];
  readonly properties: Record<string, any>;
}

export interface ObjectProperty<Def extends ObjectDefinition> extends Property<Record<string, any>> {
  readonly required: Def["required"] extends readonly string[] ? Def["required"][number] : never;
  readonly nullable: Def["nullable"] extends readonly string[] ? Def["nullable"][number] : never;

  readonly kind: "object";

  readonly [inputType]: Simplify<
      { -readonly [K in keyof Def["properties"] as K extends this["required"] ? K : never]:
          K extends this["nullable"]
            ? InferProperty<Def["properties"][K]>[typeof inputType] | null
            : InferProperty<Def["properties"][K]>[typeof inputType] }
    & { -readonly [K in keyof Def["properties"] as K extends this["required"] ? never : K]?:
          K extends this["nullable"]
            ? InferProperty<Def["properties"][K]>[typeof inputType] | null
            : InferProperty<Def["properties"][K]>[typeof inputType] }
  >;

  readonly [defaultType]: Simplify<
    { [K in keyof Def["properties"]]: InferProperty<Def["properties"][K]>[typeof defaultType] }
  >;

  readonly [outputType]: Simplify<
    { -readonly [K in keyof Def["properties"]]:
        K extends this["required"]
          ? InferProperty<Def["properties"][K]>[typeof outputType]
          : | InferProperty<Def["properties"][K]>[typeof outputType]
            | InferProperty<Def["properties"][K]>[typeof defaultType] }
  >;
}
