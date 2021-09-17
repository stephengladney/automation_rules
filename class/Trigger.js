const { Rule } = require("./Rule")

function Trigger(event) {
  if (!event) throw "Trigger: Event is required"
  const trigger = {
    rules: [],
    addRule: ({ action, conditions }) => {
      const splitConditions = conditions.map(
        (condition) =>
          `${condition.param1} ${condition.operator} ${condition.param2}`
      )
      trigger.rules.push(
        new Rule({
          action,
          conditions,
          trigger: event,
        })
      )
    },
  }
  return trigger
}

module.exports = Trigger
