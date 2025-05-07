import { Simplify } from "./_util.ts";
import { AnyDefinition } from "./definition.ts";


export type LexiconV1 = {
  lexicon: "1" | 1;
  id: string;
  defs: Record<string, AnyDefinition | undefined>;
};

export type LexiconUniverse<Lexicons extends LexiconV1[]> =
  { [K in Lexicons[number]["id"]]: Simplify<Lexicons[number] & { "id": K }> };
