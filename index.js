module.exports.mappings = require("./config/mappings")
module.exports.operators = require("./config/operators")

const imports = {}
imports.Rule = require("./class/Rule")
imports.Trigger = require("./class/Trigger")
imports.Condition = require("./class/Condition")

const isClass = key => key.substr(0, 1) === key.substr(0, 1).toUpperCase()

for (_import in imports) {
  for ([key, val] of Object.entries(imports[_import])) {
    if (isClass(key)) module.exports[key] = val
  }
}

let _rules
module.exports.setRules = arr => (_rules = arr)

module.exports.execute = (trigger, data) => {
  imports.Rule.executeAllAutomationRules(
    data,
    imports.Trigger.rulesWithTrigger(_rules, trigger)
  )
}
