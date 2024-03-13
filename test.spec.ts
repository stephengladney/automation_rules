import { createCondition, isConditionMet } from "./functions/condition"
import {
  executeAutomationRule,
  executeRules,
  getRulesByTrigger,
  removeAllRules,
  removeRuleById,
  rules,
  setRuleId,
} from "./functions/rule"
import automationrules from "./index"

type DataType = { name: boolean; age: number }

const triggers = {
  person: ["When a person is created", "When a person is deleted"],
} as const

const params = { person: ["name", "age", "sex"] } as const

const newParam = automationrules.params.getBySchemaAndKey(
  params,
  "person",
  "name"
)

const newTrigger = automationrules.triggers.getBySchemaAndEvent(
  triggers,
  "person",
  "When a person is created"
)

describe("params", () => {
  describe("getAllBySchema", () => {
    it("adds a param", () => {
      expect(automationrules.params.getAllBySchema(params, "person")).toEqual([
        { schema: "person", key: "name" },
        { schema: "person", key: "age" },
        { schema: "person", key: "sex" },
      ])
    })
  })

  describe("getKeysBySchema", () => {
    it("returns the correct keys", () => {
      expect(
        automationrules.params.keys.getAllBySchema(params, "person")
      ).toEqual(["name", "age", "sex"])
    })
  })

  describe("getBySchemaAndKey", () => {
    it("returns the correct param", () => {
      expect(
        automationrules.params.getBySchemaAndKey(params, "person", "name")
      ).toEqual({
        schema: "person",
        key: "name",
      })
    })
  })

  describe("getKeysBySchema", () => {
    it("return", () => {
      expect(automationrules.params.schemas.getAll(params)).toEqual(["person"])
    })
  })
})

describe("operators", () => {
  it("contains all the correct operators", () => {
    expect(automationrules.operators).toEqual([
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
      const newCondition = createCondition(newParam, "equals", true)
      expect(newCondition).toEqual({
        param: newParam,
        operator: "equals",
        value: true,
      })
    })
  })

  describe("isConditionMet", () => {
    it("returns true if condition is met", () => {
      const data = { name: true }
      const newCondition = createCondition(newParam, "equals", true)
      expect(isConditionMet(newCondition, data)).toBeTruthy()
    })

    it("returns false if condition is not met", () => {
      const data = { name: false }
      const newCondition = createCondition(newParam, "equals", true)
      expect(isConditionMet(newCondition, data)).toBeFalsy()
    })

    it("returns true if previous value matches condition", () => {
      const data = { name: true, previous: { name: false } }
      const newCondition = createCondition(newParam, "did equal", false)
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
      const callback = () => {}
      const newCondition = createCondition(newParam, "equals", true)
      const newRule = automationrules.rules.create(
        newTrigger,
        [newCondition],
        callback,
        "test callback",
        "test rule"
      )
      expect(newRule).toEqual({
        id: 1,
        callback,
        callbackDescription: "test callback",
        conditions: [newCondition],
        description: "test rule",
        trigger: newTrigger,
      })
    })
  })

  describe("executeAutomationRule", () => {
    it("calls the callback when conditions are met", () => {
      const callback = jest.fn()
      const newCondition = createCondition(newParam, "equals", "Stephen")
      const newRule = automationrules.rules.create(
        newTrigger,
        [newCondition],
        callback,
        "test callback",
        "test rule"
      )
      executeAutomationRule(newRule, { name: "Stephen" })
      expect(callback).toHaveBeenCalled()
    })

    it("doesn't call the callback when conditions are not met", () => {
      const callback = jest.fn()
      const newCondition = createCondition(newParam, "equals", true)
      const newRule = automationrules.rules.create(
        newTrigger,
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
      const newCondition = createCondition(newParam, "equals", true)
      const newRule = automationrules.rules.create(
        newTrigger,
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      expect(rules[0].description).toBe("test rule")
    })

    it("adds an id to a new rule", () => {
      const newCondition = createCondition(newParam, "equals", true)
      const newRule = automationrules.rules.create(
        newTrigger,
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
      const newCondition = createCondition(newParam, "equals", true)
      automationrules.rules.create(
        newTrigger,
        [newCondition],
        () => {},
        "rule 1"
      )
      automationrules.rules.create(
        newTrigger,
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
      const newCondition = createCondition(newParam, "equals", true)
      automationrules.rules.create(
        newTrigger,
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
      const newCondition = createCondition(newParam, "equals", true)
      const newRule = automationrules.rules.create(
        newTrigger,
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const newRule2 = automationrules.rules.create(
        newTrigger,
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const newRule3 = automationrules.rules.create(
        newTrigger,
        [newCondition],
        () => {},
        "test rule"
      )

      expect(automationrules.rules.getAll()).toEqual([
        { ...newRule, id: 1 },
        { ...newRule2, id: 2 },
        { ...newRule3, id: 3 },
      ])
    })
  })

  describe("getRulesByTrigger", () => {
    it("returns all rules of a specific trigger", () => {
      const newCondition = createCondition(newParam, "equals", true)
      automationrules.rules.create(
        { schema: "person", event: "derp" },
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const newRule2 = automationrules.rules.create(
        newTrigger,
        [newCondition],
        () => {},
        "test callback",
        "test rule"
      )
      const newRule3 = automationrules.rules.create(
        newTrigger,
        [newCondition],
        () => {},
        "test rule"
      )

      expect(automationrules.rules.getAllByTrigger(newTrigger)).toEqual([
        { ...newRule2, id: 2 },
        { ...newRule3, id: 3 },
      ])
    })
  })

  describe("executeRules", () => {
    it("executes all of the provided rules", () => {
      const newCondition = automationrules.conditions.create(
        newParam,
        "equals",
        true
      )
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      const newRule = automationrules.rules.create(
        newTrigger,
        [newCondition],
        callback1,
        "test callback",
        "test rule"
      )

      const newRule2 = automationrules.rules.create(
        newTrigger,
        [newCondition],
        callback2,
        "test callback",
        "test rule"
      )

      const allRules = automationrules.rules.getAllByTrigger(newTrigger)

      executeRules(allRules, { name: true })
      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
    })
  })

  describe("executeRulesWithTrigger", () => {
    it("executes all rules with the provided trigger", () => {
      const newCondition = automationrules.conditions.create(
        newParam,
        "equals",
        true
      )
      const callback1 = jest.fn()
      const callback2 = jest.fn()
      automationrules.rules.create(
        newTrigger,
        [newCondition],
        callback1,
        "test callback",
        "test rule"
      )

      automationrules.rules.create(
        newTrigger,
        [newCondition],
        callback2,
        "test callback",
        "test rule"
      )

      automationrules.rules.executeAllByTrigger(newTrigger, { name: true })

      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
    })
  })
})

describe("json", () => {
  it("converts both ways correctly", () => {
    const newCondition = automationrules.conditions.create(
      newParam,
      "equals",
      true
    )
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const rule1 = automationrules.rules.create(
      newTrigger,
      [newCondition],
      callback1,
      "test callback 1",
      "test rule 1"
    )

    const rule2 = automationrules.rules.create(
      newTrigger,
      [newCondition],
      callback2,
      "test callback 2",
      "test rule 2"
    )

    const functionDictionary = {
      "1stcallback": callback1,
      "2ndcallback": callback2,
    }
    const before = automationrules.rules.getAll()
    const jsonString = automationrules.json.getJsonStringFromRule(
      rule1,
      functionDictionary
    )
    const jsonString2 = automationrules.json.getJsonStringFromRule(
      rule2,
      functionDictionary
    )
    const rule1Returned = automationrules.json.getRuleFromJsonString(
      jsonString,
      functionDictionary
    )
    const rule2Returned = automationrules.json.getRuleFromJsonString(
      jsonString2,
      functionDictionary
    )
    const after = [rule1Returned, rule2Returned]

    expect(before).toEqual(after)
  })
})

describe("logging", () => {
  it("lets the user set the logging callback", () => {
    const dummyCallback = jest.fn()
    automationrules.log.setLogCallback(dummyCallback)
    expect(automationrules.log.getLogCallback()).toBe(dummyCallback)
  })

  it("calls the logging callback with data", () => {
    const dummyLoggingCallback = jest.fn()
    automationrules.log.setLogging({ onSuccess: true })
    automationrules.log.setLogCallback(dummyLoggingCallback)
    const callback = jest.fn()
    const newCondition = automationrules.conditions.create(
      newParam,
      "equals",
      true
    )
    const newRule = automationrules.rules.create(
      newTrigger,
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
