import mappings from "../config/mappings"
import * as operators from "../config/operators"
import settings from "../config/settings.json"
import { logCallbackCaller } from "./crud"

type OperatorKey = keyof typeof operators
type Operator = (typeof operators)[OperatorKey]

type ParamKey = keyof typeof mappings
type Param = (typeof mappings)[ParamKey]

type Condition = {
  operator: Operator
  param: Param
  value: any
}

function condition(param: Param, operator: Operator, value: any) {
  return {
    operator,
    param,
    value,
  } as Condition
}

type Data = {
  [key: Param]: any
  previous?: any
}
function isConditionMet(condition: Condition, data: Data) {
  const { operator, value } = condition
  const mappedParam = mappings[condition.param]
  const param = data[mappedParam]
  const previousParam1 = data.previous ? data.previous[mappedParam] : null
  let result

  switch (operator) {
    case operators.equals:
      result = param == value
      break
    case operators.doesNotEqual:
      result = param != value
      break
    case operators.didEqual:
      result = previousParam1 == value
      break
    case operators.didNotEqual:
      result = previousParam1 != value
      break
    case operators.doesInclude:
      result = param.includes(value)
      break
    case operators.doesNotInclude:
      result = !param.includes(value)
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

function stringifyCondition(condition) {
  return `${condition.param} ${condition.operator} ${condition.value}`
}

function areAllConditionsMet(data: Data, rule) {
  let result = true
  for (let condition of rule.conditions) {
    if (!isConditionMet(condition, data)) {
      if (settings.logging.logFailure) {
        logCallbackCaller({
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

export default {
  areAllConditionsMet,
  condition,
  isConditionMet,
  stringifyCondition,
}
