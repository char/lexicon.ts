import { InferDefinition } from "../infer.ts";
import { LexiconDefinition } from "../lexicon.ts";
import { LexiconUniverse } from "../universe.ts";
import { PartialOnUndefined, Simplify } from "../util.ts";
import { ArrayDefinition } from "./array.ts";
import { BooleanDefinition, IntegerDefinition, UnknownDefinition } from "./basic.ts";
import { ObjectDefinition } from "./object.ts";
import { RefDefinition } from "./ref.ts";
import { StringDefinition } from "./string.ts";
import { UnionDefinition } from "./union.ts";

type UnitaryRPCParameterPropertyDefinition = BooleanDefinition | IntegerDefinition | StringDefinition | UnknownDefinition;
type RPCParameterPropertyDefinition = UnitaryRPCParameterPropertyDefinition | ArrayDefinition<UnitaryRPCParameterPropertyDefinition>;

export type RPCParamsDefinition = {
  type: "params";
  required?: string[];
  properties: Record<string, RPCParameterPropertyDefinition>;
};

type _InferRPCParams<U extends LexiconUniverse, Path extends string, Def extends RPCParamsDefinition, RequiredPropertyNames extends string> =
  Simplify<
    PartialOnUndefined<{
      [K in keyof Def["properties"]]: InferDefinition<
        U, Path, Def["properties"][K],
        K extends RequiredPropertyNames ? true : false
      >
    }>
  >;
export type InferRPCParams<U extends LexiconUniverse, Path extends string, Def extends RPCParamsDefinition> =
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

export type InferRPC<U extends LexiconUniverse, Path extends string, Def extends RPCDefinition> = Simplify<
  {
    parameters: Def["parameters"] extends RPCParamsDefinition ? InferRPCParams<U, Path, Def["parameters"]> : undefined;
    output: Def["output"] extends RPCObjectDefinition
      ? Def["output"]["schema"] extends LexiconDefinition
        ? InferDefinition<U, Path, Def["output"]["schema"], true>
        : undefined
      : undefined;
    input: Def extends ProcedureDefinition
      ? Def["input"] extends RPCObjectDefinition
        ? Def["input"]["schema"] extends LexiconDefinition
          ? InferDefinition<U, Path, Def["input"]["schema"], true>
          : undefined
        : undefined
      : never;
  }
>;
