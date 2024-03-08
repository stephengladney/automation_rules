import { createCondition, isConditionMet } from "./functions/condition"
import {
  executeAutomationRule,
  executeRules,
  getJsonStringFromRule,
  getRules,
  getRulesByTrigger,
  getRuleFromJsonString,
  removeAllRules,
  removeRuleById,
  rules,
  setRuleId,
} from "./functions/rule"
import arule from "./index"
import { logCallback, setLogCallback } from "./functions/logging"

type DataType = { name: boolean; age: number }

describe("params", () => {
  describe("createParam", () => {
    it("adds a param", () => {
      arule.createParam("derp")
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
      arule.createParam("name")
      const newCondition = createCondition<DataType>("name", "equals", true)
      expect(newCondition).toEqual({
        param: "name",
        operator: "equals",
        value: true,
      })
    })
  })

  describe("isConditionMet", () => {
    it("returns true if condition is met", () => {
      arule.createParam("name")
      const data = { name: true }
      const newCondition = createCondition<DataType>("name", "equals", true)
      expect(isConditionMet(newCondition, data)).toBeTruthy()
    })

    it("returns false if condition is not met", () => {
      arule.createParam("name")
      const data = { name: false }
      const newCondition = createCondition<DataType>("name", "equals", true)
      expect(isConditionMet(newCondition, data)).toBeFalsy()
    })

    it("returns true if previous value matches condition", () => {
      arule.createParam("name")
      const data = { name: true, previous: { name: false } }
      const newCondition = createCondition<DataType>("name", "did equal", false)
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
      arule.createParam("name")
      const callback = () => {}
      const newCondition = createCondition<DataType>("name", "equals", true)
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        callback,
        "test callback",
        "test rule"
      )
      expect(createRule).toEqual({
        id: 1,
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
      arule.createParam("name")
      const callback = jest.fn()
      const newCondition = createCondition<DataType>("name", "equals", true)
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        callback,
        "test callback",
        "test rule"
      )

      executeAutomationRule(createRule, { name: true })
      expect(callback).toHaveBeenCalled()
    })

    it("doesn't call the callback when conditions are not met", () => {
      arule.createParam("name")
      const callback = jest.fn()
      const newCondition = createCondition<DataType>("name", "equals", true)
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        callback,
        "test callback",
        "test rule"
      )

      executeAutomationRule(createRule, { name: false })
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe("addRules", () => {
    it("adds the new rules to the rules array", () => {
      const newCondition = createCondition<DataType>("name", "equals", true)
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      expect(rules[0].description).toBe("test rule")
    })

    it("adds an id to a new rule", () => {
      const newCondition = createCondition<DataType>("name", "equals", true)
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      expect(rules[0].id).toBe(1)
    })
  })

  describe("removeRuleById", () => {
    it("removes the rule with the specified id", () => {
      const newCondition = createCondition<DataType>("name", "equals", true)
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        () => {},
        "rule 1"
      )
      const createRule2 = arule.createRule(
        "on test",
        [newCondition],
        () => {},
        "rule 2"
      )
      removeRuleById(1)
      expect(rules.length).toBe(1)
      expect(rules[0].id).toBe(2)
    })
  })

  describe("removeAllRules", () => {
    it("removes all rules from the rules array", () => {
      const newCondition = createCondition<DataType>("name", "equals", true)
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      removeAllRules()
      expect(rules.length).toBe(0)
    })
  })

  describe("getRules", () => {
    it("returns all rules", () => {
      const newCondition = createCondition<DataType>("name", "equals", true)
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const createRule2 = arule.createRule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const createRule3 = arule.createRule(
        "derp",
        [newCondition],
        () => {},
        "test rule"
      )

      expect(getRules()).toEqual([
        { ...createRule, id: 1 },
        { ...createRule2, id: 2 },
        { ...createRule3, id: 3 },
      ])
    })
  })

  describe("getRulesByTrigger", () => {
    it("returns all rules of a specific trigger", () => {
      const newCondition = createCondition<DataType>("name", "equals", true)
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const createRule2 = arule.createRule(
        "on test",
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const createRule3 = arule.createRule(
        "derp",
        [newCondition],
        () => {},
        "test rule"
      )

      expect(getRulesByTrigger("derp")).toEqual([{ ...createRule3, id: 3 }])
    })
  })

  describe("executeRules", () => {
    it("executes all of the provided rules", () => {
      const newCondition = createCondition<DataType>("name", "equals", true)
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        callback1,
        "test callback",
        "test rule"
      )

      const createRule2 = arule.createRule(
        "on test",
        [newCondition],
        callback2,
        "test callback",
        "test rule"
      )

      executeRules([createRule, createRule2], { name: true })
      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
    })
  })

  describe("executeRulesWithTrigger", () => {
    it("executes all rules with the provided trigger", () => {
      const newCondition = createCondition<DataType>("name", "equals", true)
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const createRule = arule.createRule(
        "on test",
        [newCondition],
        callback1,
        "test callback",
        "test rule"
      )

      const createRule2 = arule.createRule(
        "on test",
        [newCondition],
        callback2,
        "test callback",
        "test rule"
      )

      arule.executeRulesWithTrigger("on test", { name: true })

      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
    })
  })

  describe("saving rules", () => {
    it("converts both ways correctly", () => {
      const newCondition = createCondition<DataType>("name", "equals", true)
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const rule1 = arule.createRule(
        "on 1st test",
        [newCondition],
        callback1,
        "test callback 1",
        "test rule 1"
      )

      const rule2 = arule.createRule(
        "on 2nd test",
        [newCondition],
        callback2,
        "test callback 2",
        "test rule 2"
      )

      arule.setFunctionDictionary({
        "1stcallback": callback1,
        "2ndcallback": callback2,
      })
      const before = arule.getRules()
      const jsonString = getJsonStringFromRule(rule1)
      const jsonString2 = getJsonStringFromRule(rule2)
      const rule1Returned = getRuleFromJsonString(jsonString)
      const rule2Returned = getRuleFromJsonString(jsonString2)
      const after = [rule1Returned, rule2Returned]

      expect(before).toEqual(after)
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
    arule.createParam("name")
    const callback = jest.fn()
    const newCondition = createCondition<DataType>("name", "equals", true)
    const createRule = arule.createRule(
      "on test",
      [newCondition],
      callback,
      "test callback",
      "test rule"
    )

    executeAutomationRule(createRule, { name: true })
    expect(dummyLoggingCallback).toHaveBeenCalledWith(
      createRule,
      true,
      {
        name: true,
      },
      undefined
    )
  })
})
