const { mappings } = require("./mappings")
const { operators } = require("./operators")
const { Rule } = require("./Rule")

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

function executeAutomationRule(data, rule) {
  if (areAllConditionsMet(data, rule)) rule.action(data)
}

function executeAllAutomationRules(data, rules) {
  rules.forEach(rule => executeAutomationRule(data, rule))
}
