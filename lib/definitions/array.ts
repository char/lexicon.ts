import { InferDefinition } from "../infer.ts";
import { LexiconDefinition } from "../lexicon.ts";
import { LexiconUniverse } from "../universe.ts";
import { WithDefault } from "../util.ts";

export type ArrayDefinition<Items extends LexiconDefinition = LexiconDefinition> = {
  type: "array";
  items: Items;
  minLength?: number;
  maxLength?: number;
}

export type InferArray<U extends LexiconUniverse, Path extends string, Def extends ArrayDefinition, Required> =
  Def extends ArrayDefinition<infer Items>
    ? WithDefault<InferDefinition<U, Path, Items, true>[], undefined, Required>
    : never;
