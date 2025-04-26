import { createCondition, isConditionMet } from "./functions/condition"
import {
  executeAutomationRule,
  removeAll,
  removeById,
  removeByTag,
  rules,
  setRuleId,
} from "./functions/rule"
import automationrules from "./index"

const triggers = {
  person: ["When a person is created", "When a person is deleted"],
  team: ["When a team is created"],
} as const

const params = { person: ["name", "age", "sex"], team: ["name"] } as const

const newParam = automationrules.params.getByModelAndKey(
  params,
  "person",
  "name"
)

const newTrigger = automationrules.triggers.getByModelAndEvent(
  triggers,
  "person",
  "When a person is created"
)

describe("triggers", () => {
  describe("triggers.getAllByModel", () => {
    it("returns all triggers with a specific model", () => {
      expect(
        automationrules.triggers.getAllByModel(triggers, "person")
      ).toEqual([
        { model: "person", event: "When a person is created" },
        { model: "person", event: "When a person is deleted" },
      ])
    })
  })

  describe("triggers.getByModelAndEvent", () => {
    it("returns the correct trigger", () => {
      expect(
        automationrules.triggers.getByModelAndEvent(params, "person", "name")
      ).toEqual({
        model: "person",
        event: "name",
      })
    })
  })

  describe("triggers.events.getAllByModel", () => {
    it("returns the correct events", () => {
      expect(
        automationrules.triggers.events.getAllByModel(triggers, "person")
      ).toEqual(["When a person is created", "When a person is deleted"])
    })
  })

  describe("triggers.models.getAll", () => {
    it("return", () => {
      expect(automationrules.triggers.models.getAll(triggers)).toEqual([
        "person",
        "team",
      ])
    })
  })
})

describe("params", () => {
  describe("params.getAllByModel", () => {
    it("adds a param", () => {
      expect(automationrules.params.getAllByModel(params, "person")).toEqual([
        { model: "person", key: "name" },
        { model: "person", key: "age" },
        { model: "person", key: "sex" },
      ])
    })
  })

  describe("params.getByModelAndKey", () => {
    it("returns the correct param", () => {
      expect(
        automationrules.params.getByModelAndKey(params, "person", "name")
      ).toEqual({
        model: "person",
        key: "name",
      })
    })
  })

  describe("params.keys.getAllByModel", () => {
    it("returns the correct keys", () => {
      expect(
        automationrules.params.keys.getAllByModel(params, "person")
      ).toEqual(["name", "age", "sex"])
    })
  })

  describe("params.keys.getAll", () => {
    it("return", () => {
      expect(automationrules.params.models.getAll(params)).toEqual([
        "person",
        "team",
      ])
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
  describe("createCondition", () => {
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
    removeAll()
    setRuleId(1)
  })

  describe("rule", () => {
    it("creates a new rule", () => {
      const callback = () => {}
      const newCondition = createCondition(newParam, "equals", true)

      const newRule = automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback,
        callbackDescription: "test callback",
        description: "test rule",
      })
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

      const newRule = automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback,
        callbackDescription: "test callback",
        description: "test rule",
      })
      executeAutomationRule(newRule, { name: "Stephen" })
      expect(callback).toHaveBeenCalled()
    })

    it("doesn't call the callback when conditions are not met", () => {
      const callback = jest.fn()
      const newCondition = createCondition(newParam, "equals", true)

      const newRule = automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback,
        callbackDescription: "test callback",
        description: "test rule",
      })

      executeAutomationRule(newRule, { name: false })
      expect(callback).not.toHaveBeenCalled()
    })

    it("calls the callback funfunction with args if conditions are met", () => {
      const callback = jest.fn()
      const funFunction = (a: string, b: number) => (data: any) => {
        callback(a, b, data)
      }
      const newCondition = createCondition(newParam, "equals", true)

      const newRule = automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        createCallback: funFunction,
        createCallbackArgs: ["the answer is", 42],
        callbackDescription: "test funfunction callback",
        description: "test funfunction callback",
      })

      executeAutomationRule(newRule, { name: true })
      expect(callback).toHaveBeenCalledWith("the answer is", 42, { name: true })
    })
  })

  describe("addRules", () => {
    it("adds the new rules to the rules array", () => {
      const newCondition = createCondition(newParam, "equals", true)

      automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        callbackDescription: "test callback",
        description: "test rule",
      })
      expect(rules[0].description).toBe("test rule")
    })

    it("adds an id to a new rule", () => {
      const newCondition = createCondition(newParam, "equals", true)

      automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        callbackDescription: "test callback",
        description: "test rule",
      })
      expect(rules[0].id).toBe(1)
    })
  })

  describe("removeRuleById", () => {
    it("removes the rule with the specified id", () => {
      const newCondition = createCondition(newParam, "equals", true)

      automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        description: "rule 1",
      })
      automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        description: "rule 2",
      })
      removeById(1)
      expect(rules.length).toBe(1)
      expect(rules[0].id).toBe(2)
    })
  })

  describe("removeByTag", () => {
    it("removed the rule(s) with the specific tag", () => {
      const newCondition = createCondition(newParam, "equals", true)

      automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        description: "rule 1",
        tags: ["mytag"],
      })
      automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        description: "rule 2",
      })
      removeByTag("mytag")
      expect(rules.length).toBe(1)
      expect(rules[0].id).toBe(2)
    })
  })

  describe("removeAllRules", () => {
    it("removes all rules from the rules array", () => {
      const newCondition = createCondition(newParam, "equals", true)

      automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        callbackDescription: "test callback",
        description: "test rule",
      })
      removeAll()
      expect(rules.length).toBe(0)
    })
  })

  describe("getRules", () => {
    it("returns all rules", () => {
      const newCondition = createCondition(newParam, "equals", true)

      const newRule = automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        callbackDescription: "test callback",
        description: "test rule",
      })

      const newRule2 = automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        callbackDescription: "test callback",
        description: "test rule",
      })

      const newRule3 = automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        callbackDescription: "test callback",
        description: "test rule",
      })

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

      automationrules.rules.create({
        trigger: { model: "person", event: "derp" },
        conditions: [newCondition],
        callback: () => {},
        callbackDescription: "test callback",
        description: "test rule",
      })

      const newRule2 = automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        callbackDescription: "test callback",
        description: "test rule",
      })

      const newRule3 = automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: () => {},
        callbackDescription: "test callback",
        description: "test rule",
      })

      expect(automationrules.rules.getAllByTrigger(newTrigger)).toEqual([
        { ...newRule2, id: 2 },
        { ...newRule3, id: 3 },
      ])
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

      automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: callback1,
        callbackDescription: "test callback",
        description: "test rule",
      })

      automationrules.rules.create({
        trigger: newTrigger,
        conditions: [newCondition],
        callback: callback2,
        callbackDescription: "test callback",
        description: "test rule",
      })

      automationrules.rules.executeAllByTrigger(newTrigger, { name: true })

      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
    })
  })
})

describe("json", () => {
  afterEach(() => {
    removeAll()
    setRuleId(1)
  })

  it("converts both ways correctly - regular callbacks", () => {
    const newCondition = automationrules.conditions.create(
      newParam,
      "equals",
      true
    )
    const callback1 = jest.fn()
    const callback2 = jest.fn()

    const rule1 = automationrules.rules.create({
      trigger: newTrigger,
      conditions: [newCondition],
      callback: callback1,
      callbackDescription: "test callback",
      description: "test rule",
    })

    const rule2 = automationrules.rules.create({
      trigger: newTrigger,
      conditions: [newCondition],
      callback: callback2,
      callbackDescription: "test callback 2",
      description: "test rule 2",
    })

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

  it("converts both ways correctly - funfunction callbacks", () => {
    const newCondition = automationrules.conditions.create(
      newParam,
      "equals",
      true
    )
    const callback1 = jest.fn()
    const callback2 = jest.fn()

    const funFunction = (a: string, b: number) => (data: any) => {
      callback1(a, b, data)
    }

    const rule1 = automationrules.rules.create({
      trigger: newTrigger,
      conditions: [newCondition],
      createCallback: funFunction,
      createCallbackArgs: ["the answer is", 42],
      callbackDescription: "test funfunction callback",
      description: "test funfunction callback",
    })

    const rule2 = automationrules.rules.create({
      trigger: newTrigger,
      conditions: [newCondition],
      callback: callback2,
      callbackDescription: "test callback 2",
      description: "test rule 2",
    })

    const functionDictionary = {
      "1stcallback": callback1,
      "2ndcallback": callback2,
      funfunction: funFunction,
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

    const newCondition = automationrules.conditions.create(
      newParam,
      "equals",
      true
    )

    const newRule = automationrules.rules.create({
      trigger: newTrigger,
      conditions: [newCondition],
      callback: () => {},
      callbackDescription: "test callback",
      description: "test rule",
    })

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
