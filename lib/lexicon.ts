export type LexiconDefinition = { type: string };

export type LexiconV1 = {
  lexicon: "1" | 1;
  id: string;
  defs: Record<string, LexiconDefinition | undefined>;
};
