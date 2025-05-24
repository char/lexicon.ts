import { DereferenceDeep, InferProperty } from "../infer.ts";
import { ResolvePath } from "../path.ts";
import { defaultType, inputType, outputType, Property } from "../property.ts";
import { AnyUniverse, ExtractFromUniverse } from "../universe.ts";


export interface RefDefinition {
  readonly type: "ref";
  readonly ref: string;
}

export interface RefProperty<Def extends RefDefinition> extends Property {
  readonly kind: "ref";

  readonly [inputType]: this;
  readonly [outputType]: this;
  readonly [defaultType]: never;
}

export interface RefPropertyWithUniverse<Def extends RefDefinition, U extends AnyUniverse, FromPath extends string> extends Property {
  readonly resolvedPath: ResolvePath<FromPath, Def["ref"]>;
  readonly referentProperty: InferProperty<ExtractFromUniverse<U, this["resolvedPath"]>>;

  readonly [inputType]: DereferenceDeep<this["resolvedPath"], this["referentProperty"][typeof inputType], U, typeof inputType>;
  readonly [outputType]: DereferenceDeep<this["resolvedPath"], this["referentProperty"][typeof outputType], U, typeof outputType>;
  readonly [defaultType]: this["referentProperty"][typeof defaultType]; // TODO: dereference
}

export interface UnionDefinition {
  readonly type: "union";
  readonly refs: readonly string[];
}

export interface UnionProperty<Def extends UnionDefinition> extends Property {
  readonly kind: "union";

  readonly [inputType]: this;
  readonly [outputType]: this;
  readonly [defaultType]: never;
}

export interface UnionPropertyWithUniverse<Def extends UnionDefinition, U extends AnyUniverse, FromPath extends string> extends Property {
  readonly resolvedPaths: { [R in Def["refs"][number]]: ResolvePath<FromPath, R> }[Def["refs"][number]];
  readonly referentProperties: { [R in this["resolvedPaths"]]: InferProperty<ExtractFromUniverse<U, R>> }[this["resolvedPaths"]];

  readonly [ inputType]: { [Path in this["resolvedPaths"]]: { "$type": Path } & DereferenceDeep<Path, InferProperty<ExtractFromUniverse<U, Path>>[typeof  inputType], U, typeof  inputType> }[this["resolvedPaths"]];
  readonly [outputType]: { [Path in this["resolvedPaths"]]: { "$type": Path } & DereferenceDeep<Path, InferProperty<ExtractFromUniverse<U, Path>>[typeof outputType], U, typeof outputType> }[this["resolvedPaths"]];
  readonly [defaultType]: this["referentProperties"][typeof defaultType];
}
