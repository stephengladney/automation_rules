exports.Condition = class Condition {
  constructor(param1, operator, param2) {
    if (!mappings.hasOwnProperty(param1))
      throw "Condition: invalid 1st parameter"
    if (!operators.includes(operator)) throw "Condition: invalid operator"
    this.param1 = param1
    this.operator = operator
    this.param2 = param2
  }
}
