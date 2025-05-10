
import { InferDefinition } from "../infer.ts";
import { LexiconDefinition } from "../lexicon.ts";
import { LexiconUniverse } from "../universe.ts";
import { Simplify, WithDefault } from "../util.ts";

export type ObjectDefinition = {
  type: "object";
  required?: string[];
  nullable?: string[];
  properties: Record<string, LexiconDefinition>;
};


type _MaybeNullable<T, K, Nullable> = K extends Nullable ? T | null : T;

type _InferObject<
  U extends LexiconUniverse, Path extends string, Def extends ObjectDefinition,
  Required,
  RequiredFieldNames extends string, NullableFieldNames extends string,
> = Simplify<
  WithDefault<
    { [K in keyof Def["properties"]]:
        _MaybeNullable<
          InferDefinition<U, Path, Def["properties"][K],
            K extends RequiredFieldNames ? true : false>,
          K, NullableFieldNames>},
    undefined, Required
  >
>;

type Options<R extends string[] | undefined> = R extends string[] ? R[number] : never;
export type InferObject<
  U extends LexiconUniverse, Path extends string,
  Def extends ObjectDefinition,
  Required,
> = _InferObject<
  U, Path, Def,
  Required,
  Options<Def["required"]>, Options<Def["nullable"]>
>;
