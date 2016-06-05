import React from 'react';
import { Record } from 'immutable';
import { Union } from 'results';
import { component, Update } from '../../spindle';


const Model = Record({
  value: 0,
});


const init = () =>
  Update({ model: Model() });


const Msg = Union({
  Increment: null,
  Decrement: null,
});


const update = (msg, model) => Msg.match(msg, {
  Increment: () => {
    const newModel = model.update('value', v => v + 1);
    return Update({
      model: newModel,
      emit: newModel.get('value'),
    });
  },

  Decrement: () => {
    const newModel = model.update('value', v => v - 1);
    return Update({
      model: newModel,
      emit: newModel.get('value'),
    });
  },
});


const view = (model, BoundMsg) => (
  <p>
    <button onClick={BoundMsg.Decrement}>-</button>
    {model.get('value')}
    <button onClick={BoundMsg.Increment}>+</button>
  </p>
);


export default component('Counter',
  { Msg, init, update, view });
