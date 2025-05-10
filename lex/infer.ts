import { Simplify } from "./_util.ts";
import { ArrayDefinition, InferArray } from "./array.ts";
import {
  BooleanDefinition,
  BytesDefinition,
  CidLinkDefinition,
  InferBoolean,
  InferBytes,
  InferCidLink,
  InferInteger,
  InferUnknown,
  IntegerDefinition,
  UnknownDefinition
} from "./basic.ts";
import { AnyDefinition, _AnyUniverse } from "./definition.ts";
import { InferObject, ObjectDefinition } from "./object.ts";
import { SplitPath } from "./path.ts";
import { InferRecord, RecordDefinition } from "./record.ts";
import { InferRef, RefDefinition } from "./ref.ts";
import { InferRPC, RPCDefinition } from "./rpc.ts";
import { InferString, StringDefinition } from "./string.ts";
import { InferUnion, UnionDefinition } from "./union.ts";

export type InferDefinition<U extends _AnyUniverse, Path extends string, Def extends AnyDefinition> =
    Def extends StringDefinition ? InferString<Def>
  : Def extends IntegerDefinition ? InferInteger<Def>
  : Def extends BooleanDefinition ? InferBoolean<Def>
  : Def extends BytesDefinition ? InferBytes<Def>
  : Def extends CidLinkDefinition ? InferCidLink<Def>
  : Def extends UnknownDefinition ? InferUnknown<Def>
  : Def extends RecordDefinition ? InferRecord<U, Path, Def>
  : Def extends ObjectDefinition ? InferObject<U, Path, Def>
  : Def extends RefDefinition ? InferRef<U, Path, Def>
  : Def extends UnionDefinition ? InferUnion<U, Path, Def>
  : Def extends ArrayDefinition ? InferArray<U, Path, Def>
  : Def extends RPCDefinition ? InferRPC<U, Path, Def>
  : unknown;

export type Infer<U extends _AnyUniverse, Path extends (keyof U & string) | (string & {})> = Simplify<
  SplitPath<Path> extends [infer LexId extends keyof U, infer DefName extends string] ?
    U[LexId]["defs"][DefName] extends infer Def extends AnyDefinition
      ? InferDefinition<U, Path, Def>
      : never
    : never
>;
