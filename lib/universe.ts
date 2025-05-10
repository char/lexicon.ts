import { LexiconV1 } from "./lexicon.ts";
import { Simplify } from "./util.ts";

export type LexiconUniverse = Record<string, LexiconV1>;
export type MakeLexiconUniverse<Lexica extends LexiconV1[]> =
  { [K in Lexica[number]["id"]]: Simplify<Lexica[number] & { "id": K }> };
