# automation-rules

Automation rules allow your app's users to created automated workflows when certain events occur in the application and particular conditions are met. For example, say your app processes transactions for a store and the store owner wants to offer a 10% discount on purchases over $100. The owner can create an automation rule to automatically apply the discount when an order over $100 is placed.

## Getting Started

To install the package, run `npm install automation-rules` in your terminal

Add `import automationrules from "automation-rules"` in your code wherever you wish to use the library. _(Note: You can use whatever alias you'd like.)_

#### Rules are composed of three main parts:

- Trigger
- Condition(s)
- Callback

## Triggers

A `Trigger` describes a particular event in your app that you want to allow users to build an automation rule around. To ensure type safety, you must hard-code your triggers as a variable in your code. The variable should be a readonly object with models you wish to evaluate as keys and arrays of the events as values. The variable should also be exported.

Example:

- You have an e-commerce app that lets local merchant sell their producst online.
- The app has two models: **orders** and **customers**.
- Allow merchants to create automations when orders are created and/or when an order is paid.
- Allow merchants to create automations when new customers are created.

```typescript
export const triggers = {
  order: ["created", "paid"],
  customers: ["created"],
} as const
```

_IMPORTANT: You must define this variable as read-only (using `as const`) if you want to ensure type safety and take advantage of autocomplete when using triggers._

_NOTE: Both the model and event names here are just strings for your reference. It's not required that they match actual model or event names elsewhere in your code._

### `getAllByModel()`

This function returns all of your Triggers for a specific model.

```typescript
function getAllByModel<
  T extends Record<string, readonly string[]>,
  K extends keyof T
>(triggers: T, model: K)

// Example:

import { triggers } from "somefile.ts"

automationrules.triggers.getAllByModel(triggers, "order")

//=> [{ model: "order", event: "created" }, { model: "order", event: "paid" }]
```

### `getByModelAndEvent()`

This function returns a specific Trigger.

```typescript
function getByModelAndEvent<
  T extends Record<string, readonly string[]>,
  U extends keyof T
>(triggers: T, model: U, event: T[U][number])

// Example:

import { triggers } from "somefile.ts"

automationrules.triggers.getByModelAndEvent(triggers, "order", "created")

//=> { model: "order", event: "created" }
```

## Conditions

A `Condition` verifies whether or not a set of data meets certain criteria. Conditions are composed of three parts:

- Param
- Operator
- Value

### Params

A `Param` is a key name of a particular data type that you would like to evaluate in an automation rule. Just like Triggers, you must hard-code your params as a variable in your code. The variable should be a readonly object with models you wish to evaluate as keys and arrays of the model's key names as values.

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

import { params } from "somefile.ts"

automationrules.params.getByModelAndEvent(params, "order", "subtotal")

//=>
{ model: "order", key: "subtotal" }
```

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
- `Condition`(s)
- `Callback`
- callback description _(optional)_
- description _(optional)_
- id _(optional)_

_Note: If no ID is passed, the library will assign an integer as the ID. (auto-incremented)_

### `create()`

This function creates a new `Rule`.

```typescript
function create<DataType>(
  trigger: Trigger,
  conditions: [Condition, ...Condition[]], // at least one condition is required
  callback: (data: DataType) => unknown,
  callbackDescription?: string,
  description?: string,
  id?: number | string
)

// Example:

import { params, triggers } from "somefile.ts"

// Get the order created trigger
const orderCreatedTrigger = automationrules.triggers.getBySchemaAndEvent(
  triggers,
  "order",
  "created"
)

// Get the order total param
const orderTotalParam = automationrules.params.getBySchemaAndKey(
  params,
  "order",
  "total"
)

// Create a new condition
const orderTotalOver100 = automationrules.conditions.create(
  orderTotalParam,
  "is greater than",
  100
)

// Create a callback
const discountOrder = (order: Order) => ({
  ...order,
  discount: 10,
  total: order.total - 10,
})

// Create a new rule
automationrules.rules.create(
  orderCreatedTrigger,
  [orderTotalOver100],
  discountOrder,
  "Discount the order by $10",
  "When order total is over $100, apply a $10 discount"
)
```

### Callbacks

This a function that's called when a rule is invoked and all conditions are met. The data that was evaluated for the rule is passed to the callback function.

```typescript
// Example:

const exampleCallback = (data: T) => {
  /* do stuff */
}
```

_TIP: You may want to utilize user-submitted values in your callback. For example, your user wants to send a custom message to their customer. To do this, create a function that takes in the user-submitted value(s) and returns another function that takes a single data param. Use this returned function for your automation rule's callback. Here's an example:_

```typescript
function getMessageCallback(msg: string) {
  return (data: Order) => sendMessage(data.customer, msg)
}

const messageCallback = getMessageCallback(messageInput)
```

### `executeAllByTrigger()`

This function executes all rules with a particular trigger. You should call this function in your code where the related trigger event happens.

```typescript
function executeRulesWithTrigger<T>(trigger: Trigger, data: T)

// Example:

import { triggers } from "somefile.ts"
import automationrules from "automation-rules"

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
        failedCondition!.value} is not true`
    : ""

  logs.push({
      rule: rule.description,
      success: isSuccess,
      failReason: failedReason,
    })

  console.log(logs) //=>
  // [
  //  {
  //   rule: "When order total is over $100",
  //   success: false,
  //   failReason: "total is greater than 100 is not true",
  //  }
  // ]
```

### Persisting rules

Obviously, you will want the ability to persist automation rules created by your users in a database. The following section outlines how this is achieved.

#### Function Dictionary

Since functions themselves can't be stored to and retrieved from a database, we instead associate a name with a function and store the name. A `FunctionDictionary` is an object that stores the names as keys and their functions as values. This is hard-coded and set once in your application's code.

Example:

```typescript
function someFunction() {}
function someOtherFunction() {}

const functionDictionary = {
  someFunction: someFunction,
  someOtherFunction: someOtherFunction,
}
```

#### `getJsonStringFromRule()`

```typescript
function getJsonStringFromRule(rule: Rule): string
```

Rules will be stored as JSON in your database. This is a function that returns a JSON string version of your rule that you can store in your database.

#### `getRuleFromJsonString()`

```typescript
function getRuleFromJsonString(json: string): Rule
```

This function will convert a JSON string retrieved from your database back to a `Rule` that can be executed in code.

### Additional functions

#### getRulesByTrigger ()

```typescript
function getRulesByTrigger(trigger: Trigger)
```

This method will return an array of all currently active rules for a specific trigger.

Example:

```typescript
arule.getRulesByTrigger("When a user is created")
/*=> [
  { id: 1
    trigger: "When a user is created", 
    conditions: {param: "age", operator: "is greater than or equal to", value: 21)],
    callback: (data) => { console.log(data) }
    description: "Log the data when thing happens"
  }
]
*/
```
