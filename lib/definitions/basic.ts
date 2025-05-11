import { IsDefinedAndKnown, Simplify, WithDefault } from "../util.ts";

export type NullDefinition = { type: "null"; }

export type BooleanDefinition = {
  type: "boolean";
  default?: boolean;
  const?: boolean;
}
export type InferBoolean<Def extends BooleanDefinition, Required> =
  IsDefinedAndKnown<Def["const"]> extends true
    ? Def["const"]
  : WithDefault<boolean, Def["default"], Required>;

export type IntegerDefinition = {
  type: "integer";
  minimum?: number;
  maximum?: number;
  enum?: number[];
  default?: number;
  const?: number;
}

export type InferInteger<Def extends IntegerDefinition, Required> =
  Simplify<
    Def["enum"] extends number[]
      ? Def["enum"][number]
    : IsDefinedAndKnown<Def["const"]> extends true
      ? Def["const"]
    : WithDefault<number, Def["default"], Required>
  >;

export type BytesDefinition = {
  type: "bytes";
  minLength?: number;
  maxLength?: number;
}
export type InferBytes<_Def extends BytesDefinition, Required> =
  Simplify<
    WithDefault<Uint8Array, undefined, Required>
  >;

export type UnknownDefinition = { type: "unknown"; };
export type InferUnknown<_Def extends UnknownDefinition, Required> =
  Simplify<
    WithDefault<Record<string, unknown>, undefined, Required>
  >;
