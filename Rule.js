class Rule {
  constructor({ action, conditions }) {
    if (typeof action != "function") throw "Rule: action must be a function"
    if (!conditions || conditions.length === 0)
      throw "Rule: must supply at least one condition"
    this.action = action
    this.conditions = conditions
  }
}

module.exports = Rule
