# Spindle

An alternative, small, functional API for creating react components and
communicating between them, including elm-inspired commands and subscriptions.

Blah blah blah

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Record } from 'immutable';
import { Union } from 'results';
import { component, Update } from 'spindle';

const Model = Record({
  value: 0
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
