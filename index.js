const { executeAllAutomationRules, Rule } = require("./class/Rule")
const { rulesWithTrigger, Trigger } = require("./class/Trigger")
const { Condition } = require("./class/Condition")

let rules

module.exports.Rule = Rule
module.exports.Trigger = Trigger
module.exports.Condition = Condition

module.exports.mappings = require("./config/mappings")
module.exports.Op = require("./config/operators")

module.exports.setRules = (arr) => (rules = arr)

module.exports.execute = (trigger, data) => {
  executeAllAutomationRules(data, rulesWithTrigger(rules, trigger))
}
