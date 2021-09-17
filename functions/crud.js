let rules = []
let logCallback = () => {}
const logCallbackCaller = (rule, isSuccess, data) =>
  logCallback(rule, isSuccess, data)

function addRule(rule) {
  rules.push(rule)
}

function getRules({ withTrigger } = {}) {
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

function setLogCallback(callback) {
  logCallback = callback
}

module.exports = {
  addRule,
  getRules,
  logCallback,
  logCallbackCaller,
  rules,
  setLogCallback,
}
