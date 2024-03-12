import type { Param } from "../types"

export function getParamModels(params: Record<string, readonly string[]>) {
  return Object.keys(params)
}

export function getParamsByModel<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(params: T, model: U) {
  return params[model].map((key) => ({ model, key })) as Param[]
}

export function getParamKeysByModel<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(params: T, model: K) {
  return params[model]
}

export function getParamByModelAndKey<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(params: T, model: U, key: T[U][number]) {
  return {
    model,
    key,
  } as Param
}
