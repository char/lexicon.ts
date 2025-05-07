import { Simplify } from "./_util.ts";
import { InferDefinition } from "./infer.ts";
import { AnyDefinition, _AnyUniverse } from "./lexicon.ts";

export type ObjectDefinition = {
  type: "object";
  required?: string[];
  nullable?: string[];
  properties: Record<string, AnyDefinition>;
};

type _MaybeUndefined<T, K, Required> = K extends Required ? T : T | undefined;
type _MaybeNullable<T, K, Nullable> = K extends Nullable ? T | null : T;
type _ApplyModifiers<T, K, Required, Nullable> = _MaybeNullable<_MaybeUndefined<T, K, Required>, K, Nullable>;

type _InferObject<U extends _AnyUniverse, Path extends string, Def extends ObjectDefinition, RequiredFieldNames extends string, NullableFieldNames extends string> = Simplify<
  { [K in keyof Def["properties"]]:
    _ApplyModifiers<
      InferDefinition<U, Path, Def["properties"][K]>,
      K, RequiredFieldNames, NullableFieldNames
    >
  }
>;

type Options<R extends string[] | undefined> = R extends string[] ? R[number] : never;
export type InferObject<U extends _AnyUniverse, Path extends string, Def extends ObjectDefinition> =
  _InferObject<U, Path, Def, Options<Def["required"]>, Options<Def["nullable"]>>;
