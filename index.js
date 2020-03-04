exports.mappings = require("./mappings")
exports.operators = require("./operators")
exports.Rule = require("./Rule")

const functions = require("./functions")
Object.keys(functions).forEach(fn => (exports[fn] = functions[fn]))
