import type { LexiconDefinition, LexiconV1 } from "@char/lexicon.ts";
import { ArrayDefinition } from "@char/lexicon.ts/definitions/array.ts";
import { BooleanDefinition, BytesDefinition, IntegerDefinition } from "@char/lexicon.ts/definitions/basic.ts";
import { CIDLinkDefinition } from "@char/lexicon.ts/definitions/ipld.ts";
import type { ObjectDefinition } from "@char/lexicon.ts/definitions/object.ts";
import { RecordDefinition } from "@char/lexicon.ts/definitions/record.ts";
import { RefDefinition } from "@char/lexicon.ts/definitions/ref.ts";
import { StringDefinition } from "@char/lexicon.ts/definitions/string.ts";
import { UnionDefinition } from "@char/lexicon.ts/definitions/union.ts";
import * as z from "@zod/mini";

export interface LexiconValidationContext {
  mode: "cbor" | "json";
  path: string;
  lookupLexicon(lexId: string): Promise<LexiconV1 | undefined>;
}

type Context = LexiconValidationContext;

const splitPath = (path: string): [lex: string, def: string] => {
  const delim = path.lastIndexOf("#")
  if (delim === -1) return [path, "main"];
  return [path.substring(0, delim), path.substring(delim + 1)];
}

const joinPath = (lex: string, def: string) => {
  if (def === "main") return lex;
  return `${lex}#${def}`;
}

export const createSchema = async (ctx: Context, def: LexiconDefinition): Promise<z.ZodMiniType> => {
  if (def.type === "null") return z.null();
  if (def.type === "boolean") {
    const b = def as BooleanDefinition;
    if (b.const !== undefined) return z.literal(b.const);
    if (b.default !== undefined) return z._default(z.boolean(), b.default);
    return z.boolean();
  }
  if (def.type === "integer") {
    const i = def as IntegerDefinition;
    if (i.const !== undefined) return z.literal(i.const);

    const checks = [];
    if (i.minimum) checks.push(z.minimum(i.minimum));
    if (i.maximum) checks.push(z.maximum(i.maximum));
    if (i.enum) checks.push(z.refine(v => typeof v === "number" && i.enum!.includes(v)))

    if (i.default) return z._default(z.int().check(...checks), i.default);
    return z.int().check(...checks);
  }
  if (def.type === "bytes") return createBytesSchema(ctx, def as BytesDefinition);
  if (def.type === "unknown") return z.unknown();
  if (def.type === "cid-link") return createCidLinkSchema(def as CIDLinkDefinition);
  // blob
  if (def.type === "string") return createStringSchema(def as StringDefinition);
  if (def.type === "array") {
    const arr = def as ArrayDefinition;
    const checks = [];
    if (arr.minLength !== undefined) checks.push(z.minLength(arr.minLength));
    if (arr.maxLength !== undefined) checks.push(z.maxLength(arr.maxLength));
    const subschema = await createSchema(ctx, arr.items);
    return z.array(subschema).check(...checks);
  }
  if (def.type === "object") return await createObjectSchema(ctx, def as ObjectDefinition);
  if (def.type === "record") return await createRecordSchema(ctx, def as RecordDefinition);
  if (def.type === "ref") {
    const ref = def as RefDefinition;
    return await createRelativeSchema(ctx, ref.ref);
  }
  if (def.type === "union") {
    const union = def as UnionDefinition;
    const subschemae = (await Promise.all(union.refs.map(async ref => [
      resolveRelativePath(ctx, ref),
      await createRelativeSchema(ctx, ref)
    ] as const))).map(([type, subschema]) => { // add $type if it's an object
      if (subschema._zod.traits.has("ZodMiniObject")) {
        return z.extend(subschema as z.ZodMiniObject, { "$type": z.literal(type) })
      }
      return subschema;
    });
    return z.union(subschemae);
  }
  // procedure / query ?
  return z.unknown();
}

const createBytesSchema = (ctx: Context, _def: BytesDefinition): z.ZodMiniType => {
  // TODO: check lengths

  if (ctx.mode === "json") {
    return z.object({ "$bytes": z.string() });
  }
  if (ctx.mode === "cbor") {
    return z.unknown().check(z.refine(v => v instanceof Uint8Array));
  }

  throw new Error("unknown mode for bytes definition");
}

const createCidLinkSchema = (_def: CIDLinkDefinition): z.ZodMiniType => {
  return z.object({ "$link": z.string() });
}

const createStringSchema = (def: StringDefinition): z.ZodMiniType => {
  if (def.const) return z.literal(def.const);
  if (def.enum) return z.enum(def.enum);
  
  const checks = [];
  if (def.maxLength !== undefined) checks.push(z.maxLength(def.maxLength));
  if (def.minLength !== undefined) checks.push(z.minLength(def.minLength));
  // TODO: grapheme length checks (need a lighter lib than graphemer)

  // TODO: format checks

  return z.string().check(...checks);
}

const createObjectSchema = async (ctx: Context, def: ObjectDefinition): Promise<z.ZodMiniObject> => {
  const shape: Record<string, z.ZodMiniType> = {};

  const required = def.required ?? [];
  const nullable = def.nullable ?? [];
  await Promise.all(Object.entries(def.properties).map(async ([prop, subdef]) => {
    let schema = await createSchema(ctx, subdef);
    if (nullable.includes(prop)) schema = z.nullable(schema);
    if (!required.includes(prop)) schema = z.optional(schema);
    shape[prop] = schema;
  }));

  return z.object(shape);
}

const createRecordSchema = async (ctx: Context, def: RecordDefinition): Promise<z.ZodMiniType> => {
  const object = await createObjectSchema(ctx, def.record);
  return z.extend(object, { "$type": z.literal(ctx.path) });
}

const resolveRelativePath = (ctx: Context, ref: string): string => {
  const [pathLex, _pathDef] = splitPath(ctx.path);
  const [refLex, refDef] = splitPath(ref);
  const newLex = refLex || pathLex;
  const newPath = joinPath(newLex, refDef);
  return newPath;
}

const createRelativeSchema = async (ctx: Context, ref: string): Promise<z.ZodMiniType> => {
  const [pathLex, _pathDef] = splitPath(ctx.path);
  const [refLex, refDef] = splitPath(ref);
  const newLex = refLex || pathLex;
  const newPath = joinPath(newLex, refDef);
  const otherLexicon = await ctx.lookupLexicon(newLex);
  if (!otherLexicon) throw new Error("could not resolve lexicon at: " + newLex);
  const otherDef = otherLexicon.defs[refDef];
  if (!otherDef) throw new Error("could not resolve lexicon def at: " + newPath);
  return await createSchema({ ...ctx, path: newPath }, otherDef);
}
