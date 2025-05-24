import { defaultType, inputType, outputType, Property } from "../property.ts";

export interface IntegerDefinition {
  readonly type: "integer";
  readonly enum?: readonly number[];
  readonly const?: number;
  readonly default?: number;
}

export interface IntegerProperty<Def extends IntegerDefinition> extends Property<number> {
  readonly [inputType]: Def["const"] extends number ? Def["const"] : number;
  readonly [defaultType]: Def["default"] extends number ? Def["default"] : never;
  readonly [outputType]: this[typeof inputType];
}

export interface BooleanDefinition {
  readonly type: "boolean";
  readonly const?: boolean;
  readonly default?: boolean;
}

export interface BooleanProperty<Def extends BooleanDefinition> extends Property<boolean> {
  readonly [inputType]: Def["const"] extends boolean ? Def["const"] : boolean;
  readonly [defaultType]: Def["default"] extends boolean ? Def["default"] : never;
  readonly [outputType]: this[typeof inputType];
}
