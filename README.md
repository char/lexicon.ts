# lexicon.ts

typescript trickshot for [ATProto Lexicon](https://atproto.com/specs/lexicon) definitions.

just for fun (for now!) ^-^

- infers types for records
- follows refs / unions
- no `query` / `procedure` types yet
- no handling of defaults / consts
- no `array` yet

## example

```typescript
// 1. paste your lexicon JSON as a type definition:
type HelloWorld = {
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
  },
};

// 2. construct a lexicon universe
type U = LexiconUniverse<[HelloWorld]>;

// 3. use Infer<> to resolve types from your Lexicon
type Greeting = Infer<U, "com.example.hello-world.greeting">
/* => {
    "$type": "com.example.hello-world.greeting",
    "who": `did:${string}`,
    "createdAt": DateTimeString
  } */
```

## roadmap

idk lol im just playing touys with the typescript compiler. but i might end up doing my own validation codegen at some point
