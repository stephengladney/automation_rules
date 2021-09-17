let rules = []

function addRule(rule) {
  rules.push(rule)
}
/*
[
    {
        trigger: "blah", 
        rules: []
    }
]

*/
function listRules({ withTrigger } = {}) {
  const result = []
  rules.forEach((rule) => {
    if (withTrigger && rule.trigger !== withTrigger) return
    let conditionsStringified = ""
    rule.conditions.forEach(
      (condition) =>
        (conditionsStringified = conditionsStringified.concat(
          `${condition.param1} ${condition.operator} ${condition.param2}, `
        ))
    )
    const foundIndex = result.findIndex((i) => i.trigger === rule.trigger)
    if (foundIndex != -1) {
      result[foundIndex].rules.push(conditionsStringified)
    } else {
      result.push({ trigger: rule.trigger, rules: [conditionsStringified] })
    }

    // if (result.triggers.includes(rule.trigger.event)) {
    //   result.triggers
    //     .find((trigger) => trigger === rule.trigger.event)
    //     .push(`${rule.param1} ${rule.operator} ${rule.param2}`)
    // } else {
    //   rule.triggers.push(rule.trigger.event)
    // }
  })
  //   const results = withTrigger
  //     ? rules.filter((rule) => rule.trigger === withTrigger)
  //     : rules

  //   return results.map((result, i) => `${i}: ${JSON.stringify(result)}`)
  return result
}

module.exports = { addRule, listRules, rules }
