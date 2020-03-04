module.exports.mappings = require("./config/mappings")
module.exports.operators = require("./config/operators")
module.exports.triggers = require("./config/triggers")

const CONDITION = require("./class/Condition")
for (func in CONDITION) {
  module.exports[func] = CONDITION[func]
}

const RULE = require("./class/Rule")
for (func in RULE) {
  module.exports[func] = RULE[func]
}
