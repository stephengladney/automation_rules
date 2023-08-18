import { condition, isConditionMet } from "./functions/condition"
import {
  addRules,
  executeAutomationRule,
  executeRules,
  getRules,
  getRulesByTrigger,
  removeAllRules,
  removeRuleById,
  rules,
  setRuleId,
} from "./functions/rule"
import arule from "./index"
import { logCallback, setLogCallback } from "./functions/logging"

type DataType = { name: boolean; age: number }

describe("params", () => {
  describe("addParam", () => {
    it("adds a param", () => {
      arule.addParam("derp")
      expect(arule.params.includes("derp")).toBeTruthy()
    })
  })
})

describe("operators", () => {
  it("contains all the correct operators", () => {
    expect(arule.operators).toEqual([
      "equals",
      "does not equal",
      "did equal",
      "did not equal",
      "includes",
      "does not include",
      "has changed",
      "has not changed",
      "is greater than",
      "is greater than or equal to",
      "is less than",
      "is less than or equal to",
      "is falsy",
      "is truthy",
    ])
  })
})

describe("conditions", () => {
  describe("condition", () => {
    it("returns a condition object", () => {
      arule.addParam("name")
      const newCondition = condition<DataType>("name", "equals", true)
      expect(newCondition).toEqual({
        param: "name",
        operator: "equals",
        value: true,
      })
    })
  })

  describe("isConditionMet", () => {
    it("returns true if condition is met", () => {
      arule.addParam("name")
      const data = { name: true }
      const newCondition = condition<DataType>("name", "equals", true)
      expect(isConditionMet(newCondition, data)).toBeTruthy()
    })

    it("returns false if condition is not met", () => {
      arule.addParam("name")
      const data = { name: false }
      const newCondition = condition<DataType>("name", "equals", true)
      expect(isConditionMet(newCondition, data)).toBeFalsy()
    })

    it("returns true if previous value matches condition", () => {
      arule.addParam("name")
      const data = { name: true, previous: { name: false } }
      const newCondition = condition<DataType>("name", "did equal", false)
      expect(isConditionMet(newCondition, data)).toBeTruthy()
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
      arule.addParam("name")
      const callback = () => {}
      const newCondition = condition<DataType>("name", "equals", true)
      const newRule = arule.rule(
        "on test",
        [newCondition],
        callback,
        "test callback",
        "test rule"
      )
      expect(newRule).toEqual({
        callback,
        callbackDescription: "test callback",
        conditions: [newCondition],
        description: "test rule",
        trigger: "on test",
      })
    })
  })

  describe("executeAutomationRule", () => {
    it("calls the callback when conditions are met", () => {
      arule.addParam("name")
      const callback = jest.fn()
      const newCondition = condition<DataType>("name", "equals", true)
      const newRule = arule.rule(
        "on test",
        [newCondition],
        callback,
        "test callback",
        "test rule"
      )

      executeAutomationRule(newRule, { name: true })
      expect(callback).toHaveBeenCalled()
    })

    it("doesn't call the callback when conditions are not met", () => {
      arule.addParam("name")
      const callback = jest.fn()
      const newCondition = condition<DataType>("name", "equals", true)
      const newRule = arule.rule(
        "on test",
        [newCondition],
        callback,
        "test callback",
        "test rule"
      )

      executeAutomationRule(newRule, { name: false })
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe("addRules", () => {
    it("adds the new rules to the rules array", () => {
      const newCondition = condition<DataType>("name", "equals", true)
      const newRule = arule.rule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      addRules(newRule)
      expect(rules[0].description).toBe("test rule")
    })

    it("adds an id to a new rule", () => {
      const newCondition = condition<DataType>("name", "equals", true)
      const newRule = arule.rule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      addRules(newRule)
      expect(rules[0].id).toBe(1)
    })
  })

  describe("removeRuleById", () => {
    it("removes the rule with the specified id", () => {
      const newCondition = condition<DataType>("name", "equals", true)
      const newRule = arule.rule("on test", [newCondition], () => {}, "rule 1")
      const newRule2 = arule.rule("on test", [newCondition], () => {}, "rule 2")
      addRules(newRule, newRule2)
      removeRuleById(1)
      expect(rules.length).toBe(1)
      expect(rules[0].id).toBe(2)
    })
  })

  describe("removeAllRules", () => {
    it("removes all rules from the rules array", () => {
      const newCondition = condition<DataType>("name", "equals", true)
      const newRule = arule.rule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      addRules(newRule)
      removeAllRules()
      expect(rules.length).toBe(0)
    })
  })

  describe("getRules", () => {
    it("returns all rules", () => {
      const newCondition = condition<DataType>("name", "equals", true)
      const newRule = arule.rule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const newRule2 = arule.rule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const newRule3 = arule.rule("derp", [newCondition], () => {}, "test rule")

      const rules = [newRule, newRule2, newRule3]
      addRules(...rules)
      expect(getRules()).toEqual([
        { ...newRule, id: 1 },
        { ...newRule2, id: 2 },
        { ...newRule3, id: 3 },
      ])
    })
  })

  describe("getRulesByTrigger", () => {
    it("returns all rules of a specific trigger", () => {
      const newCondition = condition<DataType>("name", "equals", true)
      const newRule = arule.rule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const newRule2 = arule.rule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const newRule3 = arule.rule("derp", [newCondition], () => {}, "test rule")

      const rules = [newRule, newRule2, newRule3]
      addRules(...rules)
      expect(getRulesByTrigger("derp")).toEqual([{ ...newRule3, id: 3 }])
    })
  })

  describe("executeRules", () => {
    it("executes all of the provided rules", () => {
      const newCondition = condition<DataType>("name", "equals", true)
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const newRule = arule.rule(
        "on test",
        [newCondition],
        callback1,
        "test callback",
        "test rule"
      )

      const newRule2 = arule.rule(
        "on test",
        [newCondition],
        callback2,
        "test callback",
        "test rule"
      )

      executeRules([newRule, newRule2], { name: true })
      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
    })
  })

  describe("executeRulesWithTrigger", () => {
    it("executes all rules with the provided trigger", () => {
      const newCondition = condition<DataType>("name", "equals", true)
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const newRule = arule.rule(
        "on test",
        [newCondition],
        callback1,
        "test callback",
        "test rule"
      )

      const newRule2 = arule.rule(
        "on test",
        [newCondition],
        callback2,
        "test callback",
        "test rule"
      )

      addRules(newRule, newRule2)
      arule.executeRulesWithTrigger("on test", { name: true })

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
    arule.setLogging({ onSuccess: true })
    setLogCallback(dummyLoggingCallback)
    arule.addParam("name")
    const callback = jest.fn()
    const newCondition = condition<DataType>("name", "equals", true)
    const newRule = arule.rule(
      "on test",
      [newCondition],
      callback,
      "test callback",
      "test rule"
    )

    executeAutomationRule(newRule, { name: true })
    expect(dummyLoggingCallback).toHaveBeenCalledWith(
      newRule,
      true,
      {
        name: true,
      },
      undefined
    )
  })
})
