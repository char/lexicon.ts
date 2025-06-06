import { Infer, MakeLexiconUniverse } from "@char/lexicon.ts";

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

type U = MakeLexiconUniverse<[typeof GREETING_LEXICON]>;

type Greeting = Infer<U, "com.example.hello-world.greeting">;
