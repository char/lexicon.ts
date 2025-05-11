import { Infer } from "@char/lexicon.ts";

// imports from pkg/atproto-lexica/mod.ts:
import { ATProtoUniverse } from "@char/lexicon.ts/atproto";

type Post = Infer<ATProtoUniverse, "app.bsky.feed.post">;
