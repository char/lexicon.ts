import { Property, defaultType, inputType, outputType } from "../property.ts";

export interface StringDefinition {
  readonly type: "string";
  readonly enum?: readonly string[];
  readonly knownValues?: readonly string[];
  readonly const?: string;
  readonly format?: | "at-identifier" | "at-uri" | "cid" | "datetime"
                    | "did" | "handle" | "nsid" | "tid" | "record-key"
                    | "uri" | "language";
  readonly default?: string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly minGraphemes?: number;
  readonly maxGraphemes?: number;
}

export interface StringProperty<Def extends StringDefinition> extends Property<string> {
  readonly kind: "string";
  readonly [inputType]:
      Def["enum"] extends readonly string[] ? Def["enum"][number]
    : Def["const"] extends string ? Def["const"]
    : Def["knownValues"] extends readonly string[] ? (Def["knownValues"][number] | (string & {}))
    : InferStringValue<Def["format"]>;
  readonly [defaultType]: Def["default"] extends string ? Def["default"] : never;
  readonly [outputType]: this[typeof inputType];
}

declare const format: unique symbol;

export type CIDString = string & { [format]?: "cid" };
export type HandleString = string & { [format]?: "handle" };
export type DateTimeString = string & { [format]?: "datetime" };
export type NSIDString = string & { [format]?: "nsid" };
export type TIDString = string & { [format]?: "tid" };
export type RecordKeyString = string & { [format]?: "rkey" };
export type URIString = string & { [format]?: "uri" };
export type LanguageCode = string & { [format]?: "language" };

type InferStringValue<Format extends StringDefinition["format"]> =
  undefined extends Format
    ? string
  : {
    "at-identifier": HandleString | `did:${string}`;
    "at-uri": `at://${string}`;
    "cid": CIDString;
    "datetime": DateTimeString;
    "did": `did:${string}`;
    "handle": HandleString;
    "nsid": NSIDString;
    "tid": TIDString;
    "record-key": RecordKeyString;
    "uri": URIString;
    "language": LanguageCode;
  }[Format & {}]
