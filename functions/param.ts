import type { Param, ParamsMap } from "../types"

export function getParamSchemas(params: ParamsMap) {
  return Object.keys(params)
}

export function getParamsBySchema<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(params: T, schema: U) {
  return params[schema].map((key) => ({ schema, key })) as Param[]
}

export function getParamKeysBySchema<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(params: T, schema: K) {
  return params[schema]
}

export function getParamBySchemaAndKey<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(params: T, schema: U, key: T[U][number]) {
  return {
    schema,
    key,
  } as Param
}
