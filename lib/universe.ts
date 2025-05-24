import { SplitPath } from "./path.ts";
import { Simplify } from "./util.ts";

export interface LexiconV1 {
  readonly lexicon: "1" | 1;
  readonly id: string;
  readonly defs: Record<string, any>;
}

export type AnyUniverse = Record<string, LexiconV1>;
export type MakeLexiconUniverse<Lexica extends LexiconV1[]> = { [K in Lexica[number]["id"]]: Simplify<Lexica[number] & { "id": K }> };

export type ExtractFromUniverse<U extends AnyUniverse, At extends string> =
  U[SplitPath<At>[0]]["defs"][SplitPath<At>[1]]
