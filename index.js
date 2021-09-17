module.exports.mappings = require("./config/mappings")
module.exports.Op = require("./config/operators")

const { executeAllAutomationRules, Rule } = require("./class/Rule")
const { rulesWithTrigger, Trigger } = require("./class/Trigger")
const { Condition } = require("./class/Condition")

module.exports.Rule = Rule
module.exports.Trigger = Trigger
module.exports.Condition = Condition

let rules
module.exports.setRules = (arr) => (rules = arr)

module.exports.execute = (trigger, data) => {
  executeAllAutomationRules(data, rulesWithTrigger(rules, trigger))
}
