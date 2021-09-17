const ar = require("./index")
const data = { assignee: "Sam", previous: { assignee: "Dave" } }

const trigger = ar.trigger("Thing happened")

ar.addRule(
  ar.rule({
    action: () => console.log("i fired"),
    conditions: [
      ar.condition(["Assignee", ar.op.doesNotEqual, 2]),
      ar.condition(["Assignee", ar.op.equals, "Sam"]),
    ],
    trigger,
  })
)

ar.addRule(
  ar.rule({
    action: () => console.log("i fired"),
    conditions: [
      ar.condition(["Assignee", ar.op.equals, "John"]),
      ar.condition(["Assignee", ar.op.doesNotEqual, 4]),
    ],
    trigger,
  })
)

ar.executeAllRulesForTrigger(trigger, { data })
// console.log(JSON.stringify(ar.listRules()))

// const result = [
//   {
//     trigger: "Thing happened",
//     rules: [
//       "Assignee does not equal 2, Assignee equals Sam, ",
//       "Assignee equals John, Assignee does not equal 4, ",
//     ],
//   },
// ]
