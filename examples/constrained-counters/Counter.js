import React from 'react';
import { Record } from 'immutable';
import { Union, Maybe } from 'results';
import Spindle, { Update } from '../../spindle';


const Model = Record({
  value: 0,
  min: -Infinity,
  max: Infinity,
});


const Action = Union({
  Increment: null,
  Decrement: null,
});


// this is just a helper, it's not a special funciton
const constrain = model => {
  const { value, min, max } = model.toObject();
  return model.set('value', Math.max(min, Math.min(max, value)));
}


const init = props =>
  propsUpdate(props, Model());


const propsUpdate = ({ min = -Infinity, max = Infinity }, model) =>
  Update({ model: constrain(model.merge({ min, max })) });


const update = (action, model) => Action.match(action, {
  Increment: () => {
    const newModel = constrain(model.update('value', v => v + 1));
    return Update({
      model: newModel,
      emit: newModel.get('value'),
    });
  },

  Decrement: () => {
    const newModel = constrain(model.update('value', v => v - 1));
    return Update({
      model: newModel,
      emit: newModel.get('value'),
    });
  },
});


const view = (model, dispatch) => (
  <p>
    <button
      disabled={model.get('value') <= model.get('min')}
      onClick={dispatch.Decrement}>
      -
    </button>
    {model.get('value')}
    <button
      disabled={model.get('value') >= model.get('max')}
      onClick={dispatch.Increment}>
      +
    </button>
  </p>
);


export default Spindle('Counter',
  { Action, init, propsUpdate, update, view });
