import { condition, isConditionMet } from "./functions/condition"
import {
  addRules,
  removeAllRules,
  removeRuleById,
  rules,
} from "./functions/crud"
import {
  executeAutomationRule,
  getRules,
  getRulesWithTrigger,
} from "./functions/rule"
import * as ar from "./index"

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
      const newCondition = condition("name", ar.op.equals, true)
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
      const newCondition = condition("name", ar.op.equals, true)
      expect(isConditionMet(newCondition, data)).toBeTruthy()
    })

    it("returns false if condition is not met", () => {
      ar.addParam("name")
      const data = { name: false }
      const newCondition = condition("name", ar.op.equals, true)
      expect(isConditionMet(newCondition, data)).toBeFalsy()
    })
  })
})

describe("rules", () => {
  afterEach(() => {
    removeAllRules()
  })

  describe("rule", () => {
    it("creates a new rule", () => {
      ar.addParam("name")
      const callback = () => {}
      const newCondition = condition("name", ar.op.equals, true)
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
      const newCondition = condition("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback,
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      executeAutomationRule({ name: true }, newRule)
      expect(callback).toHaveBeenCalled()
    })

    it("doesn't call the callback when conditions are not met", () => {
      ar.addParam("name")
      const callback = jest.fn()
      const newCondition = condition("name", ar.op.equals, true)
      const newRule = ar.rule({
        callback,
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })

      executeAutomationRule({ name: false }, newRule)
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe("addRules", () => {
    it("adds the new rules to the rules array", () => {
      const newCondition = condition("name", ar.op.equals, true)
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
      const newCondition = condition("name", ar.op.equals, true)
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
      const newCondition = condition("name", ar.op.equals, true)
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
      const newCondition = condition("name", ar.op.equals, true)
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
      const newCondition = condition("name", ar.op.equals, true)
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
      const newCondition = condition("name", ar.op.equals, true)
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
})
