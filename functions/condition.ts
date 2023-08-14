import * as operators from "../operators"
import { callLogCallback, logOnFailure } from "./logging"
import type { Condition, Operator, Rule } from "../types"

export function condition<T extends object, U extends keyof T>(
  param: U,
  operator: Operator,
  value: T[U]
) {
  return {
    operator,
    param,
    value,
  } as Condition
}

type Data = {
  [key: string]: any
  previous?: any
}

export function isConditionMet<DataType>(
  condition: Condition,
  data: DataType & { previous?: DataType }
) {
  type DataTypeKey = keyof DataType
  const {
    operator,
    value,
  }: { operator: Operator; value: DataType[keyof DataType] } = condition
  const param = data[condition.param as DataTypeKey]
  const previousParam1 = data.previous
    ? data.previous[condition.param as DataTypeKey]
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
      console.log(previousParam1 + "==" + value)

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

export function areAllConditionsMet<DataType>(
  data: DataType & { previous?: any },
  rule: Rule
) {
  let result = true
  for (let condition of rule.conditions) {
    if (!isConditionMet<DataType>(condition, data)) {
      if (logOnFailure) {
        callLogCallback(
          rule,
          { isSuccess: false, failedCondition: condition },
          data
        )
      }
      result = false
      break
    }
  }
  return result
}
