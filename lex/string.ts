export type StringDefinition = {
  type: "string";
  format?: string;
  maxLength?: number;
  minLength?: number;
  maxGraphemes?: number;
  minGraphemes?: number;
};

export type CidString = string & {};
export type DateTimeString = string & {};
export type HandleString = string & {};
export type NsidString = string & {};
export type TidString = string & {};
export type RecordKeyString = string & {};
export type URIString = string & {};

export type InferString<Def extends StringDefinition> =
  Def["format"] extends `literal:${infer L}` ? L :
  {
    "at-uri": `at://${string}`;
    cid: CidString;
    datetime: DateTimeString;
    did: `did:${string}`;
    handle: HandleString;
    nsid: NsidString;
    tid: TidString;
    "record-key": RecordKeyString;
    uri: URIString;
    [_: string]: string;
  }[EmptyIfUndefined<Def["format"]>]

type EmptyIfUndefined<S extends string | undefined> =
  S extends undefined ? "" : S;
