import { params } from "../config/params"
import * as operators from "../config/operators"
import settings from "../config/settings.json"
import { callLogCallback } from "./logging"
import type { Condition, Operator, Rule } from "../types"

export function condition<T extends object>(
  param: keyof T,
  operator: Operator,
  value: T[keyof T]
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
  const { operator, value } = condition
  const param = data[condition.param as DataTypeKey]
  const previousParam1 = data.previous
    ? data.previous[condition.param as DataTypeKey]
    : null
  let result

  switch (operator) {
    case operators.equals:
      result = param == value
      break
    case operators.doesNotEqual:
      result = param != value
      break
    case operators.didEqual:
      console.log(previousParam1 + "==" + value)

      result = previousParam1 == value
      break
    case operators.didNotEqual:
      result = previousParam1 != value
      break
    case operators.doesInclude:
      if (typeof param === "string" || Array.isArray(param)) {
        result = param.includes(value)
      } else result = false
      break
    case operators.doesNotInclude:
      if (typeof param === "string" || Array.isArray(param)) {
        result = !param.includes(value)
      } else result = false
      break
    case operators.isGreatherThan:
      result = param > value
      break
    case operators.isGreatherThanOrEqualTo:
      result = param >= value
      break
    case operators.isLessThan:
      result = param < value
      break
    case operators.isGreatherThanOrEqualTo:
      result = param <= value
      break
    case operators.isFalsy:
      result = !param
      break
    case operators.isTruthy:
      result = !!param
      break
    case operators.hasChanged:
      result = param !== previousParam1
      break
    case operators.hasNotChanged:
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
      if (settings.logging.logFailure) {
        callLogCallback({
          rule,
          isSuccess: false,
          failedCondition: condition,
          data,
        })
      }
      result = false
      break
    }
  }
  return result
}
