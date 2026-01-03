// Shared primitive types used across app-level types
export type ISODateString = string;

export type ID<T extends string = string> = string & { readonly __brand?: T };

export type Nullable<T> = T | null;

export type NonEmptyString = string & { readonly __nonEmpty?: true };
