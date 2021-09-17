const { areAllConditionsMet } = require("./Condition")
const settings = require("../config/settings.json")

function Rule({ action, conditions, trigger }) {
  if (typeof action != "function") throw "Rule: action must be a function"
  if (!conditions || conditions.length === 0)
    throw "Rule: must supply at least one condition"
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
    if (settings.logging) {
      console.log(
        `[\x1b[36mar\x1b[0m] ${new Date().toDateString()} ${new Date().toLocaleTimeString()} \x1b[1m\x1b[32m${
          rule.trigger
        } \x1b[30m\x1b[42m${conditions}\x1b[0m`
      )
    }
  }
}

function executeAllRulesForTrigger(trigger, { data }) {
  trigger.rules.forEach((rule) => executeAutomationRule(data, rule))
}

module.exports = {
  executeAllRulesForTrigger,
  executeAutomationRule,
  Rule,
}
