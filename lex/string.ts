export type StringDefinition = {
  type: "string";
  format?: string;
  maxLength?: number;
  minLength?: number;
  maxGraphemes?: number;
  minGraphemes?: number;
  knownValues?: string[];
  enum?: string[];
};

export type Cid = string & {};
export type DateTime = string & {};
export type Handle = string & {};
export type NSID = string & {};
export type TidString = string & {};
export type RecordKeyString = string & {};
export type URIString = string & {};

export type InferString<Def extends StringDefinition> =
  Def["format"] extends `literal:${infer L}` ? L :
  {
    "at-uri": `at://${string}`;
    cid: Cid;
    datetime: DateTime;
    did: `did:${string}`;
    handle: Handle;
    nsid: NSID;
    tid: TidString;
    "record-key": RecordKeyString;
    uri: URIString;
    [_: string]: string;
  }[EmptyIfUndefined<Def["format"]>]

type EmptyIfUndefined<S extends string | undefined> =
  S extends undefined ? "" : S;
