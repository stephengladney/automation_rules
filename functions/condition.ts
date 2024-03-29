import { callLogCallback, logOnFailure } from "./log"
import type { Condition, Operator, Param, Rule } from "../types"

export function createCondition(
  param: Param,
  operator: Operator,
  value: unknown
) {
  return {
    operator,
    param,
    value,
  } as Condition
}

export function isConditionMet<T>(
  condition: Condition,
  data: T & { previous?: T }
) {
  const { operator, value }: { operator: Operator; value: T[keyof T] } =
    condition
  const param = data[condition.param.key as keyof T]
  const previousParam1 = data.previous
    ? data.previous[condition.param.key as keyof T]
    : null
  let result

  switch (operator) {
    case "equals":
      result = param == value
      break
    case "does not equal":
      result = param != value
      break
    case "did equal":
      result = previousParam1 == value
      break
    case "did not equal":
      result = previousParam1 != value
      break
    case "includes":
      if (typeof param === "string" || Array.isArray(param)) {
        result = param.includes(value as (typeof param)[number])
      } else result = false
      break
    case "does not include":
      if (typeof param === "string" || Array.isArray(param)) {
        result = !param.includes(value as (typeof param)[number])
      } else result = false
      break
    case "is greater than":
      result = param > value
      break
    case "is greater than or equal to":
      result = param >= value
      break
    case "is less than":
      result = param < value
      break
    case "is less than or equal to":
      result = param <= value
      break
    case "is falsy":
      result = !param
      break
    case "is truthy":
      result = !!param
      break
    case "has changed":
      result = param !== previousParam1
      break
    case "has not changed":
      result = param === previousParam1
      break
    default:
      throw `isConditionMet: Unrecognized operator ${operator}`
  }
  return result
}

export function stringifyCondition(condition: Condition) {
  return `${condition.param} ${condition.operator} ${condition.value}`
}

export function areAllConditionsMet<T>(
  data: T & { previous?: any },
  rule: Rule
) {
  let result = true
  for (let condition of rule.conditions) {
    if (!isConditionMet<T>(condition, data)) {
      if (logOnFailure) {
        callLogCallback(rule, false, data, condition)
      }
      result = false
      break
    }
  }
  return result
}
