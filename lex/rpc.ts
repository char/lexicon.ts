import { Simplify } from "./_util.ts";
import { ArrayDefinition } from "./array.ts";
import { BooleanDefinition, IntegerDefinition } from "./basic.ts";
import { _AnyUniverse, AnyDefinition } from "./definition.ts";
import { InferDefinition } from "./infer.ts";
import { ObjectDefinition } from "./object.ts";
import { RefDefinition } from "./ref.ts";
import { StringDefinition } from "./string.ts";
import { UnionDefinition } from "./union.ts";

export type RPCParamsDefinition = {
  type: "params";
  required?: string[];
  properties: Record<string, BooleanDefinition | IntegerDefinition | StringDefinition | ArrayDefinition>;
};

type _MaybeUndefined<T, K, Required> = K extends Required ? T : T | undefined;
type _InferRPCParams<U extends _AnyUniverse, Path extends string, Def extends RPCParamsDefinition, RequiredPropertyNames extends string> = Simplify<
  { [K in keyof Def["properties"]]:
    _MaybeUndefined<
      InferDefinition<U, Path, Def["properties"][K]>,
      K, RequiredPropertyNames
    >
  }
>;
export type InferRPCParams<U extends _AnyUniverse, Path extends string, Def extends RPCParamsDefinition> =
  _InferRPCParams<
    U, Path, Def,
    Def["required"] extends string[] ? Def["required"][number] : never
  >;

export type RPCObjectDefinition = {
  encoding: "application/json" | string & {};
  schema?: ObjectDefinition | RefDefinition | UnionDefinition;
};

type QueryDefinition = {
  type: "query";
  parameters?: RPCParamsDefinition;
  output?: RPCObjectDefinition;
}

type ProcedureDefinition = {
  type: "procedure";
  parameters?: RPCParamsDefinition;
  output?: RPCObjectDefinition;
  input?: RPCObjectDefinition;
}

export type RPCDefinition = QueryDefinition | ProcedureDefinition;

export type InferRPC<U extends _AnyUniverse, Path extends string, Def extends RPCDefinition> = Simplify<
  {
    parameters: Def["parameters"] extends RPCParamsDefinition ? InferRPCParams<U, Path, Def["parameters"]> : undefined;
    output: Def["output"] extends RPCObjectDefinition
      ? Def["output"]["schema"] extends AnyDefinition
        ? InferDefinition<U, Path, Def["output"]["schema"]>
        : undefined
      : undefined;
    input: Def extends ProcedureDefinition
      ? Def["input"] extends RPCObjectDefinition
        ? Def["input"]["schema"] extends AnyDefinition
          ? InferDefinition<U, Path, Def["input"]["schema"]>
          : undefined
        : undefined
      : never;
  }
>;
