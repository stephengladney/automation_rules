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

<hr>

### Operators

Operators are used to compare two pieces of information. These are static and provided by the library.

To use, require the index.js file and then use `.Op.` to access the operators.

Example:

```javascript
const ar = require("./index")
ar.Op.equals
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

<hr>

### _class_ Trigger (event)

(event: _string_)

Triggers are just strings to describe a scenario where you'd like to execute an automation rules.

Example:

```javascript
const trigger = new ar.Trigger("Assignee is updated")
```

<hr>

### _class_ Condition ({param1, operator, param2})

{param1: **Mappings** key, operator: **Operator**, param2: _any_}

Conditions allow you to verify that a specific scenario has been met.

Example:

```javascript
const condition = new ar.Condition({
  param1: "Assignee",
  operator: ar.Op.equals,
  param2: "Sam",
})
```

**NOTE:** If you want to use past evaluating operators (didEqual, didNotEqual, hasChanged, hasNotChanged), your data will need to contain a key called `previous` that contains the object's previous state.

<hr>

### _class_ Rule ({action, conditions, trigger})

{action: _function_, conditions: **Condition**[], trigger: **Trigger**}

Rules combine triggers and conditions with an action to perform when the trigger and conditions are both met.

Example:

```javascript
const rule = new ar.Rule({
  action: () => console.log("rule fired"),
  conditions: [condition, ...],
  trigger: trigger,
})
```

<hr>

### setRules ([Rule 1, Rule 2, ...])

This method sets the list of rules that the library is aware of. (maintained in memory)

<hr>

### execute (Trigger, data)

This method will execute all rules for a particular trigger. Place this method in your code where that trigger occurs.

Example:

```javascript
//do thing A
ar.execute(triggerForThingA, data)
```
