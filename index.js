exports.mappings = require("./config/mappings")
exports.operators = require("./config/operators")

exports.Condition = require("./class/Condition")
exports.Rule = require("./class/Rule")

const functions = require("./lib/functions")
Object.keys(functions).forEach(fn => (exports[fn] = functions[fn]))
