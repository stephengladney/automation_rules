const mappings = require("../config/mappings")
const operators = require("../config/operators")

class Condition {
  constructor({ param1, operator, param2 }) {
    if (!mappings.hasOwnProperty(param1))
      throw "Condition: invalid 1st parameter"
    if (!operators.includes(operator)) throw "Condition: invalid operator"
    this.param1 = param1
    this.operator = operator
    this.param2 = param2
  }
}

module.exports = Condition

function isConditionMet(condition, data) {
  const { operator, param2 } = condition
  const param1 = data[mappings[condition.param1]]
  switch (operator) {
    case "equals":
      return param1 == param2
    case "does not equal":
      return param1 != param2
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
    default:
      throw "isConditionMet: Unrecognized operator"
  }
}

module.exports.isConditionMet = isConditionMet

function areAllConditionsMet(data, rule) {
  let result = true
  rule.conditions.forEach(condition => {
    if (!isConditionMet(condition, data)) {
      result = false
      break
    }
  })
  return result
}

module.exports.areAllConditionsMet = areAllConditionsMet
