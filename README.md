# automation-rules

automation-rules is a zero dependency, type-safe library that allows your application's users to customize their experience by creating automated workflows in your application.

For example, your app is an e-commerce app that lets merchants sell products online. One merchant wants to offer a 10% discount on purchases over $100. Another merchant wants to send a message to first-time customers. Each of these users can create an automation rule to automatically take these actions in your app.

## Getting Started

To install the package, run `npm install automation-rules` in your terminal.

Add `import ar from "automation-rules"` in your code wherever you wish to use the library. _(Note: You can use whatever alias you'd like.)_

#### Rules are composed of three main parts:

- Trigger
- Condition(s)
- Callback

## Triggers

A `Trigger` describes a particular event in your app that you want to allow users to build an automation rule around. To ensure type safety, you must hard-code your triggers as a variable in your code. This should be stored as an object, where the keys are your app's model names and the values are an array of strings that represent properties on those models.

Example:

- Your application has two models: **orders** and **customers**.
- You want to allow merchants to creation an automation rule for when:

  - Orders are created
  - Orders are paid
  - New customers are created

So you'll want to declare your triggers as such...

```typescript
export const triggers = {
  order: ["created", "paid"],
  customer: ["created"],
} as const
```

_IMPORTANT: You should define this variable as read-only (using `as const`) if you want to ensure type safety and take advantage of autocomplete when using triggers._

### `triggers.getAllByModel()`

This function returns all of your Triggers for a specific model. This is useful for rendering a list of possible triggers to users in your UI once they've selected a specific model.

```typescript
function getAllByModel<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(triggers: T, model: K)

// Example:

import ar from "automation-rules"
import { triggers } from "somefile.ts"

ar.triggers.getAllByModel(triggers, "order")[
  //=>
  ({ model: "order", event: "created" }, { model: "order", event: "paid" })
]
```

### `triggers.getByModelAndEvent()`

This function returns a specific Trigger.

```typescript
function getByModelAndEvent<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(triggers: T, model: U, event: T[U][number])

// Example:

import ar from "automation-rules"
import { triggers } from "somefile.ts"

ar.triggers.getByModelAndEvent(triggers, "order", "created")

//=>
{ model: "order", event: "created" }
```

### `triggers.models.getAll()`

This function returns all of your models that can be used for a `Trigger`. Again, this is useful for rendering a list of options to users in your UI when they are creating a new rule.

```typescript
function getAll(triggers: Record<string, readonly string[]>)

// Example:

import ar from "automation-rules"
import { triggers } from "somefile.ts"

ar.triggers.models.getAll(triggers)
```

### `triggers.events.getAllByModel()`

This function returns all of your events that can be used for a `Trigger`. Again, this is useful for rendering a list of options to users in your UI when they are creating a new rule.

```typescript
function getAllByModel<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(triggers: T, model: K)

// Example:

import ar from "automation-rules"
import { triggers } from "somefile.ts"

ar.triggers.events.getAllAllByModel(triggers, "person")
```

## Conditions

A `Condition` verifies whether or not a set of data meets certain criteria. Conditions are composed of three parts:

- Param
- Operator
- Value

```typescript
type Condition = {
  param: Param
  operator: Operator
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

### `params.getAllByModel()`

This function returns all of your `Params` for a specific model.

```typescript
function getAllByModel<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(params: T, model: U)

// Example:

import ar from "automation-rules"
import { params } from "somefile.ts"

ar.params.getAllByModel(params, "order")[
  //=>
  ({ model: "order", key: "subtotal" },
  { model: "order", key: "tip" },
  { model: "order", key: "tax" },
  { model: "order", key: "total" })
]
```

### `params.getByModelAndKey()`

This function returns a specific `Param`.

```typescript
function getParamByModelAndKey<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(params: T, model: U, key: T[U][number])

// Example:

import ar from "automation-rules"
import { params } from "somefile.ts"

ar.params.getByModelAndEvent(params, "order", "subtotal")

//=>
{ model: "order", key: "subtotal" }
```

### `params.models.getAll()`

This function returns all of your models that can be used for a `Param`. Again, this is useful for rendering a list of options to users in your UI when they are creating a new rule.

```typescript
function getAll(params: Record<string, readonly string[]>)

// Example:

import ar from "automation-rules"
import { params } from "somefile.ts"

ar.params.models.getAll(params)
```

### `params.events.getAllByModel()`

This function returns all of your events that can be used for a `Param`. Again, this is useful for rendering a list of options to users in your UI when they are creating a new rule.

```typescript
function getAllByModel<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(params: T, model: K)

// Example:

import ar from "automation-rules"
import { params } from "somefile.ts"

ar.params.events.getAllAllByModel(params, "person")
```

### Operators

Operators are used to evaluate the value of something in an automation rules. These are static and provided by the library. For convenience of rendering these in your UI, access these with use `ar.operators`. If you're hard-coding any conditions in your code, auto-complete will work out of the box.

Example:

```typescript
ar.operators

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

### `conditions.create()`

This function creates a new `Condition`.

```typescript
function create(param: Param, operator: Operator, value: unknown)

// Example:

import ar from "automation-rules"
import { params } from "somefile.ts"

const orderTotalParam = ar.params.getByModelAndKey(params, "order", "total")

const condition = ar.conditions.create(
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

### `rules.create()`

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

import ar from "automation-rules"
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
const newTrigger = ar.triggers.getBySchemaAndEvent(
  triggers,
  selectedModel,
  selectedEvent
)

// Get the order total param
const newParam = ar.params.getBySchemaAndKey(
  params,
  selectedModel,
  selectedKey
)

// Create a new condition
const newCondition = ar.conditions.create(
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
const newRule = ar.rules.create({
  trigger: newTrigger,
  conditions: [newCondition],
  callback: discountOrder,
  callbackDescription: submittedCallbackDescription
  description: submittedDescription
})
```

### Callback

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

import ar from "automation-rules"

function sendMessage(customer: string, msg: string) {
  /* code to send message */
}

function getSendMessageCallback(message: string) {
  return (data?: Order) => sendMessage(data.customer, message)
}

// Assume this value was submitted by you user in the UI
const customMessage = "Thank you for your support!"

const newRule = ar.rules.create({
  trigger: newTrigger,
  conditions: [newCondition],
  createCallback: getSendMessageCallback,
  createCallbackArgs: [customMessage],
  callbackDescription: "Send a custom message to the customer",
  description: submittedDescription,
})
```

### `rules.executeAllByTrigger()`

This function executes all rules with a particular `Trigger`. You should call this function in your code where the related trigger event happens.

```typescript
function executeAllByTrigger<T>(trigger: Trigger, data: T)

// Example:

import ar from "automation-rules"
import { triggers } from "somefile.ts"

const orderCreatedTrigger = ar.triggers.findByModelAndEvent(
  triggers,
  "order",
  "created"
)

function createOrder(order: Order) {
  // do stuff related to creating an order
  ar.rules.executeAllByTrigger(orderCreatedTrigger, order)
}
```

### `rules.getAllByTrigger()`

This function retrieves all rules with a particular `Trigger`.

```typescript
function getAllByTrigger(trigger: Trigger)

// Example:

import ar from "automation-rules"
import { triggers } from "somefile.ts"

const orderCreatedTrigger = ar.triggers.findByModelAndEvent(
  triggers,
  "order",
  "created"
)

ar.rules.getAllByTrigger(orderCreatedTrigger)
```

## Logging

You can enable user-facing logging on success and/or failure of rules. Logs help your app's users verify which automation rules succeed or fail and why. This helps them troubleshoot when a rule does or does not fire unexpectedly.

### `logs.setLogging()`

```typescript
function setLogging({
  onSuccess,
  onFailure,
}: {
  onSuccess: boolean
  onFailure: boolean
})
```

### `logs.setLogCallback()`

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
  if (!isSuccess) {
    const failedReason = `${failedCondition!.param.key} ${
      failedCondition!.operator
    } ${failedCondition!.value} is not true`

    myLogs.push({
      rule: rule.description,
      isSuccess: isSuccess,
      failReason: failedReason,
    })
  }
}

setLogCallback(myLogCallback)

// An order comes in for less than $100...

console.log(myLogs)[
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

#### `json.getJsonStringFromRule()`

This is a function that returns a JSON string version of a rule that you can store in your database.

```typescript
function getJsonStringFromRule(
  rule: Rule,
  functionDictionary: Record<string, Function>
)

// Example:

import { functionDictionary } from "somefile.ts"

ar.json.getJsonStringFromRule(someRule, functionDictionary)
```

#### `json.getRuleFromJsonString()`

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
