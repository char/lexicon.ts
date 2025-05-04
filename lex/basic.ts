import { Cid } from "./string.ts";

export type IntegerDefinition = {
  type: "integer";
  minimum?: number;
  maximum?: number;
  enum?: number[];
};
export type BooleanDefinition = { type: "boolean"; }
export type BytesDefinition = {
  type: "bytes";
  minLength?: number;
  maxLength?: number;
}
export type CidLinkDefinition = { type: "cid-link"; }

export type InferInteger<Def extends IntegerDefinition> = number;
export type InferBoolean<Def extends BooleanDefinition> = boolean;
export type InferBytes<Def extends BytesDefinition> = Uint8Array;
export type InferCidLink<Def extends CidLinkDefinition> = Cid;
