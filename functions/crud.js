let rules = []

function addRule(rule) {
  rules.push(rule)
}

function listRules({ withTrigger } = {}) {
  const result = []
  rules.forEach((rule) => {
    if (withTrigger && rule.trigger !== withTrigger) return

    const foundIndex = result.findIndex((i) => i.trigger === rule.trigger)
    if (foundIndex != -1) {
      result[foundIndex].rules.push(rule)
    } else {
      result.push({ trigger: rule.trigger, rules: [rule] })
    }
  })
  return result
}

module.exports = { addRule, listRules, rules }
