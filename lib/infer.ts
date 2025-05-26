import { ArrayDefinition, ArrayProperty } from "./definitions/array.ts";
import { BooleanDefinition, BooleanProperty, IntegerDefinition, IntegerProperty } from "./definitions/basic.ts";
import { ObjectDefinition, ObjectProperty } from "./definitions/object.ts";
import { RecordDefinition, RecordProperty, RecordPropertyWithPath } from "./definitions/record.ts";
import { RefDefinition, RefProperty, RefPropertyWithUniverse, UnionDefinition, UnionProperty, UnionPropertyWithUniverse } from "./definitions/ref-union.ts";
import { StringDefinition, StringProperty } from "./definitions/string.ts";
import { SplitPath } from "./path.ts";
import { inputType, outputType, Property } from "./property.ts";
import { AnyUniverse } from "./universe.ts";

export type InferProperty<T extends any> =
    T extends StringDefinition ? StringProperty<T>
  : T extends IntegerDefinition ? IntegerProperty<T>
  : T extends BooleanDefinition ? BooleanProperty<T>
  : T extends ObjectDefinition ? ObjectProperty<T>
  : T extends ArrayDefinition ? ArrayProperty<T>
  : T extends RefDefinition ? RefProperty<T>
  : T extends UnionDefinition ? UnionProperty<T>
  : T extends RecordDefinition ? RecordProperty<T>
  : T extends Property ? T
  : never;

type InferenceSymbol = typeof inputType | typeof outputType;

type PreserveNullability<Base, T> = undefined extends Base ? T | undefined : T;

export type DereferenceDeep<Path extends string, T extends object, U extends AnyUniverse, I extends InferenceSymbol> =
  { [K in keyof T]:
      NonNullable<T[K]> extends (string | number | boolean) ? T[K]
    : NonNullable<T[K]> extends RefProperty<infer Def>
      ? PreserveNullability<T[K], RefPropertyWithUniverse<Def, U, Path>[I]>
    : NonNullable<T[K]> extends UnionProperty<infer Def>
      ? PreserveNullability<T[K], UnionPropertyWithUniverse<Def, U, Path>[I]>
    : NonNullable<T[K]> extends RecordProperty<infer Def>
      ? PreserveNullability<T[K], DereferenceDeep<Path, RecordPropertyWithPath<Def, Path>[I], U, I>>
    : NonNullable<T[K]> extends object ? PreserveNullability<T[K], DereferenceDeep<Path, NonNullable<T[K]>, U, I>>
    : T[K] }

type _Infer<U extends AnyUniverse, Path extends string, I extends InferenceSymbol> =
  DereferenceDeep<
    Path,
    { root: InferProperty<U[SplitPath<Path>[0]]["defs"][SplitPath<Path>[1]]>[I] },
    U, I
  >["root"];

export type Infer<U extends AnyUniverse, Path extends string> =
  _Infer<U, Path, typeof inputType>;
export type InferOutput<U extends AnyUniverse, Path extends string> =
  _Infer<U, Path, typeof outputType>;
