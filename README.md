# [Spindle](https://uniphil.gitbooks.io/spindle/content/)

Spindle is a tiny helper for structuring React components in a way that's easy
to create, maintain, reuse, and scale. And it's _really fast_, for free!

**Spindle creates just plain-old regular React components**, so you can
immediately drop them into any React project, and you can always nest other
React components inside spindle components. There is no tie-in. And at about 200
lines of JS, it's almost free to add to your project.

```bash
$ npm install spindle-ui results
```

**[Docs](https://uniphil.gitbooks.io/spindle/content/)**

Spindle lets you specify components with a few pure functions that fit together
well. For example, a counter built out of **Action**, **init**, **update**, and
**view**:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Union } from 'results';
import Spindle, { Update } from 'spindle-ui';

const Action = Union({
  Increment: null,
  Decrement: null,
});

const init = () =>
  Update({ model: 0 });

const update = (action, model) => Action.match(action, {
  Increment: () =>
    Update({ model: model + 1 }),
  Decrement: () =>
    Update({ model: model - 1 }),
});

const view = (model, dispatch) => (
  <p>
    <button onClick={dispatch.Decrement}>-</button>
    {model}
    <button onClick={dispatch.Increment}>+</button>
  </p>
);

const Counter = Spindle('Counter',
  { Action, init, update, view });


ReactDOM.render(<Counter />, document.getElementById('app'));
```

Compose your application by just nesting other components in your views. A
cheeky example: here is how to write a pair of the above counters:

```js
const pairView = () => (
  <div>
    <Counter />
    <Counter />
  </div>
);

const Pair = component('Pair', { view: pairView });

ReactDOM.render(<Pair />, document.getElementById('app'));
```

Spindle takes inspiration from the amazing [elm](http://elm-lang.org/) language
and architecture, but leverages React to do the bookkeeping. This makes it
incredibly easy to nest components and add features without friction.

React `propTypes` can be specified on Spindle components. In fact, Spindle takes
this concept a step further and lets you specify `modelType`, `cbTypes`, and
even `TypedAction`s!

[immutablejs](http://facebook.github.io/immutable-js/) collections are supported
(but completely optional!) for your component's `model`, providing a great
option for keeping everything correct _and_ fast.

To see how to solve lots of different UI challenges with Spindle, check out the
[examples/](examples/) folder in this repository:

- [List of counters](examples/n-counters) for managing **dynamic children**
- [Sum of counters](examples/sum-counters) for passing **data to parents**
- [Constrained counters](examples/constrained-counters) for passing **data to
  children**
- [Wrapper](examples/wrapper) implements a Box component that can **wrap**
  children
- [Clock](examples/clock) **subscribes** to `seconds` to show the current time
- [Dice roll](examples/diceroll) uses a **command** to ask for a random number
  (which is a side-effect)
- [Draggable](examples/draggable) uses dynamic **subscriptions** for mouse
  events.
- [RepoInfo](examples/Repo-info) fetches data over HTTP with a **command**

Spindle aims to be extremely developer-friendly. A confusing error message is a
bug, so if you find one, please
[open an issue](https://github.com/openride/spindle/issues/new)!

### What next?

Check out [the Spindle guide](https://uniphil.gitbooks.io/spindle/content/)
