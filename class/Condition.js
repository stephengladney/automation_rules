const mappings = require("../config/mappings")
const operators = require("../config/operators")

class Condition {
  constructor({ param1, operator, param2 }) {
    if (!mappings.hasOwnProperty(param1))
      throw `\x1b[30m\x1b[43m Condition \x1b[37m\x1b[41m Invalid 1st parameter: \x1b[1m${param1} `
    if (!operators.includes(operator))
      throw `Condition: invalid operator: ${operator}`
    this.param1 = param1
    this.operator = operator
    this.param2 = param2
  }
}

function isConditionMet(condition, data) {
  let { operator, param2 } = condition
  const mappedParam1 = mappings[condition.param1]
  const param1 = data[mappedParam1]
  const previousParam1 = data.previous[mappedParam1]

  switch (operator) {
    case "equals":
      return param1 == param2
    case "does not equal":
      return param1 != param2
    case "did equal":
      return previousParam1 == param2
    case "did not equal":
      return previousParam1 != param2
    case "includes":
      return param1.includes(param2)
    case "does not include":
      return !param1.includes(param2)
    case "is greater than":
      return param1 > param2
    case "is greater than or equal to":
      return param1 >= param2
    case "is less than":
      return param1 < param2
    case "is less than or equal to":
      return param1 <= param2
    case "is falsy":
      return !param1
    case "is truthy":
      return !!param1
    case "has changed":
      return param1 !== previousParam1
    case "has not changed":
      return param1 === previousParam1
    default:
      throw `isConditionMet: Unrecognized operator ${operator}`
  }
}

function areAllConditionsMet(data, rule) {
  let result = true
  for (condition of rule.conditions) {
    if (!isConditionMet(condition, data)) {
      result = false
      break
    }
  }
  return result
}

module.exports = {
  areAllConditionsMet,
  Condition,
  isConditionMet
}
