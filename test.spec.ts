import { condition, isConditionMet } from "./functions/condition"
import {} from "./functions/logging"
import {
  addRules,
  executeAutomationRule,
  executeRules,
  getRules,
  getRulesWithTrigger,
  removeAllRules,
  removeRuleById,
  rules,
  setRuleId,
} from "./functions/rule"
import ar from "./index"
import { logCallback, setLogCallback } from "./functions/logging"

type DataType = { name: boolean }

describe("params", () => {
  describe("addParam", () => {
    it("adds a param", () => {
      ar.addParam("derp")
      expect(ar.params.includes("derp")).toBeTruthy()
    })
  })
})

describe("operators", () => {
  it("contains all the correct operators", () => {
    expect(ar.op.didEqual).toEqual("did equal")
    expect(ar.op.didNotEqual).toEqual("did not equal")
    expect(ar.op.doesInclude).toEqual("does include")
    expect(ar.op.doesNotEqual).toEqual("does not equal")
    expect(ar.op.doesNotInclude).toEqual("does not include")
    expect(ar.op.equals).toEqual("equals")
    expect(ar.op.hasChanged).toEqual("has changed")
    expect(ar.op.hasNotChanged).toEqual("has not changed")
    expect(ar.op.isFalsy).toEqual("is falsy")
    expect(ar.op.isGreatherThan).toEqual("is greater than")
    expect(ar.op.isGreatherThanOrEqualTo).toEqual("is greater than or equal to")
    expect(ar.op.isLessThan).toEqual("is less than")
    expect(ar.op.isLessThanOrEqualTo).toEqual("is less than or equal to")
    expect(ar.op.isTruthy).toEqual("is truthy")
  })
})

describe("conditions", () => {
  describe("condition", () => {
    it("returns a condition object", () => {
      ar.addParam("name")
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      expect(newCondition).toEqual({
        param: "name",
        operator: ar.op.equals,
        value: true,
      })
    })
  })

  describe("isConditionMet", () => {
    it("returns true if condition is met", () => {
      ar.addParam("name")
      const data = { name: true }
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      expect(isConditionMet(newCondition, data)).toBeTruthy()
    })

    it("returns false if condition is not met", () => {
      ar.addParam("name")
      const data = { name: false }
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      expect(isConditionMet(newCondition, data)).toBeFalsy()
    })
  })
})

describe("rules", () => {
  afterEach(() => {
    removeAllRules()
    setRuleId(1)
  })

  describe("rule", () => {
    it("creates a new rule", () => {
      ar.addParam("name")
      const callback = () => {}
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback,
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })
      expect(newRule).toEqual({
        callback,
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })
    })
  })

  describe("executeAutomationRule", () => {
    it("calls the callback when conditions are met", () => {
      ar.addParam("name")
      const callback = jest.fn()
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback,
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      executeAutomationRule(newRule, { name: true })
      expect(callback).toHaveBeenCalled()
    })

    it("doesn't call the callback when conditions are not met", () => {
      ar.addParam("name")
      const callback = jest.fn()
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback,
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      executeAutomationRule(newRule, { name: false })
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe("addRules", () => {
    it("adds the new rules to the rules array", () => {
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })
      addRules(newRule)
      expect(rules[0].description).toBe("test rule")
    })

    it("adds an id to a new rule", () => {
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })
      addRules(newRule)
      expect(rules[0].id).toBe(1)
    })
  })

  describe("removeRuleById", () => {
    it("removes the rule with the specified id", () => {
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "rule 1",
        trigger: "on test",
      })
      const newRule2 = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "rule 2",
        trigger: "on test",
      })
      addRules(newRule, newRule2)
      removeRuleById(1)
      expect(rules.length).toBe(1)
      expect(rules[0].id).toBe(2)
    })
  })

  describe("removeAllRules", () => {
    it("removes all rules from the rules array", () => {
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })
      addRules(newRule)
      removeAllRules()
      expect(rules.length).toBe(0)
    })
  })

  describe("getRules", () => {
    it("returns all rules, organized by trigger", () => {
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      const newRule2 = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      const newRule3 = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "test rule",
        trigger: "derp",
      })

      const rules = [newRule, newRule2, newRule3]
      addRules(...rules)
      const returnedRules = getRules()
      expect(returnedRules).toEqual([
        {
          trigger: "on test",
          rules: [
            { ...newRule, id: 1 },
            { ...newRule2, id: 2 },
          ],
        },
        { trigger: "derp", rules: [{ ...newRule3, id: 3 }] },
      ])
    })
  })

  describe("getRulesWithTrigger", () => {
    it("returns all rules with the specified trigger", () => {
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      const newRule2 = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      const newRule3 = ar.rule({
        callback: () => {},
        conditions: [newCondition],
        description: "test rule",
        trigger: "derp",
      })

      const rules = [newRule, newRule2, newRule3]
      const rulesWithTrigger = getRulesWithTrigger(rules, "on test")

      expect(rulesWithTrigger.includes(newRule)).toBeTruthy()
      expect(rulesWithTrigger.includes(newRule2)).toBeTruthy()
      expect(rulesWithTrigger.includes(newRule3)).toBeFalsy()
    })
  })

  describe("executeRules", () => {
    it("executes all of the provided rules", () => {
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const newRule = ar.rule({
        callback: callback1,
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      const newRule2 = ar.rule({
        callback: callback2,
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      executeRules([newRule, newRule2], { name: true })
      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
    })
  })

  describe("executeRulesWithTrigger", () => {
    it("executes all rules with the provided trigger", () => {
      const newCondition = condition<DataType>("name", ar.op.equals, true)
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const newRule = ar.rule({
        callback: callback1,
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      const newRule2 = ar.rule({
        callback: callback2,
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      addRules(newRule, newRule2)
      ar.executeRulesWithTrigger("on test", { name: true })

      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
    })
  })
})

describe("logging", () => {
  it("lets the user set the logging callback", () => {
    const dummyCallback = jest.fn()
    setLogCallback(dummyCallback)
    expect(logCallback).toBe(dummyCallback)
  })

  it("calls the logging callback with data", () => {
    const dummyLoggingCallback = jest.fn()
    setLogCallback(dummyLoggingCallback)
    ar.addParam("name")
    const callback = jest.fn()
    const newCondition = condition<DataType>("name", ar.op.equals, true)
    const newRule = ar.rule({
      callback,
      conditions: [newCondition],
      description: "test rule",
      trigger: "on test",
    })

    executeAutomationRule(newRule, { name: true })
    expect(dummyLoggingCallback).toHaveBeenCalledWith({
      rule: newRule,
      isSuccess: true,
      failedCondition: undefined,
      data: { name: true },
    })
  })
})
