# automation-rules

Automation rules allow your app's users to created automated workflows when events occur and certain conditions are met. For example, say your app processes transactions for a store and the store owner wants to offer a 10% discount on purchases over $100. The owner can create an automation rule to automatically apply the discount when an order over $100 is placed.

## Getting Started

To install the package, run `npm install automation-rules` in your terminal

Add `import ar from "automation-rules` in your code wherever you wish to use the library.

Rules are composed of four parts: Trigger, Conditions, Callback and Description.

### Triggers

A `Trigger` is a string that describes a particular event in your app that you want to allow users to build an automation rule around.

```typescript
const myTriggers = {
  NEW_USER_CREATED: "When a new user is created",
  ORDER_SUBMITTED: "When an order is submitted",
}
```

### Params

The library works by reading object key/value pairs of data provided to evaluate whether or not conditions are met. Before creating rules, you must tell the library the names of the keys you wish to evaluate.

Example:

Your want to evaluate the total price of an order. Your Order object has a key named `total`.

```typescript
type Order = { items: Item[]; subtotal: number; tax: number; total: number }
```

Example:

```typescript
ar.op.addParam("total")
```

<hr>

### Operators

Operators are used to compare two pieces of datainformation. These are static and provided by the library. To access, add `.op.` to your `ar` variable. For convenience of rendering in your UI, these operators resolve to human-readable strings.

Example:

```typescript
ar.op.equals //=> "equals"
ar.op.doesNotEqual //=> "does not equal"
ar.op.didEqual //=> "did equal"
ar.op.didNotEqual //=> "did not equal"
ar.op.doesInclude //=> "does include"
ar.op.doesNotInclude //=> "does not include"
ar.op.hasChanged //=> "has changed"
ar.op.hasNotChanged //=> "has not changed"
ar.op.isGreatherThan //=> "is greater than"
ar.op.isGreatherThanOrEqualTo //=> "is greater than or equal to"
ar.op.isLessThan //=> "is less than"
ar.op.isLessThanOrEqualTo //=> "is less than or equal to"
ar.op.isFalsy //=> "is falsy"
ar.op.isTruthy //=> "is truthy"
```

<hr>

### Conditions

Conditions allow your users to verify that a specific scenario has been met. The `condition` function provides an easy way to get a typesafe condition.

```typescript
function condition<T extends object>(
  param: keyof T,
  operator: Operator,
  value: T[keyof T]
)

type Condition = { param: keyof T; operator: Operator; value: T[keyof T] }
```

Example:

```typescript
type Order = { items: Item[]; subtotal: number; tax: number; total: number }

const condition = ar.condition<Order>(
  "total",
  ar.op.isGreaterThanOrEqualTo,
  100
)
```

<hr>

### Rules

Rules combine triggers, conditions with a callback function to execute when the conditions are met.

```typescript
function rule<DataType>(
  trigger: Trigger,
  conditions: [Condition, ...Condition[]],
  callback: (data: DataType) => unknown,
  description?: string
)
```

Example:

```typescript
type Order = { items: Item[]; subtotal: number; tax: number; total: number }

const triggers = {
  NEW_USER_CREATED: "When a new user is created",
  ORDER_SUBMITTED: "When an order is submitted",
}

const myCondition = ar.condition<Order>(
  "total",
  ar.op.isGreaterThanOrEqualTo,
  100
)

const myCallback = (order: Order) => alert(`Order of ${order.total} submitted!`)

const rule = ar.rule<Order>(
  triggers.ORDER_SUBMITTED,
  [myCondition],
  myCallback,
  "Show alert on order submission"
)
```

<hr>

### Callbacks

This a function to invoke when a trigger occurs and all conditions are met.

```typescript
const exampleCallback = (data: DataType) => {
  /* do stuff */
}
```

### Additional functions

#### addRules

Add rule(s) to the current list of active rules. (maintained in memory)

```typescript
function addRules(...newRules: Rule[])
```

<hr>

#### executeRulesWithTrigger

Execute all rules with a particular trigger. Place this method in your code where that trigger occurs.

```typescript
function executeRulesWithTrigger<DataType>(trigger: Trigger, data: DataType)
```

Example:

```typescript
ar.op.executeAllRulesWithTrigger(trigger, {
  data: { first_name: "Thomas", last_name: "Anderson", age: 34 },
})
```

<hr>

### getRules ({ withTrigger? })

This method will return a JSON payload of rules currently being stored.

Example:

```
ar.op.getRules()
```

Response:

```javascript
;[
  {
    trigger: "Thing happened",
    rules: [
      {
        conditions: [
          { operator: "does not equal", param: "Assignee", value: 2 },
          { operator: "equals", param: "Assignee", value: "Sam" },
        ],
        description: "Log i fired is Assignee is Sam",
        trigger: "Thing happened",
      },
      {
        conditions: [
          { operator: "equals", param: "Assignee", value: "John" },
          { operator: "does not equal", param: "Assignee", value: 4 },
        ],
        description: "Log i fired if Assignee is John",
        trigger: "Thing happened",
      },
    ],
  },
]
```

<hr>

### setLogCallback({ data, failedCondition, isSuccess, rule })

Set the log callback function.

- `failedCondition` - This variable gives you access to which specific condition was not met if the rule fails.
- `isSuccess` - Boolean that indicates whether all of the conditions were met and the callback was executed.
