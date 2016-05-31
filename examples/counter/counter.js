import React from 'react';
import { Union } from 'results';
import { Record } from 'immutable';
import { component, Update } from '../../spindle';


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


export default component('Counter',
  { Model, Msg, update, view });
