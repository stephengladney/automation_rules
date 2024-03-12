# automation-rules

automation-rules is a zero dependency, type-safe library that allows your application's users to customize their experience by creating automated workflows in your application.

For example, your app is an e-commerce app that lets merchants sell products online. One merchant wants to offer a 10% discount on purchases over $100. Another merchant wants to send a message to first-time customers. Each of these users can create an automation rule to automatically take these actions in your app.

## Getting Started

To install the package, run `npm install automation-rules` in your terminal

Add `import automationrules from "automation-rules"` in your code wherever you wish to use the library. _(Note: You can use whatever alias you'd like.)_

#### Rules are composed of three main parts:

- Trigger
- Condition(s)
- Callback

## Triggers

A `Trigger` describes a particular event in your app that you want to allow users to build an automation rule around. It's a simple object with keys of **model** and **event** which are both strings.

```typescript
type Trigger = { model: string; event: string }
```

To ensure type safety, you must hard-code your triggers as a variable in your code. The variable should be a readonly object with models you wish to evaluate as keys and arrays of the events as values. The variable should also be exported.

Example:

- Your application has two models: **orders** and **customers**.
- You want to allow merchants to creation an automation rule for when:
  - Orders are created
  - Orders are paid
  - New customers are created

```typescript
export const triggers = {
  order: ["created", "paid"],
  customer: ["created"],
} as const
```

_NOTE: Both the model and event names are just strings for your reference. It's not required that they match actual model or event names elsewhere in your code._

_IMPORTANT: You must define this variable as read-only (using `as const`) if you want to ensure type safety and take advantage of autocomplete when using triggers._

### `getAllByModel()`

This function returns all of your Triggers for a specific model. This is useful for rendering a list of possible triggers to users in your UI once they've selected a specific model.

```typescript
function getAllByModel<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(triggers: T, model: K)

// Example:

import automationrules from "automation-rules"
import { triggers } from "somefile.ts"

automationrules.triggers.getAllByModel(triggers, "order")[
  //=>
  ({ model: "order", event: "created" }, { model: "order", event: "paid" })
]
```

### `getByModelAndEvent()`

This function returns a specific Trigger.

```typescript
function getByModelAndEvent<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(triggers: T, model: U, event: T[U][number])

// Example:

import automationrules from "automation-rules"
import { triggers } from "somefile.ts"

automationrules.triggers.getByModelAndEvent(triggers, "order", "created")

//=>
{ model: "order", event: "created" }
```

### `models.getAll()`

```typescript
function getAll(triggers: Record<string, readonly string[]>)

// Example:

import automationrules from "automation-rules"
import { triggers } from "somefile.ts"

automationrules.triggers.models.getAll(triggers)
```

This function returns all of your models that can be used for a `Trigger`. Again, this is useful for rendering a list of options to users in your UI when they are creating a new rule.

### `events.getAllByModel()`

```typescript
function getAllByModel<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(triggers: T, model: K)

// Example:

import automationrules from "automation-rules"
import { triggers } from "somefile.ts"

automationrules.triggers.events.getAllAllByModel(triggers, "person")
```

This function returns all of your events that can be used for a `Trigger`. Again, this is useful for rendering a list of options to users in your UI when they are creating a new rule.

## Conditions

A `Condition` verifies whether or not a set of data meets certain criteria. Conditions are composed of three parts:

- Param
- Operator
- Value

```typescript
type Condition = {
  operator: Operator
  param: Param
  value: any
}
```

### Params

A `Param` is a key name of a particular data type that you would like to evaluate in an automation rule. Just like a `Trigger`, it's an object with keys of **model** and **event** which are both strings.

```typescript
export type Param = { model: string; key: string }
```

Also like a `Trigger`, you must hard-code your params as a variable in your code. The variable should be a readonly object with models you wish to evaluate as keys and arrays of the model's key names as values.

Example:

- Allow merchants to evaluate the subtotal, tip, tax, and/or total price of an order.
- Your **Order** model has keys named **subtotal**, **tip**, **tax** and **total**.

```typescript
export const params = {
  order: ["subtotal", "tip", "tax", "total"],
} as const
```

_IMPORTANT: You must define this variable as read-only (using `as const`) if you want to ensure type safety and take advantage of TypeScript's autocomplete when using params._

_NOTE: The model names here are just strings for your reference. However, the key names must match the **actual** key names on the related model._

#### `getAllByModel()`

This function returns all of your `Params` for a specific model.

```typescript
function getAllByModel<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(params: T, model: U)

// Example:

import automationrules from "automation-rules"
import { params } from "somefile.ts"

automationrules.params.getAllByModel(params, "order")[
  //=>
  ({ model: "order", key: "subtotal" },
  { model: "order", key: "tip" },
  { model: "order", key: "tax" },
  { model: "order", key: "total" })
]
```

#### `getByModelAndKey()`

This function returns a specific `Param`.

```typescript
function getParamByModelAndKey<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(params: T, model: U, key: T[U][number])

// Example:

import automationrules from "automation-rules"
import { params } from "somefile.ts"

automationrules.params.getByModelAndEvent(params, "order", "subtotal")

//=>
{ model: "order", key: "subtotal" }
```

### `models.getAll()`

```typescript
function getAll(params: Record<string, readonly string[]>)

// Example:

import automationrules from "automation-rules"
import { params } from "somefile.ts"

automationrules.params.models.getAll(params)
```

This function returns all of your models that can be used for a `Param`. Again, this is useful for rendering a list of options to users in your UI when they are creating a new rule.

### `events.getAllByModel()`

```typescript
function getAllByModel<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(params: T, model: K)

// Example:

import automationrules from "automation-rules"
import { params } from "somefile.ts"

automationrules.params.events.getAllAllByModel(params, "person")
```

This function returns all of your events that can be used for a `Param`. Again, this is useful for rendering a list of options to users in your UI when they are creating a new rule.

### Operators

Operators are used to evaluate the value of something in an automation rules. These are static and provided by the library. To access, use `automationrules.operators`. For convenience of rendering in your UI, these operators resolve to human-readable strings. The library also includes an `Operator` type which you can use for taking advantage of autocomplete when writing code.

Example:

```typescript
automationrules.operators

//=>
[
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
]
```

### `create()`

This function creates a new `Condition`.

```typescript
function create(param: Param, operator: Operator, value: unknown)

// Example:

import automationrules from "automation-rules"
import { params } from "somefile.ts"

const orderTotalParam = automationrules.params.getByModelAndKey(
  params,
  "order",
  "total"
)

const condition = automationrules.conditions.create(
  orderTotalParam,
  "is greater than or equal to",
  100
)
```

## Rules

A `Rule` combines a `Trigger` and `Condition`(s) with a callback function to execute when an event occurs and the conditions are met. `Rules` are composed of three required parts and three optional parts:

- `Trigger`
- `Condition(s)`
- `Callback`
- callback description _(optional)_
- description _(optional)_
- id _(optional)_

_Note: If no ID is passed, the library will assign an integer as the ID. (auto-incremented)_

### `create()`

This function creates a new `Rule`.

```typescript
function create<T, U extends (...args: any) => (data?: T) => unknown>({
  trigger: Trigger,
  conditions: [Condition, ...Condition[]], // at least one condition is required
  callback?: (data?: T) => unknown,
  callbackDescription?: string,
  createCallback?: U,
  createCallbackArgs?: Parameters<U>,
  description?: string,
  id?: number | string
})

// Example:

import automationrules from "automation-rules"
import { params, triggers } from "somefile.ts"

// Assume these values were submitted by your user in the UI
const selectedModel = "order"
const selectedEvent = "created"
const selectedKey = "total"
const selectedOperator = "is greater than"
const submittedValue = 100
const submittedDescription = "When order total is over $100, apply a $10 discount"
const submittedCallbackDescription = "Discount the order by $10"

// Get the order created trigger
const newTrigger = automationrules.triggers.getBySchemaAndEvent(
  triggers,
  selectedModel,
  selectedEvent
)

// Get the order total param
const newParam = automationrules.params.getBySchemaAndKey(
  params,
  selectedModel,
  selectedKey
)

// Create a new condition
const newCondition = automationrules.conditions.create(
  newParam,
  selectedOperator,
  submittedValue
)

// Define a callback function
const discountOrder = (order: Order) => ({
  ...order,
  discount: 10,
  total: order.total - 10,
})

// Create a new rule
const newRule = automationrules.rules.create({
  trigger: newTrigger,
  conditions: [newCondition],
  callback: discountOrder,
  callbackDescription: submittedCallbackDescription
  description: submittedDescription
})
```

### callback

This a function that's called when a rule is invoked and all conditions are met. The data that was evaluated for the rule is passed to the callback function.

```typescript
// Example:

const exampleCallback = (data: T) => {
  /* do stuff */
}
```

### createCallback & createCallbackArgs

Sometimes you want to utilize user-submitted values in your callback. For example, your user wants to send a custom message to their customer. To do this, create a function that takes in the user-submitted value(s) and returns another function that (optionally) takes a single data param and performs the necessary actions. This is referred to as a `CallbackCreator`. Pass this CallbackCreator to **createCallback** and pass any arguments to call as an array to **createCallbackArgs**.

```typescript
// Example:

import automationrules from "automation-rules"

function sendMessage(customer: string, msg: string) {
  /* code to send message */
}

function getSendMessageCallback(message: string) {
  return (data?: Order) => sendMessage(data.customer, message)
}

// Assume this value was submitted by you user in the UI
const customMessage = "Thank you for your support!"

const newRule = automationrules.rules.create({
  trigger: newTrigger,
  conditions: [newCondition],
  createCallback: getSendMessageCallback,
  createCallbackArgs: [customMessage],
  callbackDescription: "Send a custom message to the customer",
  description: submittedDescription,
})
```

### `executeAllByTrigger()`

This function executes all rules with a particular `Trigger`. You should call this function in your code where the related trigger event happens.

```typescript
function executeAllByTrigger<T>(trigger: Trigger, data: T)

// Example:

import automationrules from "automation-rules"
import { triggers } from "somefile.ts"

const orderCreatedTrigger = automationrules.triggers.findByModelAndEvent(
  triggers,
  "order",
  "created"
)

function createOrder(order: Order) {
  // do stuff related to creating an order
  automationrules.rules.executeAllByTrigger(orderCreatedTrigger, order)
}
```

### `getAllByTrigger()`

This function retrieves all rules with a particular `Trigger`.

```typescript
function getAllByTrigger(trigger: Trigger)

// Example:

import automationrules from "automation-rules"
import { triggers } from "somefile.ts"

const orderCreatedTrigger = automationrules.triggers.findByModelAndEvent(
  triggers,
  "order",
  "created"
)

automationrules.rules.getAllByTrigger(orderCreatedTrigger)
```

## Logging

You can enable user-facing logging on success and/or failure of rules. Logs help your app's users verify which automation rules succeed or fail and why. This helps them troubleshoot when a rule does or does not fire unexpectedly.

### `setLogging()`

```typescript
function setLogging({
  onSuccess,
  onFailure,
}: {
  onSuccess: boolean
  onFailure: boolean
})
```

### `setLogCallback()`

This sets your `LogCallback` function. If using logging, this function should be called once in your application at initialization.

```typescript
type LogCallback = (
  rule: Rule,
  isSuccess: boolean, // indicates where all conditions were met
  data: unknown,
  failedCondition?: Condition // if failed, the first condition that failed
) => {
  /* do stuff */
}

function setLogCallback(callback: LogCallback)

// Example:

const myLogCallback = (
  rule: Rule,
  isSuccess: boolean,
  data: unknown,
  failedCondition?: Condition
) => {
  const failedReason = !isSuccess
    ? `${failedCondition!.param.key} ${failedCondition!.operator} ${
        failedCondition!.value
      } is not true`
    : ""

  logs.push({
    rule: rule.description,
    isSuccess: isSuccess,
    failReason: failedReason,
  })
}

setLogCallback(myLogCallback)

// An order comes in for less than $100...

console.log(logs)[
  //=>
  {
    rule: "When order total is over $100",
    isSuccess: false,
    failReason: "total is greater than 100 is not true",
  }
]
```

### Persisting rules

Obviously, you will want the ability to persist automation rules created by your users in a database. The following section outlines how this is achieved.

#### Function Dictionary

Since functions themselves can't be stored to and retrieved from a database, we instead associate a name with a function and store the name. A `FunctionDictionary` is an object that stores the names as keys and their functions as values. This is hard-coded and in your application's code.

_NOTE: you must include both callback and CallbackCreator functions_

Example:

```typescript
function sendMessage(customer: string, msg: string) {
  /* code to send message */
}

function getSendMessageCallback(message: string) {
  return (data?: Order) => sendMessage(data.customer, message)
}

export const functionDictionary = {
  sendMessage: sendMessage,
  getSendMessageCallback: getSendMessageCallback,
}
```

#### `getJsonStringFromRule()`

This is a function that returns a JSON string version of a rule that you can store in your database.

```typescript
function getJsonStringFromRule(
  rule: Rule,
  functionDictionary: Record<string, Function>
)

// Example:

import { functionDictionary } from "somefile.ts"

automationrules.log.getJsonStringFromRule(someRule, functionDictionary)
```

#### `getRuleFromJsonString()`

This is a function that returns a Rule from a JSON string.

```typescript
function getRuleFromJsonString(
  json: string,
  functionDictionary: Record<string, Function>
)
```

## Sample Project

https://github.com/stephengladney/ar-example

To help put all of this in perspective and see it in action, you can view the source code and run the sample project above. It's a light-weight Vite React app with a single dependency: automation-rules ...obviously.
