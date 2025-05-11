import { WithDefault } from "../util.ts";
import { CIDString } from "./string.ts";

export type CIDLink = { "$link": CIDString } & {};
export type BlobRef = (
  | { "$type": "blob"; ref: CIDLink; mimeType: string; size: number; }
  | { cid: CIDString; mimeType: string }
) & {};

export type CIDLinkDefinition = { type: "cid-link"; };
export type InferCIDLink<_Def extends CIDLinkDefinition, Required> =
  WithDefault<CIDLink, undefined, Required>;

export type BlobDefinition = { type: "blob"; accept?: string[]; maxSize?: number; };
export type InferBlob<_Def extends BlobDefinition, Required> =
  WithDefault<BlobRef, undefined, Required>;
