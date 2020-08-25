const { areAllConditionsMet } = require("./Condition")

class Rule {
  constructor({ action, conditions, trigger }) {
    if (typeof action != "function") throw "Rule: action must be a function"
    if (!conditions || conditions.length === 0)
      throw "Rule: must supply at least one condition"
    this.action = action
    this.conditions = conditions
    this.trigger = trigger
  }
}

function executeAutomationRule(data, rule) {
  if (areAllConditionsMet(data, rule)) {
    const conditions = rule.conditions
      .map(
        condition =>
          `${condition.param1} ${condition.operator} ${condition.param2}`
      )
      .join(", ")

    rule.action(data)
    console.log(
      `[\x1b[36mar\x1b[0m] ${new Date().toDateString()} ${new Date().toLocaleTimeString()} \x1b[1m\x1b[32m${
        rule.trigger.event
      } \x1b[30m\x1b[42m${conditions}\x1b[0m`
    )
  }
}

function executeAllAutomationRules(data, rules) {
  rules.forEach(rule => executeAutomationRule(data, rule))
}

module.exports = {
  executeAllAutomationRules,
  executeAutomationRule,
  Rule,
}
