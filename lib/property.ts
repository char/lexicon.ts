export declare const inputType: unique symbol;
export declare const defaultType: unique symbol;
export declare const outputType: unique symbol;

export interface Property<T = unknown> {
  readonly kind: string;

  readonly [inputType]: T;
  readonly [defaultType]: unknown;
  readonly [outputType]: T;
}
