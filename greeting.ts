import { Infer, LexiconUniverse, Unconstify } from "./lex/mod.ts";

export const GREETING_LEXICON = {
  "lexicon": "1",
  "id": "com.example.hello-world.greeting",
  "defs": {
    "main": {
      "type": "record",
      "description": "Greeting record.",
      "key": "tid",
      "record": {
        "type": "object",
        "required": ["who", "createdAt"],
        "properties": {
          "who": {
            "type": "string",
            "description": "Who to greet.",
            "format": "did"
          },
          "createdAt": {
            "type": "string",
            "format": "datetime"
          }
        }
      }
    }
  }
} as const;

type U = LexiconUniverse<[Unconstify<typeof GREETING_LEXICON>]>;






type Greeting = Infer<U, "com.example.hello-world.greeting">
type _ = Greeting;
