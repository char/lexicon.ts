import { Simplify } from "./_util.ts";
import { ArrayDefinition } from "./array.ts";
import {
  BooleanDefinition,
  BytesDefinition,
  CidLinkDefinition,
  IntegerDefinition,
} from "./basic.ts";
import { ObjectDefinition } from "./object.ts";
import { RecordDefinition } from "./record.ts";
import { RefDefinition } from "./ref.ts";
import { StringDefinition } from "./string.ts";
import { UnionDefinition } from "./union.ts";

export type LexiconV1 = {
  lexicon: "1";
  id: string;
  defs: Record<string, _AnyDef | undefined>;
};

export type LexiconUniverse<Lexicons extends LexiconV1[]> =
  { [K in Lexicons[number]["id"]]: Simplify<Lexicons[number] & { "id": K }> };

export type _AnyU = Record<string, LexiconV1>;

export type _AnyDef =
  | RecordDefinition
  | ObjectDefinition
  | RefDefinition
  | UnionDefinition
  | ArrayDefinition
  | StringDefinition
  | IntegerDefinition
  | BooleanDefinition
  | BytesDefinition
  | CidLinkDefinition;
