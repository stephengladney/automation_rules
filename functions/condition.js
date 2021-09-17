const mappings = require("../config/mappings")
const operators = require("../config/operators")
const settings = require("../config/settings.json")

function condition([param, operator, value]) {
  if (!mappings.hasOwnProperty(param))
    throw `\x1b[30m\x1b[43m condition \x1b[37m\x1b[41m Invalid 1st parameter: \x1b[1m${param} `
  if (!Object.values(operators).includes(operator))
    throw `condition: invalid operator: ${operator}`
  return {
    operator,
    param,
    value,
  }
}

function isConditionMet(condition, data) {
  const { operator, value } = condition
  const mappedParam1 = mappings[condition.param]
  const param = data[mappedParam1]
  const stringifiedParam1 = `${condition.param}: ${param}${
    data.previous ? ` | prev: ${data.previous[mappedParam1]}` : ``
  }`

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
  return { result, data: stringifiedParam1 }
}

function stringifyCondition(condition) {
  return `${condition.param} ${condition.operator} ${condition.value}`
}
function areAllConditionsMet(data, rule) {
  let result = true
  for (condition of rule.conditions) {
    const evaluation = isConditionMet(condition, data)
    if (evaluation.result === false) {
      if (settings.logFailure) {
        console.log(
          `[\x1b[36mar\x1b[0m] ${new Date().toDateString()} ${new Date().toLocaleTimeString()} \x1b[1m\x1b[31m${
            rule.trigger
          } \x1b[0m\x1b[37m\x1b[41m${stringifyCondition(condition)}${
            settings.logDataOnFailure ? `\x1b[0m (${evaluation.data})` : ""
          }`
        )
      }
      result = false
      break
    }
  }
  return result
}

module.exports = {
  areAllConditionsMet,
  condition,
  isConditionMet,
  stringifyCondition,
}
