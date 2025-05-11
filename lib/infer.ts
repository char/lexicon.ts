import { ArrayDefinition, InferArray } from "./definitions/array.ts";
import { BooleanDefinition, BytesDefinition, InferBoolean, InferBytes, InferInteger, InferUnknown, IntegerDefinition, UnknownDefinition } from "./definitions/basic.ts";
import { BlobDefinition, CIDLinkDefinition, InferBlob, InferCIDLink } from "./definitions/ipld.ts";
import { InferObject, ObjectDefinition } from "./definitions/object.ts";
import { InferRecord, RecordDefinition } from "./definitions/record.ts";
import { InferRef, RefDefinition } from "./definitions/ref.ts";
import { InferRPC, RPCDefinition } from "./definitions/rpc.ts";
import { InferString, StringDefinition } from "./definitions/string.ts";
import { InferUnion, UnionDefinition } from "./definitions/union.ts";
import { LexiconDefinition } from "./lexicon.ts";
import { SplitPath } from "./path.ts";
import { LexiconUniverse } from "./universe.ts";
import { Simplify } from "./util.ts";

export type InferDefinition<
  U extends LexiconUniverse,
  Path extends string,
  Def extends LexiconDefinition,
  Required
> =
    Def extends BooleanDefinition ? InferBoolean<Def, Required>
  : Def extends IntegerDefinition ? InferInteger<Def, Required>
  : Def extends BytesDefinition ? InferBytes<Def, Required>
  : Def extends UnknownDefinition ? InferUnknown<Def, Required>
  : Def extends CIDLinkDefinition ? InferCIDLink<Def, Required>
  : Def extends BlobDefinition ? InferBlob<Def, Required>
  : Def extends StringDefinition ? InferString<Def, Required>
  : Def extends ArrayDefinition ? InferArray<U, Path, Def, Required>
  : Def extends ObjectDefinition ? InferObject<U, Path, Def, Required>
  : Def extends RecordDefinition ? InferRecord<U, Path, Def>
  : Def extends RefDefinition ? InferRef<U, Path, Def, Required>
  : Def extends UnionDefinition ? InferUnion<U, Path, Def, Required>
  : Def extends RPCDefinition ? InferRPC<U, Path, Def>
  : unknown;

export type Infer<U extends LexiconUniverse, Path extends (keyof U & string) | (string & {}), Required = true> = Simplify<
  SplitPath<Path> extends [infer LexId extends keyof U, infer DefName extends string] ?
    U[LexId]["defs"][DefName] extends infer Def extends LexiconDefinition
      ? InferDefinition<U, Path, Def, Required>
      : never
    : never
>;
