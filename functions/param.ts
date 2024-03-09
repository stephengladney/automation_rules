import type { Param } from "../types"
import { isObjectInArray } from "./misc"

export const params: Param[] = []

export function createParams(
  ...paramConstructors: { schema: string; keys: string[] }[]
) {
  paramConstructors.forEach(({ schema, keys }) => {
    keys.forEach((key) => {
      const newParam = { schema, key }
      if (!isObjectInArray(newParam, params)) params.push(newParam as Param)
    })
  })
  return params
}

export function getParamsBySchema(schema: string) {
  return params.filter(({ schema: paramSchema }) => paramSchema === schema)
}
