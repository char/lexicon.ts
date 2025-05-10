import { IsDefinedAndKnown, WithDefault } from "../util.ts";

export type StringDefinition = {
  type: "string";
  format?:
    | "at-identifier" | "at-uri" | "cid" | "datetime"
    | "did" | "handle" | "nsid" | "tid" | "record-key"
    | "uri" | "language";
  maxLength?: number;
  minLength?: number;
  maxGraphemes?: number;
  minGraphemes?: number;
  knownValues?: string[];
  enum?: string[];
  default?: string;
  const?: string;
}

export type CIDString = string & {};
export type HandleString = string & {};
export type DateTimeString = string & {};
export type NSIDString = string & {};
export type TIDString = string & {};
export type RecordKeyString = string & {};
export type URIString = string & {};
export type LanguageCode = string & {};

type _StringType<Format extends StringDefinition["format"]> =
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
  }[Format & {}];

export type InferString<Def extends StringDefinition, Required> =
  Def["knownValues"] extends string[]
    ? Def["knownValues"][number] | (_StringType<Def["format"]> & {})
  : Def["enum"] extends string[]
    ? Def["enum"][number]
  : IsDefinedAndKnown<Def["const"]> extends true
    ? Def["const"]
  : WithDefault<_StringType<Def["format"]>, Def["default"], Required>;
