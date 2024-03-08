# automation-rules

Automation rules allow your app's users to created automated workflows when events occur and certain conditions are met. For example, say your app processes transactions for a store and the store owner wants to offer a 10% discount on purchases over $100. The owner can create an automation rule to automatically apply the discount when an order over $100 is placed.

## Getting Started

To install the package, run `npm install automation-rules` in your terminal

Add `import arule from "automation-rules"` in your code wherever you wish to use the library. (Note: You can use whatever alias you'd like.)

Rules are composed of four parts: Trigger, Conditions, Callback and Description. Below is documentation of each of these as well as additional functions.

Additionally, there is an open-source sample project available at: https://github.com/stephengladney/ar-example

### Triggers

A `Trigger` is a string that describes a particular event in your app that you want to allow users to build an automation rule around. It's recommended to write these in a way that's easy for your users to understand.

```typescript
const myTriggers = {
  NEW_USER_CREATED: "When a new user is created",
  ORDER_SUBMITTED: "When an order is submitted",
}
```

### Params

The library works by reading object key/value pairs and evaluating whether or not specific conditions are met regarding the values. A `Param` is a key name (passed as a string) that you would like to evaluate the corresponding value of in automation rules.

Example:

You want to evaluate the total price of an order. Your Order object has a key named `total`.

```typescript
type Order = { items: Item[]; subtotal: number; tax: number; total: number }

arule.createParam("total")
```

<hr>

### Operators

Operators are used to evaluate the value of something in an automation rules. These are static and provided by the library. To access, use `arule.operators`. For convenience of rendering in your UI, these operators resolve to human-readable strings. The library also includes an `Operator` type which you can use for taking advantage of autocomplete when writing code.

Example:

```typescript
const operators = [
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

<hr>

### Conditions

Conditions allow your users to verify that a specific scenario has been met. The `condition` function provides an easy way to get a typesafe condition.

```typescript
function createCondition<T extends object>(
  param: keyof T,
  operator: Operator,
  value: T[keyof T]
)

type Condition = { param: keyof T; operator: Operator; value: T[keyof T] }
```

Example:

```typescript
type Order = { items: Item[]; subtotal: number; tax: number; total: number }

const condition = arule.createCondition(
  "total",
  "is greater than or equal to",
  100
)
```

<hr>

### Rules

Rules combine triggers, conditions with a callback function to execute when the conditions are met. You can optionally add a description or ID to the rule. Note: If no ID is passed, the library will assign an integer as the ID (auto-incremented).

```typescript
function createRule(
  trigger: Trigger,
  conditions: [Condition, ...Condition[]],
  callback: (data: DataType) => unknown,
  description?: string,
  id?: number | string
)
```

Example:

```typescript
type Order = { items: Item[]; subtotal: number; tax: number; total: number }

const triggers = {
  NEW_USER_CREATED: "When a new user is created",
  ORDER_SUBMITTED: "When an order is submitted",
}

const myCondition = arule.createCondition(
  "total",
  "is greater than or equal to",
  100
)

const myCallback = (order: Order) => alert(`Order of ${order.total} submitted!`)

const rule = arule.createRule(
  triggers.ORDER_SUBMITTED,
  [myCondition],
  myCallback,
  "Show alert on order submission"
)
```

<hr>

### Callbacks

This a function that's call when a rule is invoked and all conditions are met. Rules are invoked by using the `executeRulesWithTrigger` function, which is covered below. This function takes in data to evaluate. This data is also passed to the callback function.

```typescript
const exampleCallback = (data: DataType) => {
  /* do stuff */
}
```

Tip: You may want to use user-submitted values in your callbacks. To do this, create a function that takes in the user-submitted values and returns another function. Use this returned function for your automation rule's callback.

Example:

```typescript
function getRuleCallback(value: string) {
  return (data: DataType) => {
    // some code that uses value
    // ...and maybe data
    }

const myCallback = getRuleCallback(someUserSubmittedValue)
```

### Executing rules

#### executeRulesWithTrigger

Execute all rules with a particular trigger. Place this method in your code where that trigger occurs. For example, if your trigger is "When a user is created", add this to the code that creates a new user.

```typescript
function executeRulesWithTrigger<DataType>(trigger: Trigger, data: DataType)
```

<hr>

### Logging

You can also enable logging on success and/or failure of rules.

#### setLogging

```typescript
function setLogging({
  onSuccess,
  onFailure,
}: {
  onSuccess: boolean
  onFailure: boolean
})
```

- `isSuccess` - Boolean that indicates whether all of the conditions were met and the callback was executed.
- `failedCondition` - The first condition that failed if the rule failed to succeed.

#### setLogCallback

Logging fires a callback function that you define. This allows you to customize how you log results.

```typescript
type Callback = (
  rule: Rule,
  isSuccess: boolean,
  data: any,
  failedCondition?: Condition
) => {
  /* do stuff */
}

function setLogCallback(callback: Callback)
```

### Persisting rules

Obviously, you will want the ability to persist automation rules created by your users in a database. The following section outlines how this is achieved.

#### Function Dictionary

Since functions themselves can't be stored to and retrieved from a database, we instead associate a name (string) with a function and store the name. A `FunctionDictionary` is an object that stores the names as keys and their functions as values. This is hard-coded and set once in your application's code.

Example:

```typescript
arule.setFunctionDictionary({
  sayhello: (data: { name: string }) => alert(`Hello ${data.name}!`),
  saygoodbye: (data: { name: string }) => alert(`Goodbye ${data.name}!`),
})
```

#### getJsonStringFromRule

```typescript
function getJsonStringFromRule(rule: Rule): string
```

Rules will be stored as JSON in your database. This is a function that returns a JSON string version of your rule that you can store in your database.

#### getRuleFromJsonString

```typescript
function getRuleFromJsonString(json: string): Rule
```

This function will convert a JSON string retrieved from your database back to a `Rule` that can be executed in code.

### Additional functions

#### getRules ()

This method will return an array of all currently active rules.

Example:

```typescript
arule.getRules()
/*=> [
  { trigger: "When thing happens", 
    conditions: [arule.condition("key", "equals", "value")],
    callback: (data) => { console.log(data) }
    description: "Log the data when thing happens"
  },
  { trigger: "When other thing happens", 
    conditions: [arule.condition("key", "equals", "value")],
    callback: (data) => { alert(data.key) }
    description: "Alert the value of the key when other thing happens"
  }
]
*/
```

<hr>

#### getRulesByTrigger ()

```typescript
function getRulesByTrigger(trigger: Trigger)
```

This method will return an array of all currently active rules for a specific trigger.

Example:

```typescript
arule.getRulesByTrigger("when thing happens")
/*=> [
  { trigger: "When thing happens", 
    conditions: [arule.condition("key", "equals", "value")],
    callback: (data) => { console.log(data) }
    description: "Log the data when thing happens"
  }
]
*/
```
