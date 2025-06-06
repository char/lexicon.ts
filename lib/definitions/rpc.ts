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
  parameters?: object;
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
    : Property<{}>;

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
    parameters: ProcedureProperty<Def>["_params"][typeof inputType];
    input: ProcedureProperty<Def>["_input"][typeof inputType];
    output: ProcedureProperty<Def>["_output"][typeof inputType];
  };
  readonly [outputType]: {
    parameters: ProcedureProperty<Def>["_params"][typeof outputType];
    input: ProcedureProperty<Def>["_input"][typeof outputType];
    output: ProcedureProperty<Def>["_output"][typeof outputType];
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
    : Property<{}>;
    
  _output: Def["output"] extends RPCObjectDefinition
    ? Def["output"]["schema"] extends undefined
      ? Property<undefined>
      : InferProperty<Def["output"]["schema"]>
    : Property<undefined>;

  readonly [inputType]: {
    parameters: QueryProperty<Def>["_params"][typeof inputType];
    output: QueryProperty<Def>["_output"][typeof inputType];
  };
  readonly [outputType]: {
    parameters: QueryProperty<Def>["_params"][typeof outputType];
    output: QueryProperty<Def>["_output"][typeof outputType];
  };
}
