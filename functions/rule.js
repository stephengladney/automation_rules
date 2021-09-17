const { areAllConditionsMet } = require("./condition")
const settings = require("../config/settings.json")

function rule({ action, conditions, trigger }) {
  if (typeof action != "function") throw "rule: action must be a function"
  if (!conditions || conditions.length === 0)
    throw "rule: must supply at least one condition"
  return { action, conditions, trigger }
}

function executeAutomationRule(data, rule) {
  if (areAllConditionsMet(data, rule)) {
    const conditions = rule.conditions
      .map(
        (condition) =>
          `${condition.param1} ${condition.operator} ${condition.param2}`
      )
      .join(", ")

    rule.action(data)
    if (settings.logSuccess) {
      console.log(
        `[\x1b[36mar\x1b[0m] ${new Date().toDateString()} ${new Date().toLocaleTimeString()} \x1b[1m\x1b[32m${
          rule.trigger
        } \x1b[30m\x1b[42m${conditions}\x1b[0m`
      )
    }
  }
}

function getAllRulesWithTrigger(rules, trigger) {
  return rules.filter((rule) => rule.trigger === trigger)
}

function executeAllRules(rules, data) {
  rules.forEach((rule) => executeAutomationRule(data, rule))
}

module.exports = {
  executeAllRules,
  executeAutomationRule,
  getAllRulesWithTrigger,
  rule,
}
