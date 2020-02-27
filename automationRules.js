const mappings = new Map([
  ["Assignee", "assignee"],
  ["Current status", "currentStatus"],
  ["Previous status", "previousStatus"],
  ["Card title", "cardTitle"],
  ["Team assigned", "teamAssigned"]
])

const conditions = [
  "equals",
  "does not equal",
  "includes",
  "does not include",
  "is greater than",
  "is greater than or equal to",
  "is less than",
  "is less than or equal to",
  "is falsy",
  "is truthy"
]

class Rule {
  constructor({ action, conditions }) {
    if (typeof action != "function") throw "Rule: action must be a function"
    if (!conditions || conditions.length === 0)
      throw "Rule: must supply at least one condition"
    this.action = action
    this.conditions = conditions
  }
}

class Condition {
  constructor(param1, operator, param2) {
    if (!mappings.has(param1)) throw "Condition: invalid 1st parameter"
    if (!conditions.includes(operator)) throw "Condition: invalid operator"
    this.param1 = param1
    this.operator = operator
    this.param2 = param2
  }
}

function isConditionMet(condition, data) {
  const { operator, param2 } = condition
  const param1 = data[mappings.get(condition.param1)]
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
    if (!isConditionMet(condition, data)) result = false
  })
  return result
}

function executeAutomationRule(data, rule) {
  if (areAllConditionsMet(data, rule)) rule.action(data)
}

function executeAllAutomationRules(data, rules) {
  rules.forEach(rule => executeAutomationRule(data, rule))
}
