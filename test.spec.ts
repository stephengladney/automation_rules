import * as ar from "./index"

describe("mappings", () => {
  describe("addMapping", () => {
    it("adds a mapping", () => {
      ar.addMapping("key", "value")
      expect(ar.mappings.key).toEqual("value")
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
