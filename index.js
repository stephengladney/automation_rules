module.exports.mappings = require("./config/mappings")
module.exports.operators = require("./config/operators")

const _classes = {}
_classes.Condition = require("./class/Condition")
_classes.Rule = require("./class/Rule")
_classes.Trigger = require("./class/Trigger")

for (_class in _classes) {
  for ([name, func] of Object.entries(_classes[_class])) {
    module.exports[name] = func
  }
}
