import React from 'react';
import { Record } from 'immutable';
import { Union } from 'results';
import Spindle, { Update } from '../../spindle';


const Model = Record({
  value: 0,
});


const init = () =>
  Update({ model: Model() });


const Action = Union({
  Increment: null,
  Decrement: null,
});


const update = (action, model) => Action.match(action, {
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


const view = (model, dispatch) => (
  <p>
    <button onClick={dispatch.Decrement}>-</button>
    {model.get('value')}
    <button onClick={dispatch.Increment}>+</button>
  </p>
);


export default Spindle('Counter',
  { Action, init, update, view });
