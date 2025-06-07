import { InferProperty } from "../infer.ts";
import { inputType, outputType, Property } from "../property.ts";
import { ObjectDefinition, ObjectProperty } from "./object.ts";
import { RefDefinition, UnionDefinition } from "./ref-union.ts";

export interface RPCParametersDefinition {
  readonly type: "params";
  readonly required?: readonly string[];
  readonly properties: Record<string, any>;
}

export interface RPCObjectDefinition {
  readonly encoding: "application/json" | (string & {});
  readonly schema?: ObjectDefinition | RefDefinition | UnionDefinition;
}

export interface RPCValue {
  params?: object;
  input?: object;
  output?: object;
}

export interface ProcedureDefinition {
  readonly type: "procedure";
  readonly parameters?: RPCParametersDefinition;
  readonly output?: RPCObjectDefinition;
  readonly input?: RPCObjectDefinition;
}

export interface ProcedureProperty<Def extends ProcedureDefinition> extends Property {
  readonly kind: "procedure";

  _params: Def["parameters"] extends RPCParametersDefinition
    ? ObjectProperty<{ type: "object", required: Def["parameters"]["required"], properties: Def["parameters"]["properties"] }>
    : Property<undefined>;

  _input: Def["input"] extends RPCObjectDefinition
    ? Def["input"]["schema"] extends undefined
      ? Property<undefined>
      : InferProperty<Def["input"]["schema"]>
    : Property<undefined>;

  _output: Def["output"] extends RPCObjectDefinition
    ? Def["output"]["schema"] extends undefined
      ? Property<undefined>
      : InferProperty<Def["output"]["schema"]>
    : Property<undefined>;

  readonly [inputType]: {
    [K in "params" | "input" | "output" as
      this[`_${K}`] extends Property<undefined> ? never : K
    ]: this[`_${K}`][typeof inputType];
  };
  readonly [outputType]: {
    [K in "params" | "input" | "output" as
      this[`_${K}`] extends Property<undefined> ? never : K
    ]: this[`_${K}`][typeof outputType];
  };
}

export interface QueryDefinition {
  readonly type: "query";
  readonly parameters?: RPCParametersDefinition;
  readonly output?: RPCObjectDefinition;
}

export interface QueryProperty<Def extends QueryDefinition> extends Property {
  readonly kind: "query";

  _params: Def["parameters"] extends RPCParametersDefinition
    ? ObjectProperty<{ type: "object", required: Def["parameters"]["required"], properties: Def["parameters"]["properties"] }>
    : Property<undefined>;
    
  _output: Def["output"] extends RPCObjectDefinition
    ? Def["output"]["schema"] extends undefined
      ? Property<undefined>
      : InferProperty<Def["output"]["schema"]>
    : Property<undefined>;

  readonly [inputType]: {
    [K in "params" | "output" as
      this[`_${K}`] extends Property<undefined> ? never : K
    ]: this[`_${K}`][typeof inputType];
  };
  readonly [outputType]: {
    [K in "params" | "output" as
      this[`_${K}`] extends Property<undefined> ? never : K
    ]: this[`_${K}`][typeof outputType];
  };
}
