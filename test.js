const ar = require("./index")
const data = { assignee: "Sam" }

const trigger = new ar.Trigger("Thing happened")
const c1 = new ar.Condition({
  param1: "Assignee",
  operator: ar.Op.equals,
  param2: "Sam",
})
const c2 = new ar.Condition({
  param1: "Assignee",
  operator: ar.Op.doesNotEqual,
  param2: 2,
})
const rule = new ar.Rule({
  action: () => console.log("i fired"),
  conditions: [c1, c2],
  trigger,
})

ar.setRules([rule])

ar.execute(trigger, data)
