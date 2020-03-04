module.exports.mappings = require("./config/mappings")
module.exports.operators = require("./config/operators")
module.exports.triggers = require("./config/triggers")

module.exports.Condition = require("./class/Condition")
for (func in exports.Condition) {
  module.exports[func] = exports.Condition[func]
}

module.exports.Rule = require("./class/Rule")
for (func in module.exports.Rule) {
  module.exports[func] = exports.Rule[func]
}

console.log(module.exports)
