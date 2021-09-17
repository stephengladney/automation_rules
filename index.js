const {
  executeAllRules,
  getAllRulesWithTrigger,
  rule,
} = require("./functions/rule")
const { condition } = require("./functions/condition")
const trigger = require("./functions/trigger")
const crud = require("./functions/crud.js")

module.exports.rule = rule
module.exports.trigger = trigger
module.exports.condition = condition

module.exports.mappings = require("./config/mappings")
module.exports.op = require("./config/operators")

module.exports.addRule = crud.addRule
module.exports.listRules = crud.listRules

module.exports.executeAllRulesForTrigger = (triggerToQuery, { data }) =>
  executeAllRules(getAllRulesWithTrigger(crud.rules, triggerToQuery), data)
