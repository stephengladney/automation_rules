# Automation Rules

## Classes

### Trigger

target: _string_<br>
event: _string_

Triggers are really just strings broken up into 'target' and 'event' that relate to your application. They can be whatever you want and are purely used for your users to select a scenario to create a new rule around. It is broken up to make it easier to create various combinations.

Example:

```javascript
const trigger = new ar.Trigger({ target: "Assignee", event: "has changed" })
```

### Condition

param1: Mapping key<br>
operator: Operator<br>
param2: any<br>

Conditions allow you to verify that a specific scenario has been met.

Example:

```javascript
const condition = new ar.Condition({
  param1: "Assignee",
  operator: ar.op.equals,
  param2: "Sam",
})
```

**NOTE:** If you want to use past evaluating operators (didEqual, didNotEqual, hasChanged, hasNotChanged), your data will need to contain a key called `previous` and contain its previous state.

### Rule

action: _function_<br>
conditions: Condition[]
trigger: Trigger

Rules combine triggers and conditions with an action to perform when the trigger and conditions are both met.

Example:

```javascript
const rule = new ar.Rule({
  action: () => console.log("rule fired"),
  conditions: [condition],
  trigger: trigger,
})
```
