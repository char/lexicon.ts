import { inputType, outputType, Property } from "../property.ts";
import { CIDString } from "./string.ts";

export interface CIDLinkDefinition {
  readonly type: "cid-link";
}

export interface CIDLink {
  readonly $link: CIDString;
}

export interface CIDLinkProperty extends Property<CIDLink> {
}

export interface BlobDefinition {
  readonly type: "blob";
  readonly accept?: readonly string[];
  readonly maxSize?: number;
}

export interface BlobRef<MimeType extends string = string> {
  readonly $type: "blob";
  readonly mimeType: MimeType;
  readonly ref: CIDLink;
  readonly size: number;
}

export interface LegacyBlobRef<MimeType extends string = string> {
  readonly cid: CIDString;
  readonly mimeType: MimeType;
}

export type AnyBlobRef<MimeType extends string = string> = BlobRef<MimeType> | LegacyBlobRef<MimeType>;

export type InferWildcard<MimeType extends string> = MimeType extends `${infer Prefix}/*` ? `${Prefix}/${string}` : MimeType;

export interface BlobProperty<Def extends BlobDefinition> extends Property<AnyBlobRef> {
  mime: Def["accept"] extends readonly string[] ? { [K in keyof Def["accept"] & number]: InferWildcard<Def["accept"][K]> }[number] : string;

  readonly kind: "blob";
  readonly [inputType]: AnyBlobRef<this["mime"]>;
  readonly [outputType]: AnyBlobRef<this["mime"]>;
}
