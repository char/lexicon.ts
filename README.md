# lexicon.ts

typescript trickshot for [ATProto Lexicon](https://atproto.com/specs/lexicon) definitions.

- infers types from lexicon definitions
- follows refs / unions within a lexicon universe

## example

```typescript
import { Infer, MakeLexiconUniverse, Unconstify } from "@char/lexicon.ts";

const GREETING_LEXICON = {
  "lexicon": 1,
  "id": "com.example.hello-world.greeting",
  "defs": {
    "main": {
      "type": "record",
      "key": "tid",
      "record": {
        "type": "object",
        "required": ["who", "createdAt"],
        "properties": {
          "who": { "type": "string", "format": "did" },
          "createdAt": { "type": "string", "format": "datetime" }
        }
      }
    }
  }
} as const;
type GreetingLexicon = Unconstify<typeof GREETING_LEXICON>;

type U = MakeLexiconUniverse<[GreetingLexicon]>;

type Greeting = Infer<U, "com.example.hello-world.greeting">;
/* => {
  "$type": "com.example.hello-world.greeting",
  "who": `did:${string}`,
  "createdAt": DateTimeString
} */
```

## use `com.atproto` / `app.bsky` types

```shell
lexicon.ts/ $ # one command to do a little setup:
lexicon.ts/ $ deno task gen:atproto
lexicon.ts/ $ # ./pkg/atproto-lexica/ now exists
```

```typescript
import { Infer } from "@char/lexicon.ts";

// imports from pkg/atproto-lexica/mod.ts:
import { ATProtoUniverse } from "@char/lexicon.ts/atproto";

type Post = Infer<ATProtoUniverse, "app.bsky.feed.post">;
/* => {
  $type: "app.bsky.feed.post";
  text: string;
  createdAt: DateTimeString;
  entities?: {
    index: { start: number; end: number; };
    type: string;
    value: string;
  }[];
  facets?: {
    index: { byteStart: number; byteEnd: number; };
    features: ({
      $type: "app.bsky.richtext.facet#mention";
      did: `did:${string}`;
    } | {
      $type: "app.bsky.richtext.facet#link";
      uri: URIString;
    } | {
      $type: "app.bsky.richtext.facet#tag";
      tag: string;
    })[];
  }[];
  reply?: {
    root: { uri: `at://${string}`; cid: CIDString; };
    parent: { uri: `at://${string}`; cid: CIDString; };
  };
  ...
} */
```
