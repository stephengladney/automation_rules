module.exports.mappings = require("./config/mappings")
module.exports.op = require("./config/operators")

const { executeAllAutomationRules, Rule } = require("./class/Rule")
const { rulesWithTrigger, Trigger } = require("./class/Trigger")

module.exports.Rule = Rule
module.exports.Trigger = Trigger
module.exports.Condition = require("./class/Condition").Condition

let rules
module.exports.setRules = arr => (rules = arr)

module.exports.execute = (trigger, data) => {
  executeAllAutomationRules(data, rulesWithTrigger(rules, trigger))
}
