import { ArrayDefinition } from "./array.ts";
import {
  BooleanDefinition,
  BytesDefinition,
  CidLinkDefinition,
  IntegerDefinition,
  UnknownDefinition,
} from "./basic.ts";
import { LexiconV1 } from "./lexicon.ts";
import { ObjectDefinition } from "./object.ts";
import { RecordDefinition } from "./record.ts";
import { RefDefinition } from "./ref.ts";
import { RPCDefinition } from "./rpc.ts";
import { StringDefinition } from "./string.ts";
import { UnionDefinition } from "./union.ts";

export type _AnyUniverse = Record<string, LexiconV1>;

export type KnownDefinition = 
  | StringDefinition
  | IntegerDefinition
  | BooleanDefinition
  | BytesDefinition
  | CidLinkDefinition
  | UnknownDefinition
  | RecordDefinition
  | ObjectDefinition
  | RefDefinition
  | UnionDefinition
  | ArrayDefinition
  | RPCDefinition;

export type AnyDefinition =
  | KnownDefinition
  | { type: unknown };

export const isKnownDefinitionType = (def: AnyDefinition): def is KnownDefinition =>
  typeof def.type === "string" &&
  [
    "string", "boolean", "object", "record",
    "array", "union", "ref", "integer", "bytes",
    "cid-link"
  ].includes(def.type)
