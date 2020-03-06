const mappings = require("../config/mappings")
const operators = require("../config/operators")

class Condition {
  constructor({ param1, operator, param2 }) {
    if (!mappings.hasOwnProperty(param1))
      throw `\x1b[30m\x1b[43m Condition \x1b[37m\x1b[41m Invalid 1st parameter: \x1b[1m${param1} `
    if (!operators.includes(operator))
      throw `Condition: invalid operator: ${operator}`
    this.param1 = param1
    this.operator = operator
    this.param2 = param2
  }
}

function isConditionMet(condition, data) {
  const { operator, param2 } = condition
  const mappedParam1 = mappings[condition.param1]
  const param1 = data[mappedParam1]
  const previousParam1 = data.previous ? data.previous[mappedParam1] : null
  const stringifiedCondition = `${condition.param1}: ${param1} | prev: ${previousParam1}`

  let result

  switch (operator) {
    case "equals":
      result = param1 == param2
      break
    case "does not equal":
      result = param1 != param2
      break
    case "did equal":
      result = previousParam1 == param2
      break
    case "did not equal":
      result = previousParam1 != param2
    case "includes":
      result = param1.includes(param2)
      break
    case "does not include":
      result = !param1.includes(param2)
      break
    case "is greater than":
      result = param1 > param2
      break
    case "is greater than or equal to":
      result = param1 >= param2
      break
    case "is less than":
      result = param1 < param2
      break
    case "is less than or equal to":
      result = param1 <= param2
      break
    case "is falsy":
      result = !param1
      break
    case "is truthy":
      result = !!param1
      break
    case "has changed":
      result = param1 !== previousParam1
      break
    case "has not changed":
      breakresult = param1 === previousParam1
    default:
      throw `isConditionMet: Unrecognized operator ${operator}`
  }
  return { result, data: stringifiedCondition }
}

function stringifyCondition(condition) {
  return `${condition.param1} ${condition.operator} ${condition.param2}`
}
function areAllConditionsMet(data, rule) {
  let result = true
  for (condition of rule.conditions) {
    const evaluation = isConditionMet(condition, data)
    if (evaluation.result === false) {
      console.log(
        `[AR] ${new Date().toDateString()} ${new Date().toLocaleTimeString()} \x1b[1m\x1b[31m${stringifyCondition(
          condition
        )} \x1b[0m(${evaluation.data})`
      )
      result = false
      break
    }
  }
  return result
}

module.exports = {
  areAllConditionsMet,
  Condition,
  isConditionMet,
  stringifyCondition
}
