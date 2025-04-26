import { operators } from "../operators"

export type Trigger = { model: string; event: string }

export type Param = { model: string; key: string }

export type Operator = (typeof operators)[number]

export type Condition = {
  operator: Operator
  param: Param
  value: any
}

export type Rule = {
  id?: string | number
  trigger: Trigger
  conditions: Condition[]
  callback?: (...args: any) => any
  callbackDescription?: string
  createCallback?: (...args: any) => any
  createCallbackArgs?: any[]
  description: string
  tags?: string[]
}
