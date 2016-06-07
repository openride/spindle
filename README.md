# Spindle

Spindle is a tiny helper for structuring React components in a way that's easy
to create, maintain, reuse, and scale. And it's _really fast_, for free!

**Spindle creates just plain-old regular React components**, so you can
immediately drop them into any React project, and you can always nest other
React components inside spindle components. There is no tie-in. And at < 200
lines of JS, it's almost free to add to your project.

Spindle lets you make components out of **Action**s, **init** and **update**
functions, and a **view** function. For example, a simple counter:

```jsx
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

Simpler components might only need a **view**, while more sophisticated
components can use **propsUpdate** and **onEmit** to pass data between parents
and children, and **commands** and **subscriptions** to get domain data and
side-effects in and out. With that, I've already name-dropped everything in
spindle's component API!

Spindle takes inspiration from the amazing [elm](http://elm-lang.org/) language
and architecture, but leverages React to do the bookkeeping. This makes it
incredibly easy to nest components and add features without touching any parent
components.

A cheeky example: here is how to write a pair of the above counters

```jsx
const pairView = () => (
  <div>
    <Counter />
    <Counter />
  </div>
);

const Pair = component('Pair', { view: pairView });

ReactDOM.render(<Pair />, document.getElementById('app'));
```

Proper docs coming soon! In the mean time, check out [examples/](examples/)

- [List of counters](examples/n-counters) for managing **dynamic children**
- [Sum of counters](examples/sum-counters) for passing **data to parents**
- [Constrained counters](examples/constrained-counters) for passing **data to
  children**
- [Wrapper](examples/wrapper) implements a Box component that can **wrap**
  children
- [Clock](examples/clock) **subscribes** to `seconds` to show the current time
- [Dice roll](examples/diceroll) uses a **command** to ask for a random number
  (which is a side-effect)
