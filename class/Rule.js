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

module.exports = Rule

function executeAutomationRule(data, rule) {
  if (areAllConditionsMet(data, rule)) rule.action(data)
}

module.exports.executeAutomationRule = executeAutomationRule

function executeAllAutomationRules(data, rules) {
  rules.forEach(rule => executeAutomationRule(data, rule))
}

module.exports.executeAllAutomationRules = executeAllAutomationRules
