const { executeAllRulesForTrigger, Rule } = require("./class/Rule")
const { Condition } = require("./class/Condition")
const Trigger = require("./class/Trigger")

module.exports.Rule = Rule
module.exports.Trigger = Trigger
module.exports.Condition = Condition

module.exports.mappings = require("./config/mappings")
module.exports.Op = require("./config/operators")

module.exports.executeAllRulesForTrigger = executeAllRulesForTrigger
