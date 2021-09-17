const { areAllConditionsMet } = require("./condition")
const settings = require("../config/settings.json")
const { logCallbackCaller } = require("./crud")

function rule({ callback, conditions, description, trigger }) {
  if (typeof callback != "function") throw "rule: callback must be a function"
  if (!conditions || conditions.length === 0)
    throw "rule: must supply at least one condition"
  return { callback, conditions, description, trigger }
}

function executeAutomationRule(data, rule) {
  if (areAllConditionsMet(data, rule)) {
    rule.callback(data)
    if (settings.logging.logSuccess) {
      logCallbackCaller({ rule, isSuccess: true, data })
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
