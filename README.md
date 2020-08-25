# automation_rules README

### Mappings

Mappings associate human-readable strings with actual key names from your object-oriented data. This is currently hard-coded in `mappings.js`

Example:

```javascript
module.exports = {
  Assignee: "assignee",
  "Card title": "cardTitle",
  "Current status": "currentStatus",
  "Previous status": "previousStatus",
  "Team assigned": "teamAssigned",
}
```

### Operators

Operators are used to compare two pieces of information. These are static and provided by the library.

To use, require the index.js file and then use `.op.` to access the operators.

Example:

```javascript
const ar = require("./index")
ar.op.equals
```

<details>
<summary>Valid operators</summary>
<ul>
<li>equals</li>
<li>doesNotEqual</li>
<li>didEqual</li>
<li>didNotEqual</li>
<li>doesInclude</li>
<li>doesNotInclude</li>
<li>hasChanged</li>
<li>hasNotChanged</li>
<li>isGreatherThan</li>
<li>isGreatherThanOrEqualTo</li>
<li>isLessThan</li>
<li>isLessThanOrEqualTo</li>
<li>isFalsy</li>
<li>isTruthy</li>
</ul>
</details>

### Trigger ({target, event}: {target: _string_, event: _string_})

Triggers are really just strings broken up into 'target' and 'event' that relate to your application. They can be whatever you want and are purely used for your users to select a scenario to create a new rule around. It is broken up to make it easier to create various combinations.

Example:

```javascript
const trigger = new ar.Trigger({ target: "Assignee", event: "has changed" })
```

### Condition {param1, operator, param2}: {param1: **Mappings** key, operator: **Operator**, param2: _any_})

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
conditions: **Condition**[]<br>
trigger: **Trigger**

Rules combine triggers and conditions with an action to perform when the trigger and conditions are both met.

Example:

```javascript
const rule = new ar.Rule({
  action: () => console.log("rule fired"),
  conditions: [condition],
  trigger: trigger,
})
```

### setRules ([Rule 1, Rule 2, ...])

This method sets the list of rules that the library is aware of. (maintained in memory)

### execute (Trigger, data)

This method will execute all rules for a particular trigger. Place this method in your code where that trigger occurs.g
