import React from 'react';
import { Union } from 'results';
import { Record } from 'immutable';
import { component, Update } from '../../spindle';


const Msg = Union({
  Increment: null,
  Decrement: null,
});


const Model = Record({
  value: 0,
});


const init = () =>
  Update({ model: Model() });


const update = (msg, model) => Msg.match(msg, {
  Increment: () =>
    Update({ model: model.update('value', v => v + 1) }),

  Decrement: () =>
    Update({ model: model.update('value', v => v - 1) }),
});


const view = (model, dispatch) => (
  <p>
    <button onClick={dispatch.Decrement}>-</button>
    {model.get('value')}
    <button onClick={dispatch.Increment}>+</button>
  </p>
);


export default component('Counter',
  { Msg, init, update, view });
