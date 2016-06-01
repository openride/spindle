# Spindle

Spindle is a tiny helper for structuring React components in a way that's easy
to create, maintain, reuse, and scale. And it's _really fast_, for free!

**Spindle creates just plain-old regular React components**, so you can
immediately drop them into any React project, and you can always nest other
React components inside spindle components. There is no tie-in. And at < 200
lines of JS, it's almost free to add to your project.

Spindle lets you make components out of a **Model**, **Msg** (for actions), an
**update** function, and a **view** function. For example, a simple counter:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Record } from 'immutable';
import { Union } from 'results';
import { component, Update } from 'spindle-ui';

const Model = Record({
  value: 0,
});

const Msg = Union({
  Increment: null,
  Decrement: null,
});

const update = (msg, model) => Msg.match(msg, {
  Increment: () =>
    Update({ model: model.update('value', v => v + 1) }),
  Decrement: () =>
    Update({ model: model.update('value', v => v - 1) }),
});

const view = (model, BoundMsg) => (
  <p>
    <button onClick={BoundMsg.Decrement}>-</button>
    {model.get('value')}
    <button onClick={BoundMsg.Increment}>+</button>
  </p>
);


const Counter = component('Counter',
  { Model, Msg, update, view });


ReactDOM.render(<Counter />, document.getElementById('app'));
```

Simpler components might only need a **view**, while more sophisticated
components can use **handleProps** and **onEmit** to pass data between parents
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

Proper docs coming soon... :)
