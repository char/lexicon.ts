import { Infer, LexiconV1 } from "@char/lexicon.ts";
import type { ATProtoUniverse } from "@char/lexicon.ts/atproto";
import { createValidator, LexiconLookupFunction } from "./validate.ts";

const lookupATProtoLexicon: LexiconLookupFunction<ATProtoUniverse> =
  async (lexId: string): Promise<LexiconV1> => {
    const mod = await import("../atproto-lexica/" + lexId.replaceAll(".", "/") + ".ts");
    const lexicon = mod["$ Definition"] as LexiconV1;
    return lexicon;
  }
const validatePost = await createValidator(lookupATProtoLexicon, "app.bsky.feed.post");

const x: unknown = {
  "$type": "app.bsky.feed.post",
  text: "this sucks im going to start running the charlotte patchset for zsh . or switch to oils or fish or nu or something lol",
  langs: ["en"],
  reply: {
    root: {
      cid: "bafyreiawdt3hvu66zl2ux4pzgn72o2duqud3jr3z3hxok7bhnfrz6pbnwa",
      uri: "at://did:plc:7x6rtuenkuvxq3zsvffp2ide/app.bsky.feed.post/3lpk2rivkx22u"
    },
    parent: {
      cid: "bafyreiabn4d7gxyudom7hcnocy56uxcoyr3x3aw46jmew5wrggdvofl5ce",
      uri: "at://did:plc:x4iqnv4ddig4jeogzfbncvsu/app.bsky.feed.post/3lpkbnhbc2k2b"
    }
  },
  createdAt: "2025-05-19T23:30:25.255Z"
};

const validPost = validatePost(x);
type IsPost<_ extends Infer<ATProtoUniverse, "app.bsky.feed.post">> = void;
type _Assert = IsPost<typeof validPost>;
