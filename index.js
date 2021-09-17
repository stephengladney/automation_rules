const { executeAllRulesForTrigger, rule } = require("./class/rule")
const { condition } = require("./class/condition")
const trigger = require("./class/trigger")

module.exports.rule = rule
module.exports.trigger = trigger
module.exports.condition = condition

module.exports.mappings = require("./config/mappings")
module.exports.op = require("./config/operators")

module.exports.executeAllRulesForTrigger = executeAllRulesForTrigger
