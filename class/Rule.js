const { areAllConditionsMet } = require("./Condition")

class Rule {
  constructor({ action, conditions }) {
    if (typeof action != "function") throw "Rule: action must be a function"
    if (!conditions || conditions.length === 0)
      throw "Rule: must supply at least one condition"
    this.action = action
    this.conditions = conditions
  }
}

function executeAutomationRule(data, rule) {
  if (areAllConditionsMet(data, rule)) rule.action(data)
}

function executeAllAutomationRules(data, rules) {
  rules.forEach(rule => executeAutomationRule(data, rule))
}

module.exports = {
  executeAllAutomationRules,
  executeAutomationRule,
  Rule
}
